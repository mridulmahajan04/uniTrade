import React from 'react'
import { Product } from '../../sanity.types'
import { Category } from '../../sanity.types';
import ProductGrid from './ProductGrid';
import { CategorySelectorComponent } from './ui/category-selector';

interface ProductsViewProps {
  products: Product[];
  categories: Category[];
}

const ProductsView = ({ products, categories }: ProductsViewProps) => {
  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold mb-6 text-gray-900">All Products</h1>
      
      {/* Layout container */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Categories */}
        <div className="w-full md:w-64 mb-6 md:mb-0">
          <h2 className="text-lg font-medium mb-3">Categories</h2>
          <CategorySelectorComponent categories={categories} />
        </div>

        {/* Products */}
        <div className="flex-1">
          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="bg-white p-8 rounded-lg text-center">
              <p className="text-gray-500">No products found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductsView
