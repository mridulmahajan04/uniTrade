import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getAllProducts = async () => {
    const ALL_PRODUCT_QUERY = defineQuery(
        `*[
            _type == "product"
        ] | order(name asc)`
    )

    try {
        const product = await sanityFetch({
            query: ALL_PRODUCT_QUERY,
        });
        console.log(product)
        return product.data || [];
    } catch (error) {
        console.error(error);
    }
}
