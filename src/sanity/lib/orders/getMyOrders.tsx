import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

const MY_ORDERS_QUERY = defineQuery(`
*[_type == "order" && clerkUserId == $userId] | order(orderDate desc) {
    _id,
    orderNumber,
    customerName,
    customerEmail,
    totalPrice,
    currency,
    status,
    orderDate,
    products[]{
        _key,
        quantity,
        product->{
            _id,
            name,
            price,
            currency,
            "slug": slug.current,
            image {
                asset->{
                    _id,
                    url
                }
            }
        }
    }
}
`);

export async function getMyOrders(userId: string) {
    if (!userId) {
        throw new Error("User ID is required");
    }

    try {
        const response = await sanityFetch({
            query: MY_ORDERS_QUERY,
            params: { userId }
        });
        return response.data || [];
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw new Error("Error fetching orders");
    }
}