import Link from "next/link";
import { LuLayoutDashboard } from "react-icons/lu";
import { CiViewList } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
import { PiSignOutFill } from "react-icons/pi";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <aside className="h-screen w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-lg flex flex-col">
      <div className="flex flex-col flex-1 p-6">
        <div className="logo mb-10 flex items-center gap-2">
          <span className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold">
            B
          </span>
          <h1 className="text-2xl font-semibold tracking-wide">Budget Calc</h1>
        </div>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link
                href="/"
                className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors group"
              >
                <LuLayoutDashboard className="mr-3 text-lg group-hover:text-blue-400" />
                <span className="font-medium">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                href="/budgets"
                className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors group"
              >
                <CiViewList className="mr-3 text-lg group-hover:text-blue-400" />
                <span className="font-medium">My Budgets</span>
              </Link>
            </li>
            <li>
              <Link
                href="/settings"
                className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors group"
              >
                <IoSettingsOutline className="mr-3 text-lg group-hover:text-blue-400" />
                <span className="font-medium">Settings</span>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="mt-auto pt-8">
          <p>{user?.name}</p>
          <button
            onClick={logout}
            className="flex items-center px-4 py-3 rounded-lg text-red-400 hover:bg-gray-700 hover:text-red-500 transition-colors"
          >
            <PiSignOutFill className="mr-3 text-lg" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Navbar;
