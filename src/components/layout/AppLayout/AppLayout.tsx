interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-augur-blue focus:text-white focus:rounded-md focus:outline-none"
      >
        Skip to main content
      </a>
      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] min-h-screen">
        {children}
      </div>
    </>
  );
}
