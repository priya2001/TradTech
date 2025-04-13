import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shop } from "@/components/Icons";
import { useAppContext } from "@/lib/context";
import { useToast } from "@/components/ui/use-toast";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    currentUser,
    registrations,
    approveShopRegistration,
    rejectShopRegistration,
    users,
  } = useAppContext();

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    } else if (currentUser.role !== "admin") {
      navigate(`/${currentUser.role}`);
    }
  }, [currentUser, navigate]);

  if (!currentUser || currentUser.role !== "admin") {
    return null;
  }

  const pendingRegistrations = registrations.filter(
    (reg) => reg.status === "pending"
  );

  const handleApprove = (registrationId) => {
    approveShopRegistration(registrationId);
    toast({
      title: "Registration approved",
      description: "The shop registration has been approved",
    });
  };

  const handleReject = (registrationId) => {
    rejectShopRegistration(registrationId);
    toast({
      title: "Registration rejected",
      description: "The shop registration has been rejected",
    });
  };

  const getShopkeeperName = (shopkeeperId) => {
    const user = users.find((user) => user.id === shopkeeperId);
    return user ? user.name : "Unknown";
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Shop className="h-5 w-5 text-primary" />
                Pending Shop Registrations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingRegistrations.length > 0 ? (
                <div className="space-y-4">
                  {pendingRegistrations.map((registration) => (
                    <div
                      key={registration.id}
                      className="p-4 border rounded-md"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-medium">
                            {registration.shopName}
                          </div>
                          <div className="text-xs text-gray-500">
                            by {getShopkeeperName(registration.shopkeeperId)}
                          </div>
                        </div>
                        <Badge>pending</Badge>
                      </div>

                      <div className="text-sm mb-3">
                        <div>
                          <strong>Address:</strong> {registration.address}
                        </div>
                        <div>
                          <strong>Location:</strong>{" "}
                          {registration.location.lat.toFixed(4)},{" "}
                          {registration.location.lng.toFixed(4)}
                        </div>
                        {registration.machineId && (
                          <div>
                            <strong>Machine ID:</strong>{" "}
                            {registration.machineId}
                          </div>
                        )}
                        <div>
                          <strong>Submitted:</strong>{" "}
                          {new Date(registration.timestamp).toLocaleString()}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(registration.id)}
                          className="flex-1"
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(registration.id)}
                          className="flex-1"
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  No pending registrations
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>System Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-md">
                  <div className="text-sm text-gray-500">Total Users</div>
                  <div className="text-2xl font-bold">{users.length}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {users.filter((u) => u.role === "customer").length}{" "}
                    customers,{" "}
                    {users.filter((u) => u.role === "shopkeeper").length}{" "}
                    shopkeepers
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-md">
                  <div className="text-sm text-gray-500">
                    Total Registrations
                  </div>
                  <div className="text-2xl font-bold">
                    {registrations.length}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {
                      registrations.filter((r) => r.status === "approved")
                        .length
                    }{" "}
                    approved,
                    {
                      registrations.filter((r) => r.status === "rejected")
                        .length
                    }{" "}
                    rejected,
                    {
                      registrations.filter((r) => r.status === "pending").length
                    }{" "}
                    pending
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="bg-white py-4 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} SolarJuice. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Admin;
