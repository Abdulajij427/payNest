import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export function Signin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const signIn = async (event: React.FormEvent) => {
    event.preventDefault(); setError(""); setLoading(true);
    try { const response = await axios.post("http://localhost:3000/api/v1/user/signin", { username, password }); localStorage.setItem("token", response.data.token); navigate("/dashboard"); }
    catch (err: unknown) { setError(axios.isAxiosError(err) ? err.response?.data?.message || "Unable to sign in with those details." : "Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };
  return <div className="grid min-h-screen place-items-center bg-slate-50 p-4"><form onSubmit={signIn} className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/70"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-600 text-xl font-black text-white">P</div><p className="mt-6 text-sm font-semibold text-blue-600">WELCOME BACK</p><h1 className="mt-1 text-3xl font-bold text-slate-900">Sign in to PayNest</h1><p className="mt-2 text-sm text-slate-500">Your money, made simple.</p><div className="mt-7 space-y-4"><label className="block text-sm font-semibold text-slate-700">Email<input required type="email" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="you@example.com" className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-3 font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></label><label className="block text-sm font-semibold text-slate-700">Password<input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-3 font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></label></div>{error && <p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-600">{error}</p>}<button disabled={loading} className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Signing in..." : "Sign in"}</button><p className="mt-6 text-center text-sm text-slate-500">New to PayNest? <Link className="font-semibold text-blue-600 hover:underline" to="/signup">Create an account</Link></p></form></div>;
}
