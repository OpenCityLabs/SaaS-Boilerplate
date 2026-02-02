export default function CenteredLayout(props: { children: React.ReactNode }) {
  // TODO: Add auth check in Phase 4 to redirect authenticated users
  return (
    <div className="flex min-h-screen items-center justify-center">
      {props.children}
    </div>
  );
}
