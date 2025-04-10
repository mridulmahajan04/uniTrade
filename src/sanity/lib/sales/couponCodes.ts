export const COUPON_CODES = {
    MRIDUL50: "MRIDUL50",
}  as const;

export type CouponCode = keyof typeof COUPON_CODES;