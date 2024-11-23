export function Logo({ className }: { className?: string }) {
  return (
    <div className={className}>
      <img src="/logo.svg" alt="Bifrost Logo" className="h-full w-auto" />
    </div>
  );
}
