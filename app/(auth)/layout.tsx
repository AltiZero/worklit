export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-6">
      <div className="w-full max-w-[420px] bg-bg-card border border-border rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] p-10 max-[600px]:p-7">
        {children}
      </div>
    </div>
  );
}
