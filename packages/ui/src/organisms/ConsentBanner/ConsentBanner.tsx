import { useEffect, useId, useRef, type ComponentProps, type ReactNode } from 'react';
import { Button } from '../../atoms/Button/Button';
import { Heading } from '../../atoms/Heading/Heading';
import { Text } from '../../atoms/Text/Text';
import { cn } from '../../utils/cn';
import { consentBannerLinkVariants, consentBannerVariants } from './ConsentBanner.variants';

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

/** Cookie notice with a choice at the bottom of the page: both buttons carry the same weight. */
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

  useEffect(() => {
    if (focusOnMount) titleRef.current?.focus();
  }, [focusOnMount]);

  return (
    <section
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
