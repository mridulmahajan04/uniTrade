"use client";

import { useEffect, useState } from "react";

interface Order {
  _id: string;
  orderNumber: string;
  orderDate: string;
  totalPrice: number;
  currency: string;
  status: string;
}

function formatCurrency(amount: number, currency: string = "INR"): string {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
    }).format(amount);
  } catch (error) {
    console.error("Error formatting currency:", error);
    return `₹${amount.toFixed(2)}`;
  }
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch('/api/orders');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch orders: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API Response:', data);
        
        // Handle if the data is not as expected
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format');
        }
        
        setOrders(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold mb-8 text-gray-900">
          My Orders
        </h1>
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-600">
            <p>You have no orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Order Number
                      </p>
                      <p className="font-mono text-sm text-green-600">
                        {order.orderNumber || order._id.substring(0, 10)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Status
                      </p>
                      <p className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        order.status?.toLowerCase() === "paid" ? 
                        "bg-green-100 text-green-800" : 
                        "bg-blue-100 text-blue-800"
                      }`}>
                        {order.status || "Processing"}
                      </p>
                    </div>
                    <div className="lg:text-right">
                      <p className="text-sm text-gray-600 mb-1">
                        Order Date
                      </p>
                      <p className="font-medium">
                        {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "N/A"}
                      </p>
                    </div>
                    <div className="lg:text-right">
                      <p className="text-sm text-gray-600 mb-1">Amount</p>
                      <p className="font-bold text-xl text-gray-900">
                        {formatCurrency(order.totalPrice, order.currency)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}