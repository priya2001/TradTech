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
      <div className="flex h-screen font-sans bg-slate-50">
    {/* Sidebar */}
    <div className="w-1/5 bg-blue-100 p-6 shadow-md rounded-tr-3xl rounded-br-3xl">
      <h2 className="text-3xl font-bold mb-8 text-blue-800">Dashboard</h2>
      <ul className="space-y-6 text-xl">
        <li
          className={`cursor-pointer ${
            activeTab === "total"
              ? "text-blue-700 font-semibold"
              : "text-gray-600 hover:text-blue-600"
          }`}
          onClick={() => setActiveTab("total")}
        >
          📋 Total Shopkeepers
        </li>
        <li
          className={`cursor-pointer ${
            activeTab === "pending"
              ? "text-blue-700 font-semibold"
              : "text-gray-600 hover:text-blue-600"
          }`}
          onClick={() => setActiveTab("pending")}
        >
          ⏳ Pending Approvals
        </li>
      </ul>
    </div>

    {/* Main Content */}
    <div className="flex-1 p-10 overflow-y-auto">
      <h1 className="text-5xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>

      {/* Stats */}
      <div className="flex gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg w-64 text-center hover:bg-blue-50 transition">
          <h3 className="text-xl text-gray-600">Total Shopkeepers</h3>
          <p className="text-4xl font-bold text-blue-800">
            {approvedShopkeepers.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg w-64 text-center hover:bg-yellow-50 transition">
          <h3 className="text-xl text-gray-600">Pending</h3>
          <p className="text-4xl font-bold text-yellow-600">
            {pendingShopkeepers.length}
          </p>
        </div>
      </div>

      {/* List Header */}
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
              className="bg-white p-5 flex justify-between items-center rounded-xl shadow hover:bg-gray-100 transition cursor-pointer"
              onClick={() => setSelectedShopkeeper(shopkeeper)}
            >
              <div>
                <h3 className="text-xl font-medium text-gray-800">
                  {shopkeeper.shopName}
                </h3>
                <p className="text-gray-600 text-lg">{shopkeeper.email}</p>
              </div>
              {!shopkeeper.active && (
                <Button className="bg-blue-500 hover:bg-blue-600 text-white text-lg">
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
      <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-[460px] relative">
          <button
            className="absolute top-4 right-5 text-3xl font-bold text-gray-500 hover:text-red-500"
            onClick={() => setSelectedShopkeeper(null)}
          >
            ×
          </button>
          <h2 className="text-3xl font-bold mb-3 text-blue-700">
            {selectedShopkeeper.shopName}
          </h2>
          <p className="text-gray-800 mb-4 text-lg">{selectedShopkeeper.email}</p>

          <div className="space-y-3 text-lg text-gray-700">
            <p>
              <span className="font-semibold">Name:</span>{" "}
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
              <span className="font-semibold">Address:</span>{" "}
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
