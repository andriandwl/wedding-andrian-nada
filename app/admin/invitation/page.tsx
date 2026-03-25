import type { Metadata } from 'next';
import InvitationSettingsClient from '@/components/admin/InvitationSettingsClient';

export const metadata: Metadata = { title: 'Pengaturan Undangan' };

export default function InvitationPage() {
  return <InvitationSettingsClient />;
}
