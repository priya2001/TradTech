import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const OrderHistory = () => {
  const [orders, setOrders] = useState({ pending: [], completed: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/customers/my-orders",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
          console.log(res);
        setOrders({
          pending: res.data.data.pending,
          completed: res.data.data.completed,
        });
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

 const renderOrder = (order) => (
   <Card key={order._id}>
     <CardContent className="p-4 space-y-1">
       <div className="flex justify-between items-center mb-1">
         <div className="font-semibold text-base">{order.shop?.shopName}</div>
         <span
           className={`text-xs px-2 py-1 rounded-full ${
             order.status === "ready" || order.status === "picked-up"
               ? "bg-green-100 text-green-700"
               : "bg-yellow-100 text-yellow-700"
           }`}
         >
           {order.status}
         </span>
       </div>

       <div className="text-sm text-gray-600">
         Glass Size: {order.glassSize} ml × {order.quantity}
       </div>

       <div className="text-sm text-gray-600">
         Price/Glass: ₹{order.pricePerGlass} | Total: ₹{order.totalAmount}
       </div>

       <div className="text-sm text-gray-500">
         Payment: {order.paymentMethod} ({order.paymentStatus})
       </div>

       <div className="text-sm text-gray-400">
         Ordered at: {new Date(order.orderedAt).toLocaleString()}
       </div>
     </CardContent>
   </Card>
    );
    
  return (
    <div className="space-y-6">
      {orders.pending?.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-3">⏳ Pending Orders</h2>
          <div className="space-y-3">{orders.pending.map(renderOrder)}</div>
        </div>
      )}

      {orders.completed?.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mt-6 mb-3">
            ✅ Completed Orders
          </h2>
          <div className="space-y-3">{orders.completed.map(renderOrder)}</div>
        </div>
      )}

      {orders.pending?.length === 0 && orders.completed?.length === 0 && (
        <p className="text-gray-600 text-center">
          You haven’t placed any orders yet.
        </p>
      )}
    </div>
  );
};

export default OrderHistory;
