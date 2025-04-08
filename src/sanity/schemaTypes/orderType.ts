import { BasketIcon } from "@sanity/icons"
import { defineType, defineField, defineArrayMember } from "sanity"

export const orderType = defineType({
    name: "order",
    title: "Order",
    type: "document",
    icon: BasketIcon,
    fields: [
        defineField({
            name: "orderNumber",
            title: "Order Number",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "checkoutSessionId",
            title: "Checkout ID",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "customerId",
            title: "Customer ID",
            type: "string",
            validation: (Rule) => Rule.required()
        }),
        defineField({
            name: "paymentIntent",
            title: "Payment Intent ID",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "product",
            title: "Products",
            type: "array",
            of: [
                defineArrayMember({
                    type: "object",
                    fields: [
                        defineField({
                            name: "product",
                            title: "Product Bought",
                            type: "reference",
                            to: [{ type: "product" }],
                        }),
                        defineField({
                            name: "quantity",
                            title: "Quantity Purchase",
                            type: "number",
                        }),
                    ],
                    preview: {
                        select: {
                            product: "product.name",
                            image: "product.image",
                            quantity: "quantity",
                            price: "product.price",
                            currency: "product.currency"
                        },
                        prepare(select) {
                            return {
                                title: `${select.price} x ${select.quantity}`,
                                subtitle: `${select.price * select.quantity} `,
                                media: select.image,
                            }
                        }
                    }
                })
            ]
        }),
        defineField({
            name: "totalPrice",
            title: "Total Price",
            type: "number",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "currency",
            title: "Currency",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "amountDiscount",
            title: "Amount Discount",
            type: "number",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "status",
            title: "Order Status",
            type: "string",
            options: {
                list: [
                    { title: "Pending", value: "Pending" },
                    { title: "Paid", value: "Paid" },
                    { title: "Shipped", value: "Shipped" },
                    { title: "Delivered", value: "Delivered" },
                    { title: "Cancelled", value: "Cancelled" },
                ]
            }
        }),
        defineField({
            name: "orderDate",
            title: "Order Date",
            type: "datetime",
            validation: (Rule) => Rule.required(),
        }),
    ],
    preview: {
        select: {
            name: "customerName",
            amount: "totalPrice",
            currency: "currency",
            orderId: "orderNumber",
            email: "email",
        },
        prepare(select) {
            const orderIdSnippet = `${select.orderId.slice(0, 5)}...${ select.orderId.slice(-5)}`;
            return {
                title: `${select.name}(${orderIdSnippet})`,
                subtitle: `${select.amount} ${select.currency}, ${select.email}`,
                media: BasketIcon
            }
        }
    }
})

