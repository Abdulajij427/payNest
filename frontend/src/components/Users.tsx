import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type UserType = { id: number; username: string; firstName: string; lastName: string };

export function Users() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true); setError("");
      axios.get("http://localhost:3000/api/v1/user/search", { params: { q: filter }, headers: { Authorization: "Bearer " + localStorage.getItem("token") } })
        .then((response) => setUsers(response.data.users)).catch(() => setError("We couldn't load contacts. Please try again.")).finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [filter]);
  return <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
    <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-lg font-bold text-slate-900">Send money</h2><p className="mt-1 text-sm text-slate-500">Choose someone from your contacts.</p></div><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{users.length} contacts</span></div>
    <label className="relative mt-5 block"><span className="sr-only">Search contacts</span><span className="pointer-events-none absolute left-3 top-2.5 text-slate-400">⌕</span><input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Search by name or email" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100" /></label>
    <div className="mt-4 divide-y divide-slate-100">{loading && <p className="py-8 text-center text-sm text-slate-400">Finding your contacts...</p>}{!loading && error && <p className="py-8 text-center text-sm text-rose-500">{error}</p>}{!loading && !error && users.length === 0 && <p className="py-8 text-center text-sm text-slate-400">No contacts match that search.</p>}{!loading && !error && users.map((user) => <User key={user.id} user={user} />)}</div>
  </section>;
}
function User({ user }: { user: UserType }) {
  const navigate = useNavigate(); const name = `${user.firstName} ${user.lastName}`.trim();
  return <div className="flex items-center justify-between gap-3 py-3"><div className="flex min-w-0 items-center gap-3"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 font-bold text-blue-700">{user.firstName[0]?.toUpperCase()}</div><div className="min-w-0"><p className="truncate font-semibold text-slate-800">{name}</p><p className="truncate text-xs text-slate-400">{user.username}</p></div></div><button onClick={() => navigate(`/send?id=${user.id}&name=${encodeURIComponent(name)}`)} className="shrink-0 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-blue-600">Pay</button></div>;
}
