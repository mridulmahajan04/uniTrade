import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { client } from "@/sanity/lib/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-03-31.basil",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const signature = req.headers.get("stripe-signature") ?? "";

        console.log("Received webhook", { signature: signature.slice(0, 20) + "..." });

        if (!signature) {
            console.log("No signature found in headers");
            return new NextResponse("No signature found", { status: 400 });
        }

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(
                body,
                signature,
                webhookSecret
            );
            console.log("Webhook event constructed successfully:", event.type);
        } catch (err) {
            console.error("Webhook signature verification failed:", err);
            return new NextResponse("Webhook signature verification failed", { status: 400 });
        }

        if (event.type === "checkout.session.completed") {
            const session = event.data.object as Stripe.Checkout.Session;
            console.log("Processing completed checkout session:", {
                sessionId: session.id,
                orderNumber: session.metadata?.orderNumber,
                customerId: session.customer,
                clerkUserId: session.metadata?.clerkUserId
            });
            
            // Create order in Sanity
            try {
                const orderData = {
                    _type: "order",
                    orderNumber: session.metadata?.orderNumber,
                    stripeCheckoutSessionId: session.id,
                    stripeCustomerId: session.customer as string,
                    stripePaymentIntentId: session.payment_intent as string,
                    clerkUserId: session.metadata?.clerkUserId,
                    customerName: session.metadata?.customerName,
                    customerEmail: session.metadata?.customerEmail,
                    totalPrice: session.amount_total ? session.amount_total / 100 : 0,
                    currency: session.currency,
                    status: "paid",
                    orderDate: new Date().toISOString(),
                    products: [] as Array<{
                        _key: string;
                        quantity: number;
                        product: {
                            _type: "reference";
                            _ref: string;
                        };
                    }>
                };

                // Fetch line items
                console.log("Fetching line items for session:", session.id);
                const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
                
                // Get product details from metadata and create product references
                const products = lineItems.data.map(item => {
                    const productId = (item.price?.product as Stripe.Product)?.metadata?.id;
                    if (!productId) {
                        console.log("No product ID found for line item:", item.id);
                        return null;
                    }
                    return {
                        _key: item.id,
                        quantity: item.quantity || 1,
                        product: {
                            _type: "reference" as const,
                            _ref: productId
                        }
                    };
                }).filter((product): product is NonNullable<typeof product> => product !== null);

                orderData.products = products;
                console.log("Creating order in Sanity:", { orderNumber: orderData.orderNumber });

                const createdOrder = await client.create(orderData);
                console.log("Order created successfully:", createdOrder._id);
                
                return new NextResponse("Order created successfully", { status: 200 });
            } catch (err) {
                console.error("Error creating order in Sanity:", err);
                return new NextResponse("Error creating order", { status: 500 });
            }
        }

        return new NextResponse("Webhook processed", { status: 200 });
    } catch (err) {
        console.error("Webhook error:", err);
        return new NextResponse("Webhook error", { status: 400 });
    }
}