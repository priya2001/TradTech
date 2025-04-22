import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { useAppContext } from "@/lib/context";
import MapPicker from "./MapPicker";

import { Badge } from "@/components/ui/badge"; // Optional: for address display

const AuthForm = () => {
  const { login, signup, shopkeepersignup, verifyToken, customerSignup } =
    useAppContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");

  // Login State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginRole, setLoginRole] = useState("customer");

  // Signup State
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupPasswordConfirm, setSignupPasswordConfirm] = useState("");
  const [signupRole, setSignupRole] = useState("customer");

  // Shopkeeper Details
  const [shopName, setShopName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [location, setLocation] = useState({});
  const [address, setAddress] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      verifyToken(token).then((res) => {
        if (!res.valid) {
          localStorage.removeItem("token");
          console.log("Invalid token removed");
        } else {
          console.log("Valid token for user:", res.data.user);
          navigate(`/${res.data.user.role}`);
        }
        console.log(res);
      });
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const success = await login(loginEmail, loginPassword, loginRole);

      if (success) {
        toast({
          title: "Login successful",
          description: "You have been logged in successfully.",
        });
        navigate(`/${loginRole}`);
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login error",
        description: "An error occurred during login.",
        variant: "destructive",
      });
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Frontend Validation
    if (signupPassword !== signupPasswordConfirm) {
      alert("Password and Confirm Password do not match");
      return;
    }

    if (!signupName || !signupEmail || !signupPassword || !signupRole) {
      alert("Please fill all required fields.");
      return;
    }

    if (signupRole === "shopkeeper") {
      // Additional validation for shopkeeper role
      if (!shopName || !mobileNumber || !licenseNumber) {
        alert("Please fill all shopkeeper-specific fields.");
        return;
      }

      if (!/^\d{10}$/.test(mobileNumber)) {
        alert("Phone number must be exactly 10 digits.");
        return;
      }

      if (!latitude || !longitude) {
        alert("Please select a valid location.");
        return;
      }

      const payload = {
        name: signupName,
        email: signupEmail,
        password: signupPassword,
        passwordConfirm: signupPasswordConfirm,
        shopName,
        mobileNumber,
        licenseNumber,
        address: {
          location: {
            address: address,
            coordinates: [parseFloat(latitude), parseFloat(longitude)],
          },
        },
        role: signupRole,
      };
      console.log(payload);
      try {
        const success = await shopkeepersignup(payload);
        if (success) {
          toast({
            title: "Signup successful",
            description: "Pending for approval.",
          });
          setActiveTab("login");
        } else {
          toast({
            title: "Signup failed",
            description: "Could not create account.",
            variant: "destructive",
          });
        }
      } catch (err) {
        toast({
          title: "Signup error",
          description: "An error occurred during signup.",
          variant: "destructive",
        });
      }
    } else if (signupRole === "customer") {
      if (!signupName || !signupEmail || !mobileNumber || !signupEmail) {
        alert("Please fill all customer-specific fields.");
        return;
      }

      const payload = {
        name: signupName,
        email: signupEmail,
        password: signupPassword,
        passwordConfirm: signupPasswordConfirm,
        role: "customer",
        mobileNumber: mobileNumber,
      };

      try {
        const success = await customerSignup(payload);
        if (success) {
          toast({
            title: "Signup successful",
            description: "Now Login.",
          });
          setActiveTab("login");
        } else {
          toast({
            title: "Signup failed",
            description: "Could not create account.",
            variant: "destructive",
          });
        }
      } catch (err) {
        toast({
          title: "Signup error",
          description: "An error occurred during signup.",
          variant: "destructive",
        });
      }
    } else {
      try {
        const success = await signup(
          signupName,
          signupEmail,
          signupPassword,
          signupRole
        );

        if (success) {
          toast({
            title: "Signup successful",
            description: "You can now log in with your credentials.",
          });
          setActiveTab("login");
        } else {
          toast({
            title: "Signup failed",
            description: "Email already in use.",
            variant: "destructive",
          });
        }
      } catch (err) {
        toast({
          title: "Signup error",
          description: "An error occurred during signup.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login" className="text-2xl font-semibold">
            Login
          </TabsTrigger>
          <TabsTrigger value="signup" className="text-2xl font-semibold">
            Signup
          </TabsTrigger>
        </TabsList>

        {/* Login Tab Content */}
        <TabsContent value="login">
          <form onSubmit={handleLogin}>
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Login</CardTitle>
              <CardDescription className="text-xl">Enter your credentials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xl">Email</Label>
                <Input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  className="text-xl"
                />
              </div>
              <div>
                <Label className="text-xl">Password</Label>
                <Input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  className="text-xl"
                />
              </div>
              <div>
                <Label className="text-xl">I am a:</Label>
                <RadioGroup value={loginRole} onValueChange={setLoginRole}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="customer" id="login-customer" />
                    <Label htmlFor="login-customer" className="text-xl">
                      Customer
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="shopkeeper" id="login-shopkeeper" />
                    <Label htmlFor="login-shopkeeper" className="text-xl">
                      Shopkeeper
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="admin" id="login-admin" />
                    <Label htmlFor="login-admin" className="text-xl">
                      Admin
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full text-xl">
                Login
              </Button>
            </CardFooter>
          </form>
        </TabsContent>

        {/* Signup Tab Content */}
        <TabsContent value="signup">
          <form onSubmit={handleSignup}>
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Signup</CardTitle>
              <CardDescription className="text-xl">Create your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xl">Full Name</Label>
                <Input
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  required
                  className="text-xl"
                />
              </div>
              <div>
                <Label className="text-xl">Email</Label>
                <Input
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                  className="text-xl"
                />
              </div>
              <div>
                <Label className="text-xl">Password</Label>
                <Input
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                  className="text-xl"
                />
              </div>
              <div>
                <Label className="text-xl">Confirm Password</Label>
                <Input
                  type="password"
                  value={signupPasswordConfirm}
                  onChange={(e) => setSignupPasswordConfirm(e.target.value)}
                  required
                  className="text-xl"
                />
              </div>

              {/* Shopkeeper Fields */}
              {signupRole === "shopkeeper" && (
                <>
                  <div>
                    <Label className="text-xl">Shop Name</Label>
                    <Input
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      required
                      className="text-xl"
                    />
                  </div>
                  <div>
                    <Label className="text-xl">Mobile Number</Label>
                    <Input
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      required
                      className="text-xl"
                    />
                  </div>
                  <div>
                    <Label className="text-xl">License Number</Label>
                    <Input
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      required
                      className="text-xl"
                    />
                  </div>
                  <div>
                    <MapPicker
                      setLatitude={setLatitude}
                      setLongitude={setLongitude}
                      setAddress={setAddress}
                    />
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full text-xl">
                Signup
              </Button>
            </CardFooter>
          </form>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default AuthForm;
