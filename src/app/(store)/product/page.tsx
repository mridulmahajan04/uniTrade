import { getAllProducts } from '@/sanity/lib/products/getAllProducts'
import { getAllCategories } from '@/sanity/lib/products/getAllCategories';
import ProductsView from '@/components/ProductsView';
import React from 'react'
import ChristmasBanner from '@/components/ChristmasBanner';

const page = async () => {
    const products = await getAllProducts();
    const categories = await getAllCategories();
    
    return (
        <main className="min-h-screen bg-gray-50">
            <ChristmasBanner />
            <ProductsView products={products} categories={categories} />
        </main>
    )
}

export default page
