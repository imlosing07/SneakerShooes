import Footer from './components/Footer';
import Navbar from './components/Navbar';
import './style.css';

export const metadata = {
  title: 'SneekersHooes',
  description: 'SneekersHooes - La tienda de zapatillas más grande de la web',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <div >
        <Navbar />
        {children}
        <Footer />
      </div>
  );
}
