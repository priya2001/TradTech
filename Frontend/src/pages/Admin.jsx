import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { usePendingRegistrations } from "@/hooks/usePendingRegistrations";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/lib/context";
import Header from "../components/Header";

const Admin = () => {
  const navigate = useNavigate();
  const { currentUser } = useAppContext();
  const { toast } = useToast();

  const {
    pendingRegistrations,
    loading,
    error,
    refetch,
    approvedshopkeepers,
    rejectShopkeeper,
    approveShopkeeperById,
  } = usePendingRegistrations();

  const [activeTab, setActiveTab] = useState("total");
  const [selectedShopkeeper, setSelectedShopkeeper] = useState(null);

  useEffect(() => {
    if (!currentUser) navigate("/");
    else if (currentUser.role !== "admin") navigate(`/${currentUser.role}`);
  }, [currentUser, navigate]);

  if (!currentUser || currentUser.role !== "admin") return null;

  const approvedShopkeepers = approvedshopkeepers?.data?.shopkeepers || [];
  const pendingShopkeepers = pendingRegistrations?.data?.shopkeepers || [];
  const currentList =
    activeTab === "total" ? approvedShopkeepers : pendingShopkeepers;

  const handleApprove = async (id) => {
    try {
      await approveShopkeeperById(id);
      toast({
        title: "Approved",
        description: "Shopkeeper approved successfully",
      });
      setSelectedShopkeeper(null);
    } catch {
      toast({ title: "Error", description: "Failed to approve shopkeeper" });
    }
  };

  const handleReject = async (id) => {
    await rejectShopkeeper(id);
    toast({
      title: "Rejected",
      description: "Shopkeeper rejected successfully",
    });
    setSelectedShopkeeper(null);
    refetch();
  };

  return (
    <div className="min-h-screen bg-[url('/bamboo-bg.png')] bg-cover bg-no-repeat">
      <Header />
      <div className="flex font-sans min-h-screen bg-white/70 backdrop-blur-sm">
        {/* Sidebar */}
        <div className="w-1/5 bg-yellow-100/80 p-6 shadow-xl rounded-tr-3xl rounded-br-3xl">
          <h2 className="text-4xl font-extrabold mb-10 text-green-800">
            Dashboard
          </h2>
          <ul className="space-y-8 text-2xl">
            <li
              className={`cursor-pointer ${
                activeTab === "total"
                  ? "text-green-700 font-semibold"
                  : "text-gray-600 hover:text-green-600"
              }`}
              onClick={() => setActiveTab("total")}
            >
              🍃 Total Shopkeepers
            </li>
            <li
              className={`cursor-pointer ${
                activeTab === "pending"
                  ? "text-green-700 font-bold"
                  : "text-gray-600 hover:text-green-600"
              }`}
              onClick={() => setActiveTab("pending")}
            >
              🌱 Pending Approvals
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-10 overflow-y-auto">
          <h1 className="text-5xl font-bold mb-8 text-green-900">
            Admin Panel
          </h1>

          {/* Stats */}
          <div className="flex gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-md w-64 text-center hover:bg-green-50 transition">
              <h3 className="text-xl text-gray-600">Total Shopkeepers</h3>
              <p className="text-4xl font-bold text-green-800">
                {approvedShopkeepers.length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md w-64 text-center hover:bg-yellow-50 transition">
              <h3 className="text-xl text-gray-600">Pending</h3>
              <p className="text-4xl font-bold text-yellow-600">
                {pendingShopkeepers.length}
              </p>
            </div>
          </div>

          {/* List */}
          <h2 className="text-3xl font-semibold mb-6 text-gray-700">
            {activeTab === "total" ? "Total Shopkeepers" : "Pending Approvals"}
          </h2>

          {currentList.length === 0 ? (
            <p className="text-gray-500 text-xl">No data available.</p>
          ) : (
            <div className="space-y-4">
              {currentList.map((shopkeeper) => (
                <div
                  key={shopkeeper._id}
                  className="bg-white p-5 flex justify-between items-center rounded-xl shadow-md hover:bg-green-50 transition border border-green-100 cursor-pointer"
                  onClick={() => setSelectedShopkeeper(shopkeeper)}
                >
                  <div>
                    <h3 className="text-xl font-medium text-gray-800">
                      {shopkeeper.shopName}
                    </h3>
                    <p className="text-gray-600 text-lg">{shopkeeper.email}</p>
                  </div>
                  {!shopkeeper.active && (
                    <Button className="bg-green-600 hover:bg-green-700 text-white text-lg">
                      View
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {selectedShopkeeper && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-[460px] relative">
              <button
                className="absolute top-4 right-5 text-3xl font-bold text-gray-500 hover:text-red-500"
                onClick={() => setSelectedShopkeeper(null)}
              >
                ×
              </button>
              <h2 className="text-3xl font-bold mb-3 text-green-700">
                {selectedShopkeeper.shopName}
              </h2>
              <p className="text-gray-800 mb-4 text-lg">
                {selectedShopkeeper.email}
              </p>

              <div className="space-y-3 text-lg text-gray-700">
                <p>
                  <strong>Name:</strong> {selectedShopkeeper.name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedShopkeeper.email}
                </p>
                <p>
                  <strong>License:</strong> {selectedShopkeeper.licenseNumber}
                </p>
                <p>
                  <strong>Mobile no:</strong> {selectedShopkeeper.mobileNumber}
                </p>
                <p>
                  <strong>Location:</strong>{" "}
                  {selectedShopkeeper.address.location.coordinates}
                </p>
              </div>

              {!selectedShopkeeper.active && (
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    onClick={() => handleApprove(selectedShopkeeper._id)}
                    className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 text-lg"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(selectedShopkeeper._id)}
                    className="bg-gray-300 text-gray-800 px-5 py-2 rounded hover:bg-gray-400 text-lg"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
