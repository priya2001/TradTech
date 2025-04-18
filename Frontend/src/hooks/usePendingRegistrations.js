import { useState, useEffect } from "react";
import axios from "axios";

export const usePendingRegistrations = () => {
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approvedshopkeepers, setApprovedShopkeepers] = useState([]);

  const fetchPendingRegistrations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:3000/api/admin/pending-registrations",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
      // console.log(response.data);
      setPendingRegistrations(response.data); // Assumes API returns an array of registrations
      setError(null);
    } catch (err) {
      console.error("Failed to fetch pending registrations:", err);
      setError(
        err.response?.data?.message || "Failed to load pending registrations"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovedRegistrations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:3000/api/admin/shopkeepers",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // console.log(response.data);
      setApprovedShopkeepers(response.data); // Assumes API returns an array of registrations
      setError(null);
    } catch (err) {
      console.error("Failed to fetch approved registrations:", err);
      setError(
        err.response?.data?.message || "Failed to load approved registrations"
      );
    } finally {
      setLoading(false);
    }
  };


  const approveShopkeeper = async (id) => {
    try {
      const res = await axios.patch(
        `http://localhost:3000/api/admin/approve-shopkeeper/${id}`,
        {}, // PATCH body
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error(
        "Approve shopkeeper error:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

   const approveShopkeeperById = async (id) => {
     try {
       await approveShopkeeper(id);
       await fetchPendingRegistrations(); // refresh list after approval
       await fetchApprovedRegistrations();
     } catch (err) {
       throw err;
     }
   };

  
  const rejectShopkeeper = async (id) => {
    try {
      await axios.delete(
        `http://localhost:3000/api/admin/reject-shopkeeper/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // Optionally refresh the list after deletion
      await fetchPendingRegistrations(); // refresh list after approval
      await fetchApprovedRegistrations();
    } catch (error) {
      console.error(
        "Reject shopkeeper error:",
        error.response?.data || error.message
      );
      throw error;
    }
  };


  useEffect(() => {
    fetchPendingRegistrations();
    fetchApprovedRegistrations();
  }, []);

  return {
    pendingRegistrations,
    approvedshopkeepers,
    loading,
    error,
   approveShopkeeperById,
    refetch: fetchPendingRegistrations,
    rejectShopkeeper,
  };
};

