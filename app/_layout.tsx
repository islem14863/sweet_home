import { SessionProvider } from './ctx';
import RootLayout from './RootLayout';

export default function Layout() {
  return (
    <SessionProvider>
      <RootLayout />
    </SessionProvider>
  );
}