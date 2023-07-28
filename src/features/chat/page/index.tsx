import ChatBoard from '@src/features/chat/components/chat-board';
import LocaleSelect from '@src/features/example-i18n/components/locale-select';
import MainMenu from '@src/features/navigation/components/main-menu';
import useI18n from '@src/services/i18n/use-i18n';
import PageLayout from '@src/ui/layout/page-layout';
import Head from '@src/ui/navigation/head';
import { memo } from 'react';

function ChatPage() {
  const { t } = useI18n();

  return (
    <PageLayout>
      <Head title="React Skeleton"><LocaleSelect /></Head>
      <MainMenu />
      <h2>{t('chat.title')}</h2>
      <ChatBoard />
    </PageLayout>
  );
}

export default memo(ChatPage);
