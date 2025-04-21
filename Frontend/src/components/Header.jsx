import defaultImg from "../assets/default.webp";
import adminImg from "../assets/admin.webp";
import customerImg from "../assets/customer.webp";
import shopkeeperImg from "../assets/shopkeeper.webp";
// import EditProfile from '../pages/EditProfile';

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/lib/context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { currentUser, logout } = useAppContext();

  const getProfileImage = () => {
    if (!currentUser) return defaultImg;
    switch (currentUser.role) {
      case "admin":
        return adminImg;
      case "customer":
        return customerImg;
      case "shopkeeper":
        return shopkeeperImg;
      default:
        return defaultImg;
    }
  };

  let dashboardLink = "/";
  if (currentUser?.role === "customer") dashboardLink = "/customer";
  else if (currentUser?.role === "shopkeeper") dashboardLink = "/shopkeeper";
  else if (currentUser?.role === "admin") dashboardLink = "/admin";

  return (
    <header className="bg-[#1e1e1e] text-white py-5 shadow-md">
      <div className="w-full px-6 flex items-center justify-between">
        {/* Left side logo/name */}
        <div className="flex items-center space-x-2">
          <span className="text-3xl font-bold tracking-tight">
            <span className="text-yellow-400">Tradi</span>
            <span className="text-white ml-[-1px]">Tech</span>
          </span>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-6">
          {currentUser ? (
            <>
              <span className="text-xl hidden sm:block font-semibold text-gray-300">
                {currentUser.name}{" "}
                <span className="text-yellow-400 font-bold capitalize">
                  {currentUser.role}
                </span>
              </span>

              {/* Dropdown on Profile Image */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <img
                    src={getProfileImage()}
                    alt="Profile"
                    className="w-12 h-12 rounded-full border-2 border-white object-cover cursor-pointer"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent
  align="end"
  className="bg-white text-black rounded-2xl shadow-2xl w-72 py-3 text-xl"
>
  <DropdownMenuItem asChild>
    <Link
      to="/profile/edit"
      className="block px-6 py-4 hover:bg-gray-100 font-semibold text-xl"
    >
      ✏️ Edit Profile
    </Link>
  </DropdownMenuItem>

  <DropdownMenuItem asChild>
    <Link
      to="/profile/change-password"
      className="block px-6 py-4 hover:bg-gray-100 font-semibold text-xl"
    >
      🔒 Change Password
    </Link>
  </DropdownMenuItem>

  <DropdownMenuSeparator className="my-2" />

  <DropdownMenuItem asChild>
    <button
      onClick={logout}
      className="w-full text-left px-6 py-4 text-red-600 hover:bg-red-100 font-bold text-xl"
    >
      🚪 Logout
    </button>
  </DropdownMenuItem>
</DropdownMenuContent>

              </DropdownMenu>
            </>
          ) : (
            <Link to="/">
              <Button
                variant="outline"
                className="text-xl px-5 py-2 font-semibold"
              >
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
