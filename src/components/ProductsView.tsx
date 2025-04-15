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
    <div>
      {/* Categories */}
      <div>
        <div className='q-full sm:w-[200px]'>
          <CategorySelectorComponent categories={categories} />
        </div>
      </div>

      {/* Products */}
      <div className="flex-1">
        <div>
          <ProductGrid products={products} />
          <hr className="w-1/2 sm:w-3/4"></hr>
        </div>
      </div>
    </div>
  )
}

export default ProductsView
