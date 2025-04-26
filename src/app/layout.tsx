import '@/src/app/ui/global.css';
import { Metadata } from 'next';
import { Poppins } from 'next/font/google';

export const metadata: Metadata = {
  title: {
    template: '%s | Dashboard',
    default: 'default Dashboard',
  },
  description: 'The official Next.js Course Dashboard, built with App Router.',
  // metadataBase: new URL('https://mywebsite.com'),
};

const poppins = Poppins({ subsets: ["latin"], weight: ["300", "500", "700"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${poppins.className} bg-gray-100`}>
        {children}
      </body>
    </html>
  );
}
