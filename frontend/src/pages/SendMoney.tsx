import { useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

export function SendMoney() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");      // /send?id=5&name=Rahul
  const name = searchParams.get("name");

  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleTransfer = async () => {
    setError("");
    setMessage("");

    const amt = Number(amount);
    if (!id || !amt || amt <= 0) {
      setError("Enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/account/transfer",
        { to: Number(id), amount: amt },
        { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
      );
      setMessage(res.data.message);
      setAmount("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-xl shadow-slate-200/70">
        <button onClick={() => navigate("/dashboard")} className="text-sm font-semibold text-slate-500 hover:text-blue-600">← Back to wallet</button>
        <div className="mt-6 flex items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">{name?.[0]?.toUpperCase() || "U"}</div><div><p className="text-sm text-slate-500">You are paying</p><h1 className="text-xl font-bold text-slate-900">{name ?? "user"}</h1></div></div>
        <div className="mt-7 flex flex-col justify-start">
          <label className="text-sm font-semibold text-slate-700">Amount</label>

          <input
            type="number"
            min="0"
            value={amount}
            placeholder="Enter amount"
            onChange={(e) => setAmount(e.target.value)}
            className="my-2 rounded-xl border border-slate-200 px-3 py-3 text-lg outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
          <div className="mb-3 flex gap-2">{[100, 500, 1000].map((quickAmount) => <button key={quickAmount} onClick={() => setAmount(String(quickAmount))} className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700 hover:bg-blue-100">₹{quickAmount}</button>)}</div>

          {error && <div className="text-red-500 text-sm">{error}</div>}
          {message && <div className="text-green-600 text-sm">{message}</div>}

          <button
            onClick={handleTransfer}
            disabled={loading}
            className="mt-2 rounded-xl bg-blue-600 px-2 py-3 font-bold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Sending..." : amount ? `Pay ₹${Number(amount).toLocaleString("en-IN")}` : "Enter an amount"}
          </button>
        </div>
      </div>
    </div>
  );
}
