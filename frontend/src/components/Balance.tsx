export function Balance({ value }: { value: number | null }) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-6 text-white shadow-xl shadow-blue-200 sm:p-8">
      <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-white/10" />
      <div className="relative"><p className="text-sm font-medium text-blue-100">Available balance</p><p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{value === null ? <span className="animate-pulse">Loading balance...</span> : `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}</p><div className="mt-6 flex items-center gap-2 text-sm text-blue-100"><span className="h-2 w-2 rounded-full bg-emerald-300" /> Account is secure and ready to use</div></div>
    </section>
  );
}
