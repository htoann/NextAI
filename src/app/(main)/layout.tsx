import { NavBar } from '@/components/layout/Navbar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      <div style={{ marginTop: 56 }}>{children}</div>
    </>
  );
}
