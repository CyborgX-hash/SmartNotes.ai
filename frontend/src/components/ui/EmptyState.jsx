export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
          <Icon className="w-8 h-8 text-brand-400" />
        </div>
      )}
      <h3 className="text-xl font-bold font-heading text-white mb-2">{title}</h3>
      {description && <p className="text-slate-400 max-w-md mb-6">{description}</p>}
      {action}
    </div>
  );
}
