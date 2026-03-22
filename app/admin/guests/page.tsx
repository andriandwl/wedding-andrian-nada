import type { Metadata } from 'next';
import GuestListClient from '@/components/admin/GuestListClient';

export const metadata: Metadata = { title: 'Daftar Tamu' };

export default function GuestsPage() {
  return <GuestListClient />;
}
