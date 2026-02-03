import { useTranslations } from 'next-intl';

import { badgeVariants } from '@/components/ui/badgeVariants';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { CenteredHero } from '@/features/landing/CenteredHero';
import { Section } from '@/features/landing/Section';

export const Hero = () => {
  const t = useTranslations('Hero');

  return (
    <Section className="py-36">
      <CenteredHero
        banner={(
          <span className={`${badgeVariants()} px-5 py-2 !text-2xl`}>
            {t('follow_twitter')}
          </span>
        )}
        title={t.rich('title', {
          important: chunks => (
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              {chunks}
            </span>
          ),
        })}
        description={t.raw('description')}
        buttons={(
          <>
            <a
              className={buttonVariants({ size: 'lg' })}
              href="https://calendly.com/opencitylabs/demo"
            >
              {t('primary_button')}
            </a>

            <a
              className={buttonVariants({ variant: 'outline', size: 'lg' })}
              href="https://opencitylabs.com"
            >
              {t('secondary_button')}
            </a>
          </>
        )}
      />
    </Section>
  );
};
