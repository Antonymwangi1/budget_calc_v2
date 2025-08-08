import Link from "next/link";
import { LuLayoutDashboard } from "react-icons/lu";
import { CiBoxList, CiViewList } from "react-icons/ci";
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
          <h1 className="text-2xl font-semibold tracking-wide">Budget Set</h1>
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
                href="/expenses"
                className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors group"
              >
                <CiBoxList className="mr-3 text-lg group-hover:text-blue-400" />
                <span className="font-medium">All Expenses</span>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="mt-auto pt-8 relative">
          <div className="group inline-block w-full">
            <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors focus:outline-none">
              <span className="font-medium">{user?.name || "Account"}</span>
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </button>
            <div className="absolute left-0 -top-38 w-full mt-2 bg-gray-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto transition-opacity z-10">
              <ul className="py-2">
                <li>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 hover:bg-gray-700 transition-colors"
                  >
                    Settings
                  </Link>
                </li>
                <li>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors"
                    // Implement your theme change logic here
                    onClick={() => alert("Theme change coming soon!")}
                  >
                    Change Theme
                  </button>
                </li>
                <li>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 hover:bg-gray-700 transition-colors"
                  >
                    Settings
                  </Link>
                </li>
                <li>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors text-red-400"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Navbar;
