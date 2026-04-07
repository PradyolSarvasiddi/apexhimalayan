import './main.css';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { Animations } from '@/components/ui/Animations';
import LenisProvider from '@/components/providers/LenisProvider';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="main-site" id="main-site">
      <LenisProvider>
        <Navbar />
        {children}
        <div className="combined-himalaya-bg-4">
          <Footer />
        </div>
        <Animations />
      </LenisProvider>
    </div>
  );
}
