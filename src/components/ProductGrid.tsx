"use client"
import { Product } from "../../sanity.types";
import React from 'react'
import ProductThumb from "../components/ProductThumb"

const ProductGrid = ({ products }: { products: Product[] }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products?.map((product) => (
                <ProductThumb key={product._id} product={product} />
            ))}
        </div>
    )
}

export default ProductGrid
