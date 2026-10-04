import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "./Button";

type UserType = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
};

export function Users() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    // debounce: typing rukne ke 300ms baad hi request jaye
    const timer = setTimeout(() => {
      axios
        .get("http://localhost:3000/api/v1/user/search", {
          params: { q: filter },
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        })
        .then((response) => setUsers(response.data.users))
        .catch((err) => console.error(err));
    }, 300);

    return () => clearTimeout(timer);
  }, [filter]);

  return (
    <div>
      <div className="font-bold mt-6 text-lg">Users</div>
      <div className="my-2">
        <input
          type="text"
          placeholder="Search users..."
          onChange={(e) => setFilter(e.target.value)}
          className="w-full px-2 py-1 border border-gray-400 rounded-sm"
        />
      </div>
      <div>
        {users.map((user) => (
          <User key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}

function User({ user }: { user: UserType }) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between">
      <div className="flex">
        <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
          <div className="flex flex-col justify-center h-full text-xl">
            {user.firstName[0]}
          </div>
        </div>
        <div className="flex flex-col justify-center h-full">
          <div>
            {user.firstName} {user.lastName}
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center h-full">
        <Button
          onClick={() => navigate(`/send?id=${user.id}&name=${user.firstName}`)}
          label="Send Money"
        />
      </div>
    </div>
  );
}