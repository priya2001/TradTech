import defaultImg from '../assets/default.webp';
import adminImg from '../assets/admin.webp';
import customerImg from '../assets/customer.webp';
import shopkeeperImg from '../assets/shopkeeper.webp';

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
    <header className="bg-[#1e1e1e] text-white py-4 shadow-md">
      <div className="w-full px-4 flex items-center justify-between">
        {/* Left side logo/name */}
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold tracking-tight">
            <span className="text-yellow-400 font-bold">Tradi</span>
            <span className="text-white font-semibold ml-[-1px]">Tech</span>
          </span>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {currentUser ? (
            <>
            <span className="text-base hidden sm:block font-medium text-gray-300">
  {currentUser.name} <span className="text-yellow-400 font-semibold capitalize">{currentUser.role}</span>
</span>


              {/* Dropdown on Profile Image */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <img
                    src={getProfileImage()}
                    alt="Profile"
                    className="w-10 h-10 rounded-full border border-white object-cover cursor-pointer"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white text-black rounded shadow-lg w-52 py-1">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="block px-3 py-2 hover:bg-gray-100">
                      Open Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile/edit" className="block px-3 py-2 hover:bg-gray-100">
                      Edit Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile/change-password" className="block px-3 py-2 hover:bg-gray-100">
                      Change Password
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to={dashboardLink} className="block px-3 py-2 hover:bg-gray-100">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="my-1" />

                  <DropdownMenuItem asChild>
                    <button
                      onClick={logout}
                      className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-100"
                    >
                      Logout
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link to="/">
              <Button variant="outline">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
