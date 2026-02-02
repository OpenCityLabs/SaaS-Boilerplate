export default function AuthLayout(props: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // TODO: Add custom auth provider in Phase 4
  return <>{props.children}</>;
}
