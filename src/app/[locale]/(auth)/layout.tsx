import { AuthProvider } from '@/contexts/AuthContext';

export default function AuthLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  return <AuthProvider>{props.children}</AuthProvider>;
}
