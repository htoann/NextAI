import { dbConnect } from '@/lib/db';
import ClientRootLayout from './client-root-layout';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  await dbConnect();
  return <ClientRootLayout>{children}</ClientRootLayout>;
}
