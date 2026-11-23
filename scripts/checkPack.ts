import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

interface PackResult {
  name: string;
  version: string;
  files: { path: string }[];
}

export const PUBLIC_WORKSPACES = ['packages/tokens', 'packages/ui'] as const;

const ALWAYS_PACKED = new Set(['package.json', 'README.md', 'LICENSE', 'CHANGELOG.md']);
const FORBIDDEN = [
  /\.map$/,
  /\.test\./,
  /\.stories\./,
  /(^|\/)\.env/,
  /\.tsbuildinfo$/,
  /(^|\/)src\//,
];

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

function packFiles(workspace: string): PackResult {
  const output = execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], {
    cwd: fileURLToPath(new URL(`../${workspace}/`, import.meta.url)),
    encoding: 'utf8',
  });
  const [result] = JSON.parse(output) as PackResult[];
  if (result === undefined) throw new Error(`npm pack returned nothing for ${workspace}`);
  return result;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  for (const workspace of PUBLIC_WORKSPACES) {
    const result = packFiles(workspace);
    const problems = findPackProblems(result.files.map(({ path }) => path));
    process.stdout.write(`${result.name}@${result.version}: ${result.files.length} files\n`);
    for (const problem of problems) process.stderr.write(`  ${problem}\n`);
    if (problems.length > 0) process.exitCode = 1;
  }
}
