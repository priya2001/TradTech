import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/lib/context";

const Header = () => {
  const { currentUser, logout } = useAppContext();

  let dashboardLink = "/";
  if (currentUser?.role === "customer") {
    dashboardLink = "/customer";
  } else if (currentUser?.role === "shopkeeper") {
    dashboardLink = "/shopkeeper";
  } else if (currentUser?.role === "admin") {
    dashboardLink = "/admin";
  }

  return (
    <header className="bg-primary py-4 px-6 text-primary-foreground shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/" className="text-xl font-bold flex items-center">
            <span className="text-solar-dark">Solar</span>
            <span className="text-black">Juice</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {currentUser ? (
            <>
              <Link to={dashboardLink}>
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
              <span className="text-sm opacity-80">
                {currentUser.name} ({currentUser.role})
              </span>
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
