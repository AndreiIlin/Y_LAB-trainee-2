import LocaleSelect from '@src/features/example-i18n/components/locale-select';
import MainMenu from '@src/features/navigation/components/main-menu';
import RedactorBoard from '@src/features/redactor/components/redactor-board';
import useI18n from '@src/services/i18n/use-i18n';
import PageLayout from '@src/ui/layout/page-layout';
import Head from '@src/ui/navigation/head';
import { memo } from 'react';

function RedactorPage() {
  const { t } = useI18n();

  return (
    <PageLayout>
      <Head title="React Skeleton"><LocaleSelect /></Head>
      <MainMenu />
      <h2>{t('redactor.title')}</h2>
      <RedactorBoard />
    </PageLayout>
  );
}

export default memo(RedactorPage);
