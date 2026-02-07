interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="grid grid-cols-[220px_1fr] min-h-screen">
      {children}
    </div>
  );
}
