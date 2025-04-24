'use server'

import { imageUrl } from "@/lib/imageUrl";
import stripe from "@/lib/stripe";
import { BasketItem } from "@/store/store";

export type Metadata = {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    clerkUserId: string;
};


export type GroupedBasketItem = {
    product: BasketItem["product"],
    quantity: number
}

export async function createCheckoutSession(
    items: GroupedBasketItem[],
    metadata: Metadata
) {
    console.log("Starting checkout session creation with items:", JSON.stringify(items, null, 2));
    console.log("Metadata:", JSON.stringify(metadata, null, 2));

    try {
        // Validate items
        if (!items || items.length === 0) {
            console.error("No items provided for checkout");
            throw new Error("No items provided for checkout");
        }

        const itemWithoutPrice = items.filter((item) => !item.product.price);
        if (itemWithoutPrice.length > 0) {
            console.error("Items without price:", JSON.stringify(itemWithoutPrice, null, 2));
            throw new Error("Some items do not have a price");
        }

        // Check for customer
        console.log("Looking up customer with email:", metadata.customerEmail);
        const customers = await stripe.customers.list({
            email: metadata.customerEmail,
            limit: 1
        });

        let customerId: string | undefined;
        if (customers.data.length > 0) {
            customerId = customers.data[0].id;
            console.log("Found existing customer:", customerId);
        } else {
            console.log("No existing customer found, will create new one");
        }

        // Prepare line items
        const lineItems = items.map((item) => {
            const price = Math.round(item.product.price! * 100);
            console.log(`Product: ${item.product.name}, Price: ${price}, Quantity: ${item.quantity}`);

            return {
                price_data: {
                    currency: "inr",
                    unit_amount: price,
                    product_data: {
                        name: item.product.name || "Unnamed Product",
                        description: `Product Id : ${item.product._id}`,
                        metadata: {
                            id: item.product._id,
                        },
                        images: item.product.image ? [imageUrl(item.product.image).url()] : undefined
                    }
                },
                quantity: item.quantity,
            };
        });

        console.log("Creating Stripe checkout session with line items:", JSON.stringify(lineItems, null, 2));

        // Create checkout session
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            customer_creation: customerId ? undefined : "always",
            customer_email: !customerId ? metadata.customerEmail : undefined,
            metadata,
            allow_promotion_codes: true,
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/basket`,
            line_items: lineItems,
            mode: "payment",
        });

        console.log("Checkout session created successfully:", session.id);
        console.log("Checkout URL:", session.url);

        return session.url;
    } catch (error) {
        console.error("Error creating checkout session:", error);
        if (error instanceof Error) {
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
        }
        throw error;
    }
}