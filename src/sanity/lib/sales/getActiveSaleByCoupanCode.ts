import { sanityFetch } from "../live";
import { defineQuery } from "next-sanity";
import { CouponCode } from "./couponCodes";
export const getActiveSaleByCoupanCode = async (couponCode: CouponCode) =>  {
    const SALE_QUERY = defineQuery(
        `
            *[
                _type == "sale"
                && isActive == true
                && coupanCode == $couponCode
            ] | order(validFrom desc)[0]
        `
    )
    console.log(couponCode)
    try{
        const activeSale = await sanityFetch({
            query : SALE_QUERY,
            params:{
                couponCode,
            },
        });
        return activeSale ? activeSale.data : null;
    }catch(error) {
        console.error("Error fetching active sale by coupan code", error);
        return null;
    }
}
