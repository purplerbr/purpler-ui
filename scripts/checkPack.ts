import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export interface PackResult {
  name: string;
  version: string;
  files: string[];
  manifest: Record<string, unknown>;
}

export interface Output {
  log(message: string): void;
  error(message: string): void;
}

export const PUBLIC_WORKSPACES = ['packages/tokens', 'packages/ui'] as const;

const ROOT = new URL('../', import.meta.url);
// Inside the repo and ignored by git, so the check writes nothing outside it (CLAUDE.md R23).
const OUT_DIR = new URL('node_modules/.cache/purpler-pack-check/', ROOT);
const ALWAYS_PACKED = new Set(['package.json', 'README.md', 'LICENSE', 'CHANGELOG.md']);
const DEPENDENCY_FIELDS = ['dependencies', 'peerDependencies', 'optionalDependencies'] as const;
const FORBIDDEN = [
  /\.map$/,
  /\.test\./,
  /\.stories\./,
  /(^|\/)\.env/,
  /\.tsbuildinfo$/,
  /(^|\/)src\//,
];

const NODE_OUTPUT: Output = {
  log: process.stdout.write.bind(process.stdout),
  error: process.stderr.write.bind(process.stderr),
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/** Paths listed by `yarn pack --json` (one JSON object per line). */
export function parsePackOutput(output: string): string[] {
  return output
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map((line): unknown => JSON.parse(line))
    .flatMap((entry) =>
      isRecord(entry) && typeof entry.location === 'string' ? [entry.location] : []
    );
}

/** Problems that would leak something other than the build into the public package. */
export function findPackProblems(files: readonly string[]): string[] {
  const problems = files.flatMap((file) => {
    if (FORBIDDEN.some((pattern) => pattern.test(file))) return [`forbidden file: ${file}`];
    if (!file.startsWith('dist/') && !ALWAYS_PACKED.has(file))
      return [`file outside dist/: ${file}`];
    return [];
  });
  if (!files.includes('dist/index.js'))
    problems.push('missing dist/index.js (run yarn build first)');
  return problems;
}

/** The packed manifest must not keep `workspace:` and must pin @purplerbr packages exactly. */
export function findManifestProblems(manifest: Record<string, unknown>): string[] {
  return DEPENDENCY_FIELDS.flatMap((field) => {
    const dependencies = manifest[field];
    if (!isRecord(dependencies)) return [];
    return Object.entries(dependencies).flatMap(([name, range]) => {
      const value = String(range);
      if (value.startsWith('workspace:')) return [`${field}.${name} keeps ${value}`];
      if (name.startsWith('@purplerbr/') && !/^\d+\.\d+\.\d+(-[\w.]+)?$/.test(value))
        return [`${field}.${name} is not an exact version: ${value}`];
      return [];
    });
  });
}

/** Packs a workspace with Yarn, as the release publishes it, and reads the packed manifest. */
export function yarnPack(workspace: string): PackResult {
  const cwd = fileURLToPath(new URL(`${workspace}/`, ROOT));
  const tarball = fileURLToPath(new URL(`${workspace.replace('/', '-')}.tgz`, OUT_DIR));
  mkdirSync(OUT_DIR, { recursive: true });
  const output = execFileSync('yarn', ['pack', '--json', '--out', tarball], {
    cwd,
    encoding: 'utf8',
  });
  const manifest: unknown = JSON.parse(
    execFileSync('tar', ['-xOzf', tarball, 'package/package.json'], { encoding: 'utf8' })
  );
  if (!isRecord(manifest)) throw new Error(`Packed manifest of ${workspace} is not an object`);
  return {
    name: String(manifest.name),
    version: String(manifest.version),
    files: parsePackOutput(output),
    manifest,
  };
}

/** Checks the contents and the manifest of each workspace package; returns the exit code. */
export function checkPackages(
  workspaces: readonly string[],
  pack: (workspace: string) => PackResult = yarnPack,
  output: Output = NODE_OUTPUT
): number {
  let exitCode = 0;
  for (const workspace of workspaces) {
    const result = pack(workspace);
    const problems = [...findPackProblems(result.files), ...findManifestProblems(result.manifest)];
    output.log(`${result.name}@${result.version}: ${String(result.files.length)} files\n`);
    for (const problem of problems) output.error(`  ${problem}\n`);
    if (problems.length > 0) exitCode = 1;
  }
  return exitCode;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = checkPackages(PUBLIC_WORKSPACES);
}
