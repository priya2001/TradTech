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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { useAppContext } from "@/lib/context";

; // adjust import path

const AuthForm = () => {
  const { login, signup, shopkeepersignup ,verifyToken , customerSignup} = useAppContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginRole, setLoginRole] = useState("customer");

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupPasswordConfirm, setSignupPasswordConfirm] = useState("");
  const [signupRole, setSignupRole] = useState("customer");

  const [shopName, setShopName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");


  // const token = localStorage.getItem("token");
  // console.log(token);


  

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

          // You can redirect or set user state here
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
      if (
        !shopName ||
        !mobileNumber ||
        !licenseNumber ||
        !longitude ||
        !latitude
      ) {
        alert("Please fill all shopkeeper-specific fields.");
        return;
      }

      if (!/^\d{10}$/.test(mobileNumber)) {
        alert("Phone number must be exactly 10 digits.");
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
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          fullAddress: "Demo address",
        },
        role: signupRole
      };

      try {
        const success = await shopkeepersignup(payload);
        console.log(success);
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
    }

    else if (signupRole === "customer") {
      if (
        !signupName||
        !signupEmail ||
        !mobileNumber ||
        !signupEmail
       
      ) {
        alert("Please fill all customer-specific fields.");
        return;
      }

      const payload = {
        name: signupName,
        email: signupEmail,
        password: signupPassword,
        passwordConfirm: signupPasswordConfirm,
        role: "customer",
        mobileNumber:mobileNumber
      };

      try {
        const success = await customerSignup(payload);
        console.log(success);
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
    }
    
    else {
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
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Signup</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <form onSubmit={handleLogin}>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Enter your credentials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>I am a:</Label>
                <RadioGroup value={loginRole} onValueChange={setLoginRole}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="customer" id="login-customer" />
                    <Label htmlFor="login-customer">Customer</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="shopkeeper" id="login-shopkeeper" />
                    <Label htmlFor="login-shopkeeper">Shopkeeper</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="admin" id="login-admin" />
                    <Label htmlFor="login-admin">Admin</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </CardFooter>
          </form>
        </TabsContent>

        <TabsContent value="signup">
          <form onSubmit={handleSignup}>
            <CardHeader>
              <CardTitle>Signup</CardTitle>
              <CardDescription>Create your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Full Name</Label>
                <Input
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                />
                <div>
                  <Label>Confirm Password</Label>
                  <Input
                    type="password"
                    value={signupPasswordConfirm}
                    onChange={(e) => setSignupPasswordConfirm(e.target.value)}
                    required
                  />
                </div>
                <div>
                    <Label>Mobile Number</Label>
                    <Input
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      required
                    />
                  </div>
              </div>
              {signupRole === "shopkeeper" && (
                <>
                  <div>
                    <Label>Shop Name</Label>
                    <Input
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label>License Number</Label>
                    <Input
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex space-x-2">
                    <div>
                      <Label>Latitude</Label>
                      <Input
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label>Longitude</Label>
                      <Input
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </>
              )}
              <div>
                <Label>Register as:</Label>
                <RadioGroup value={signupRole} onValueChange={setSignupRole}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="customer" id="signup-customer" />
                    <Label htmlFor="signup-customer">Customer</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="shopkeeper" id="signup-shopkeeper" />
                    <Label htmlFor="signup-shopkeeper">Shopkeeper</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </CardFooter>
          </form>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default AuthForm;
