import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/backendClient";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    // Get user information from Clerk
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Debug log the userId
    console.log("Fetching orders for user:", userId);
    
    // Build the query to fetch orders for this user
    // Look for orders where either customerId matches Clerk userId
    // or stripeCustomerId matches for backward compatibility with older orders
    const query = `*[_type == "order" && (customerId == $userId || stripeCustomerId == $userId)] | order(orderDate desc)`;
    const params = { userId };
    
    // Fetch orders from Sanity
    const orders = await client.fetch(query, params);
    
    console.log("Raw orders from Sanity:", JSON.stringify(orders));
    
    // Map to the structure expected by the frontend
    const mappedOrders = orders.map((order: any) => {
      console.log("Processing order:", order._id);
      
      return {
        _id: order._id,
        orderNumber: order.orderNumber,
        orderDate: order.orderDate,
        totalPrice: order.totalPrice || 0,
        currency: order.currency || "INR",
        status: order.status || "Processing"
      };
    });
    
    console.log("Sending mapped orders:", JSON.stringify(mappedOrders));
    return NextResponse.json(mappedOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
} 