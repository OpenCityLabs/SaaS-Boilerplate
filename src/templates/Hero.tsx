import { useTranslations } from 'next-intl';

import { badgeVariants } from '@/components/ui/badgeVariants';
import { CenteredHero } from '@/features/landing/CenteredHero';
import { Section } from '@/features/landing/Section';

export const Hero = () => {
  const t = useTranslations('Hero');

  return (
    <Section className="pb-24 pt-36">
      <CenteredHero
        banner={(
          <span className={`${badgeVariants()} px-5 py-2 !text-xl`}>
            {t('follow_twitter')}
          </span>
        )}
        title={t.rich('title', {
          important: chunks => (
            <span className="bg-gradient-to-r from-blue-700 via-blue-500 to-blue-300 bg-clip-text text-transparent">
              {chunks}
            </span>
          ),
        })}
        description={t.raw('description')}
        buttons={(
          <div className="flex flex-col items-center gap-2">
            <a
              className="inline-flex h-11 items-center justify-center rounded-md bg-[#00A651] px-8 text-base font-medium text-white shadow transition-colors hover:bg-[#008F45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              href="/waitlist"
            >
              {t('primary_button')}
            </a>
            <span className="text-sm text-muted-foreground">
              {t('button_subtext')}
            </span>
          </div>
        )}
      />
    </Section>
  );
};
