export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in bg-background shadow-[var(--shadow-recessed)] rounded-2xl border border-white/10 max-w-xl mx-auto my-8">
      {Icon && (
        <div className="w-14 h-14 rounded-full bg-background border border-white/50 flex items-center justify-center mb-6 shadow-[var(--shadow-card)]">
          <Icon className="w-6 h-6 text-accent" />
        </div>
      )}
      <h3 className="text-lg font-bold tracking-tight text-foreground font-mono mb-2 uppercase">{title}</h3>
      {description && <p className="text-mutedForeground max-w-md text-xs font-mono mb-6 uppercase tracking-wider">{description}</p>}
      {action}
    </div>
  );
}
