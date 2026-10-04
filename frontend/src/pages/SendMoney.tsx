import { useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { Heading } from "../components/Heading";
import { SubHeading } from "../components/SubHeading";

export function SendMoney() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");      // /send?id=5&name=Rahul
  const name = searchParams.get("name");

  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center bg-white w-80 m-20 p-4 rounded-md h-max self-center">
        <Heading label="Send Money" />
        <div className="flex flex-col justify-start">
          <SubHeading label={`Sending to ${name ?? "user"}`} />

          <input
            type="number"
            min="0"
            value={amount}
            placeholder="Enter amount"
            onChange={(e) => setAmount(e.target.value)}
            className="my-2 px-2 border border-gray-400 rounded-sm h-10"
          />

          {error && <div className="text-red-500 text-sm">{error}</div>}
          {message && <div className="text-green-600 text-sm">{message}</div>}

          <button
            onClick={handleTransfer}
            disabled={loading}
            className="bg-green-500 font-bold text-white px-2 py-2 mt-2 rounded-sm disabled:opacity-50"
          >
            {loading ? "Sending..." : "Initiate Transfer"}
          </button>
        </div>
      </div>
    </div>
  );
}