import { getAllProducts } from '@/sanity/lib/products/getAllProducts'
import { getAllCategories } from '@/sanity/lib/products/getAllCategories';
import React from 'react'

const page = async () => {
    const products = await getAllProducts();
    const categories = await getAllCategories();
    console.log(products);
    return (
        <div>
            hello
        </div>
    )
}
export default page
