import { getAllProducts } from '@/sanity/lib/products/getAllProducts'
import { getAllCategories } from '@/sanity/lib/products/getAllCategories';
import ProductsView from '@/components/ProductsView';
import React from 'react'
import ChristmasBanner from '@/components/ChristmasBanner';

const page = async () => {
    const products = await getAllProducts();
    const categories = await getAllCategories();
    console.log(products);
    return (
        <div>
            <ChristmasBanner />
            <div className="flex flex-col items-center justify-top min-h-screen bg-gray-100 p-4" >
                <ProductsView products={products} categories={categories} />
            </div>
        </div>
    )
}
export default page
