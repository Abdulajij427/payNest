import { useNavigate } from "react-router-dom";

export function Appbar({ firstName }: { firstName: string }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signup");
  };

  return (
    <div className="shadow h-14 flex justify-between">
      <div className="flex flex-col justify-center h-full ml-4 font-bold text-lg">
        PayNest
      </div>
      <div className="flex">
        <div className="flex flex-col justify-center h-full mr-4">
          Hello, {firstName}
        </div>
        <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
          <div className="flex flex-col justify-center h-full text-xl">
            {firstName[0]?.toUpperCase()}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-600 hover:text-black mr-4"
        >
          Logout
        </button>
      </div>
    </div>
  );
}