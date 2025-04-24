import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getMyOrders } from "@/sanity/lib/orders/getMyOrders";

export async function GET() {
    try {
        const { userId } = await auth();
        console.log("Fetching orders for user:", userId);
        
        if (!userId) {
            console.log("No user ID found");
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const orders = await getMyOrders(userId);
        console.log("Orders fetched:", orders.length);
        return NextResponse.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}