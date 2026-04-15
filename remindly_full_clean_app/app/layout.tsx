import './globals.css';

export const metadata = {
  title: 'Remindly',
  description: 'A clean reminder app'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
