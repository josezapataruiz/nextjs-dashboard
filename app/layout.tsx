import '@/app/ui/global.css'
import { inter } from '@/app/ui/fonts'
import { ChildrenType } from './lib/definitions';

export default function RootLayout({
  children,
}: ChildrenType) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
