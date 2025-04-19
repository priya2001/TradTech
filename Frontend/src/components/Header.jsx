import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/lib/context";
import { useState } from "react";

const Header = () => {
  const { currentUser, logout, verifyToken } = useAppContext();
  const [role, setRole] = useState("");


  let dashboardLink = "/";
  if (currentUser?.role === "customer") {
    dashboardLink = "/customer";
  } else if (currentUser?.role === "shopkeeper") {
    dashboardLink = "/shopkeeper";
  } else if (currentUser?.role === "admin") {
    dashboardLink = "/admin";
  }

// useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       verifyToken(token).then((res) => {
        
//         if (!res.valid) {
//           localStorage.removeItem("token");
//           console.log("Invalid token removed");
//         } else {
//           console.log("Valid token for user:", res.data.user);
          
//           navigate(`/${res.data.user.role}`);
//           setRole(res.data.user.role);
//           // You can redirect or set user state here
//         }
//         console.log(res);
//       });
//     }
// }, []);
  
  



  console.log(currentUser);
  return (
    <header className="bg-primary py-4 px-6 text-primary-foreground shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/" className="text-xl font-bold flex items-center">
            <span className="text-solar-dark">Tradi</span>
            <span className="text-black">Tech</span>
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
