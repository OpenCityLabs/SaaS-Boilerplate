import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { CTABanner } from '@/features/landing/CTABanner';
import { Section } from '@/features/landing/Section';

export const CTA = () => {
  const t = useTranslations('CTA');

  return (
    <Section>
      <CTABanner
        title={t('title')}
        description={t('description')}
        buttons={(
          <Link
            className="inline-flex h-11 items-center justify-center rounded-md bg-[#00A651] px-8 text-base font-medium text-white shadow transition-colors hover:bg-[#008F45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            href="/waitlist"
          >
            {t('button_text')}
          </Link>
        )}
      />
    </Section>
  );
};
