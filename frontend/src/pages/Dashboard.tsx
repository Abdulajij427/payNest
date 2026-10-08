import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";

export function Dashboard() {
  const [balance, setBalance] = useState<number | null>(null);
  const [firstName, setFirstName] = useState("");
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/signin");
      return;
    }

    const headers = { Authorization: "Bearer " + token };

    axios.get("http://localhost:3000/api/v1/account/balance", { headers })
      .then((res) => setBalance(res.data.balance))
      .catch((err) => { if (err.response?.status === 401) { localStorage.removeItem("token"); navigate("/signin"); } });

    axios
      .get("http://localhost:3000/api/v1/user/me", { headers })
      .then((res) => setFirstName(res.data.user.firstName))
      .catch(() => undefined);
  }, [navigate]);

  const copyUpi = async () => {
    await navigator.clipboard?.writeText("paynest@upi");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Appbar firstName={firstName} />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div><p className="text-sm font-medium text-blue-600">PAYNEST WALLET</p><h1 className="mt-1 text-2xl font-bold text-slate-900">Good to see you{firstName ? `, ${firstName}` : ""}.</h1></div>
          <button onClick={copyUpi} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-blue-300 hover:text-blue-700">{copied ? "UPI ID copied!" : "Copy UPI ID"}</button>
        </div>
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-6"><Balance value={balance} /><section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"><p className="text-sm font-semibold text-slate-800">Quick actions</p><div className="mt-4 grid grid-cols-2 gap-3"><button onClick={() => document.querySelector<HTMLInputElement>("input[placeholder='Search by name or email']")?.focus()} className="rounded-2xl bg-blue-50 p-4 text-left transition hover:bg-blue-100"><span className="block text-xl">↗</span><span className="mt-2 block text-sm font-semibold text-blue-800">Send money</span></button><button onClick={copyUpi} className="rounded-2xl bg-cyan-50 p-4 text-left transition hover:bg-cyan-100"><span className="block text-xl">⌘</span><span className="mt-2 block text-sm font-semibold text-cyan-800">{copied ? "Copied" : "Share UPI ID"}</span></button></div></section></div>
          <Users />
        </div>
      </main>
    </div>
  );
}
