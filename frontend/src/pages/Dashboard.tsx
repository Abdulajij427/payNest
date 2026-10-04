import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";

export function Dashboard() {
  const [balance, setBalance] = useState<number | null>(null);
  const [firstName, setFirstName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // token nahi hai to signin par bhejo
    if (!token) {
      navigate("/signup");
      return;
    }

    const headers = { Authorization: "Bearer " + token };

    axios
    .get("http://localhost:3000/api/v1/account/balance", { headers })
    .then((res) => setBalance(res.data.balance))
    .catch((err) => {
        console.error("balance error:", err.response?.status, err.response?.data);
        if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/signin");
        }
    });

    axios
      .get("http://localhost:3000/api/v1/user/me", { headers })
      .then((res) => setFirstName(res.data.user.firstName))
      .catch((err) => console.error(err));
  }, [navigate]);

  return (
    <div>
      <Appbar firstName={firstName} />
      <div className="m-8">
        <Balance value={balance} />
        <Users />
      </div>
    </div>
  );
}