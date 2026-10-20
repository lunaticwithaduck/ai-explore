'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { AdminPage } from '../components/AdminPage/AdminPage';
import { BundlesTab } from '../components/BundlesTab/BundlesTab';
import { InterestTab } from '../components/InterestTab/InterestTab';
import { ToolsTab } from '../components/ToolsTab/ToolsTab';
import { UpdatesTab } from '../components/UpdatesTab/UpdatesTab';
import { ADMIN_TABS, type AdminTab } from '../config/constants';

export type AdminViewProps = Record<string, never>;

export function AdminView(_props: AdminViewProps) {
  const t = useTranslations('admin');
  const [tab, setTab] = useState<AdminTab>('tools');
  return (
    <AdminPage title={t('title')}>
      <Tabs value={tab} onValueChange={(value) => setTab(value as AdminTab)}>
        <TabsList aria-label={t('tabs.label')}>
          {ADMIN_TABS.map((value) => (
            <TabsTrigger key={value} value={value}>
              {t(`tabs.${value}`)}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="tools">
          <ToolsTab />
        </TabsContent>
        <TabsContent value="bundles">
          <BundlesTab />
        </TabsContent>
        <TabsContent value="updates">
          <UpdatesTab />
        </TabsContent>
        <TabsContent value="interest">
          <InterestTab />
        </TabsContent>
      </Tabs>
    </AdminPage>
  );
}
