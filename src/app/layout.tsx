import { auth } from '@/auth';
import '@/src/app/ui/global.css';
import { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { Poppins } from 'next/font/google';
import { WishlistProvider } from '@/src/app/lib/contexts/WishlistContext';
import { CartProvider } from '@/src/app/lib/contexts/CartContext';

export const metadata: Metadata = {
  title: {
    template: '%s | SneakerShooes',
    default: 'SneakerShooes',
  },
  description: 'Zapatillas zapatos de la mejor calidad y precio, entrega rápida y segura',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'SneakerShooes',
    description: 'Zapatillas y zapatos de la mejor calidad y precio. Entrega rápida y segura.',
    images: [
      {
        url: '/openGrpahimagen.webp',
        width: 1200,
        height: 630,
        alt: 'SneakerShooes - Zapatillas y zapatos',
      },
    ],
    locale: 'es_PE',
    type: 'website',
  },
};

const poppins = Poppins({ subsets: ["latin"], weight: ["300", "500", "700"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="es">
      <body className={poppins.className}>
        <SessionProvider session={session}>
          <CartProvider>
            <WishlistProvider>
              {children}
            </WishlistProvider>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
