/**
 * Threat Intelligence Dashboard
 *
 * Your task: Build out this dashboard to match the provided design reference.
 * See the README for full requirements.
 *
 * The mock API is running at /api/indicators (proxied via Vite).
 * Types are defined in ./types/indicator.ts
 *
 * Good luck!
 */

import { AppLayout, Sidebar, PageHeader } from './components/layout';

function App() {
  return (
    <AppLayout>
      <Sidebar />
      <main className="flex flex-col overflow-x-hidden">
        <PageHeader
          title="Threat Intelligence Dashboard"
          subtitle="Real-time threat indicators and campaign intelligence"
        />
        {/* Content area placeholder for Spec 03 */}
        <div className="flex-1 p-8">
          <div className="flex items-center justify-center h-64 border border-dashed border-border rounded-lg text-text-tertiary">
            Dashboard content will go here (Spec 03)
          </div>
        </div>
      </main>
    </AppLayout>
  );
}

export default App;
