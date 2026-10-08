import { useNavigate } from "react-router-dom";

export function Appbar({ firstName }: { firstName: string }) {
  const navigate = useNavigate();
  const initial = firstName[0]?.toUpperCase() || "P";

  return (
    <header className="sticky top-0 z-10 border-b border-slate-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 font-black tracking-tight text-slate-900"><span className="grid h-8 w-8 place-items-center rounded-xl bg-blue-600 text-lg text-white">P</span>PayNest</button>
        <div className="flex items-center gap-3">
          <div className="hidden text-right text-sm sm:block"><p className="font-semibold text-slate-800">{firstName || "Welcome"}</p><p className="text-xs text-slate-400">Personal account</p></div>
          <div className="grid h-9 w-9 place-items-center rounded-full bg-blue-50 font-bold text-blue-700">{initial}</div>
        <button
          onClick={() => { localStorage.removeItem("token"); navigate("/signin"); }}
          className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
        >
          Log out
        </button>
        </div>
      </div>
    </header>
  );
}
