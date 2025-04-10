import { TagIcon } from "@sanity/icons";
import { defineType, defineField } from "sanity";

export const salesType = defineType({
    name: "sale",
    title: "Sales",
    type: "document",
    icon: TagIcon,
    fields: [
        defineField({
            name: "title",
            title: "Sale Title",
            type: "string",
        }),
        defineField({
            name: "description",
            title: "Sale Description",
            type: "text",
        }),
        defineField({
            name: "discountAmount",
            title: "Discount Amount",
            type: "number",
            description: "Amount off in percentage or Fixed Value",
        }),
        defineField({
            name: "coupanCode",
            type: "string",
            title: "Coupan Code",
        }),
        defineField({
            name: "validFrom",
            type: "datetime",
            title: "valid From",
        }),
        defineField({
            name: "validUntill",
            type: "datetime",
            title: "ValidUntill",
        }),

        defineField({
            name: "isActive",
            type: "boolean",
            title: "Is Active",
            description: "Toogle to activate or deactivate",
            initialValue: false,
        })
    ],
    preview: {
        select: {
            title: "title",
            discountAmount: "discountAmount",
            coupanCode: "coupanCode",
            isActive: "isActive",
        },
        prepare(select) {
            const { title, discountAmount, coupanCode, isActive } = select;
            const status = isActive ? "Active" : "Inactive"; //You can use select. also 
            return {
                title:select.title,
                subtitle: `${discountAmount}% off - Code : ${coupanCode} - ${status}`,
            };
        }
    }
})