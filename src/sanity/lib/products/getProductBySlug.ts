import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getProductBySlug = async (slug: string) => {
    const PRODUCT_SLUG_QUERY = defineQuery(
        `
            *[
                _type == "product" 
                && slug.current == $slug
            ] | order(name asc) [0]
        `
    )

    try {
        const products = await sanityFetch({
            query: PRODUCT_SLUG_QUERY,
            params: {
                slug
            }
        })
        return products.data || null
    } catch (error) {
        console.error(error);
        return null;
    }
}
