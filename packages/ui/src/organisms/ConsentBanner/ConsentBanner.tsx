import {
  useEffect,
  useId,
  useRef,
  type ComponentProps,
  type ReactNode,
  type RefObject,
} from 'react';
import { Button } from '../../atoms/Button/Button';
import { Heading } from '../../atoms/Heading/Heading';
import { Text } from '../../atoms/Text/Text';
import { cn } from '../../utils/cn';
import {
  CONSENT_BANNER_HEIGHT,
  consentBannerLinkVariants,
  consentBannerVariants,
} from './ConsentBanner.variants';

// styles.css reads the height to keep focus, the page end and FloatingContactLink above the banner.
function usePublishedHeight(ref: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    const root = document.documentElement.style;
    const publish = () => {
      root.setProperty(CONSENT_BANNER_HEIGHT, `${String(Math.ceil(element.offsetHeight))}px`);
    };
    publish();
    const observer =
      typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(publish);
    observer?.observe(element);
    return () => {
      observer?.disconnect();
      root.removeProperty(CONSENT_BANNER_HEIGHT);
    };
  }, [ref]);
}

export type ConsentBannerProps = Omit<ComponentProps<'section'>, 'title'> & {
  /** What is measured, by whom and where the data goes; the privacy link follows it. */
  description: ReactNode;
  privacyHref: string;
  onAccept: () => void;
  onReject: () => void;
  /** Moves the focus to the title on mount, as when the user reopens the banner from the footer. */
  focusOnMount?: boolean;
  title?: string;
  privacyLabel?: string;
  acceptLabel?: string;
  rejectLabel?: string;
};

/** Cookie notice with a choice at the bottom of the page: both buttons carry the same weight.
 * While open, it publishes its height so nothing on the page stays hidden under it. */
export function ConsentBanner({
  className,
  description,
  privacyHref,
  onAccept,
  onReject,
  focusOnMount = false,
  title = 'Cookies e privacidade',
  privacyLabel = 'Política de privacidade',
  acceptLabel = 'Aceitar',
  rejectLabel = 'Recusar',
  ...props
}: ConsentBannerProps) {
  const titleId = useId();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  usePublishedHeight(sectionRef);

  useEffect(() => {
    if (focusOnMount) titleRef.current?.focus();
  }, [focusOnMount]);

  return (
    <section
      ref={sectionRef}
      data-slot="consent-banner"
      aria-labelledby={titleId}
      className={cn(consentBannerVariants(), className)}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="grid gap-1">
          <Heading ref={titleRef} id={titleId} level={2} size="title-3" tabIndex={-1}>
            {title}
          </Heading>
          <Text size="small" tone="muted">
            {description}{' '}
            <a href={privacyHref} className={consentBannerLinkVariants()}>
              {privacyLabel}
            </a>
          </Text>
        </div>
        <div className="grid shrink-0 grid-cols-2 gap-3">
          <Button variant="primary" onClick={onAccept}>
            {acceptLabel}
          </Button>
          <Button variant="primary" onClick={onReject}>
            {rejectLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
