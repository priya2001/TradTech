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
    if (!currentUser) {
      navigate("/");
    } else if (currentUser.role !== "admin") {
      navigate(`/${currentUser.role}`);
    }
  }, [currentUser, navigate]);

  if (!currentUser || currentUser.role !== "admin") {
    return null;
  }
  console.log(pendingRegistrations);
  console.log(approvedshopkeepers)

  const approvedShopkeepers =
   approvedshopkeepers?.data?.shopkeepers || [];

  const pendingShopkeepers =
    pendingRegistrations?.data?.shopkeepers || [];

  const currentList =
    activeTab === "total" ? approvedShopkeepers : pendingShopkeepers;
  console.log(currentList);

  const handleApprove = async (id) => {
    try {
      await approveShopkeeperById(id);
      toast({
        title: "Approved",
        description: "Shopkeeper approved successfully",
      });
      setSelectedShopkeeper(null);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to approve shopkeeper",
      });
    }
  };

  const handleReject = async (id) => {
    await rejectShopkeeper(id);
    toast({
      title: "Rejected",
      description: "Shopkeeper rejected successfully",
    });
    setSelectedShopkeeper(null);
    refetch(); // refresh data
  };

  if (loading) {
    return <div className="p-10 text-center">Loading shopkeepers...</div>;
  }

  return (
    <div>
      <Header/>
      <div className="flex h-screen font-sans bg-gray-50">
        {/* Sidebar */}

        <div className="w-1/5 bg-white p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-6">Dashboard</h2>
          <ul className="space-y-4">
            <li
              className={`cursor-pointer ${
                activeTab === "total"
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700"
              }`}
              onClick={() => setActiveTab("total")}
            >
              📋 Total Shopkeepers
            </li>
            <li
              className={`cursor-pointer ${
                activeTab === "pending"
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700"
              }`}
              onClick={() => setActiveTab("pending")}
            >
              ⏳ Pending Approvals
            </li>
          </ul>
        </div>

        {/* Main */}
        <div className="flex-1 p-8 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

          {/* Stats */}
          <div className="flex gap-4 mb-6">
            <div className="bg-white p-4 rounded shadow w-48 text-center">
              <h3 className="text-gray-600">Total Shopkeepers</h3>
              <p className="text-2xl font-bold">{approvedShopkeepers.length}</p>
            </div>
            <div className="bg-white p-4 rounded shadow w-48 text-center">
              <h3 className="text-gray-600">Pending</h3>
              <p className="text-2xl font-bold">{pendingShopkeepers.length}</p>
            </div>
          </div>

          {/* Shopkeeper List */}
          <h2 className="text-xl font-semibold mb-4">
            {activeTab === "total" ? "Total Shopkeepers" : "Pending Approvals"}
          </h2>

          {currentList.length === 0 ? (
            <p className="text-gray-500">No data available.</p>
          ) : (
            <div className="space-y-3">
              {currentList.map((shopkeeper) => (
                <div
                  key={shopkeeper._id}
                  className="bg-white p-4 flex justify-between items-center rounded shadow hover:cursor-pointer"
                  onClick={() => setSelectedShopkeeper(shopkeeper)}
                >
                  <div>
                    <h3 className="font-medium">{shopkeeper.shopName}</h3>
                    <p className="text-gray-600">{shopkeeper.email}</p>
                  </div>
                  {!shopkeeper.active && <Button>View</Button>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {selectedShopkeeper && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-[400px] relative">
              <button
                className="absolute top-3 right-4 text-xl font-bold"
                onClick={() => setSelectedShopkeeper(null)}
              >
                ×
              </button>
              <h2 className="text-xl font-bold mb-1">
                {selectedShopkeeper.shopName}
              </h2>
              <p className="text-gray-800 mb-2">{selectedShopkeeper.email}</p>

              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <span className="font-semibold">Name</span>{" "}
                  {selectedShopkeeper.name}
                </p>
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  {selectedShopkeeper.email}
                </p>
                <p>
                  <span className="font-semibold">License:</span>{" "}
                  {selectedShopkeeper.licenseNumber}
                </p>
                <p>
                  <span className="font-semibold">Mobile no:</span>{" "}
                  {selectedShopkeeper.mobileNumber}
                </p>
                <p>
                  <span className="font-semibold">address:</span>{" "}
                  {selectedShopkeeper.address.location.coordinates}
                </p>
              </div>

              {!selectedShopkeeper.active && (
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    onClick={() => handleApprove(selectedShopkeeper._id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(selectedShopkeeper._id)}
                    className="bg-gray-200 px-4 py-2 rounded"
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
