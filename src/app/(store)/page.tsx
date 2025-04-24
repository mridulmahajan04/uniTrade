import { getAllProducts } from "@/sanity/lib/products/getAllProducts";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "../../../sanity.types";

export default async function Home() {
  // Fetch products from Sanity
  const products = await getAllProducts();
  // Get featured products (limited to 3)
  const featuredProducts = products.slice(0, 3);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-800 to-blue-600 bg-cover bg-center"></div>
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Discover Premium Quality Products</h1>
            <p className="text-lg md:text-xl text-white/90 mb-8">Explore our curated collection of unique items for every lifestyle</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/product" className="bg-white text-black px-6 py-3 rounded-md font-medium hover:bg-opacity-90 transition-all text-center">
                Shop Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">Discover our most popular items, handpicked for quality and style</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product: Product) => (
                <div key={product._id} className="group">
                  <Link href={`/product/${product.slug?.current}`}>
                    <div className="relative overflow-hidden rounded-lg mb-4 aspect-square bg-neutral-100">
                      {product.image?.asset ? (
                        <Image
                          src={urlFor(product.image).width(500).height(500).url()}
                          alt={product.name || "Product image"}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200"></div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white font-medium">Quick View</p>
                      </div>
                    </div>
                  </Link>
                  <h3 className="font-medium text-lg mb-2">{product.name}</h3>
                  <p className="text-neutral-600 mb-2 line-clamp-2">
                    {product.description && 
                      product.description.some(block => block._type === 'block') 
                        ? product.description.find(block => block._type === 'block')?.children?.[0]?.text 
                        : "High-quality product"
                    }
                  </p>
                  <p className="font-semibold">${product.price?.toFixed(2)}</p>
                </div>
              ))
            ) : (
              // Fallback for when no products are available
              <>
                {/* Product Card 1 */}
                <div className="group">
                  <div className="relative overflow-hidden rounded-lg mb-4 aspect-square bg-neutral-100">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white font-medium">Quick View</p>
                    </div>
                  </div>
                  <h3 className="font-medium text-lg mb-2">Premium Product</h3>
                  <p className="text-neutral-600 mb-2">High-quality craftsmanship</p>
                  <p className="font-semibold">$99.99</p>
                </div>
                
                {/* Product Card 2 */}
                <div className="group">
                  <div className="relative overflow-hidden rounded-lg mb-4 aspect-square bg-neutral-100">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-amber-200"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white font-medium">Quick View</p>
                    </div>
                  </div>
                  <h3 className="font-medium text-lg mb-2">Exclusive Item</h3>
                  <p className="text-neutral-600 mb-2">Limited edition collection</p>
                  <p className="font-semibold">$149.99</p>
                </div>
                
                {/* Product Card 3 */}
                <div className="group">
                  <div className="relative overflow-hidden rounded-lg mb-4 aspect-square bg-neutral-100">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-emerald-200"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white font-medium">Quick View</p>
                    </div>
                  </div>
                  <h3 className="font-medium text-lg mb-2">Trending Product</h3>
                  <p className="text-neutral-600 mb-2">Customer favorite</p>
                  <p className="font-semibold">$79.99</p>
                </div>
              </>
            )}
          </div>
          
          <div className="text-center mt-12">
            <a href="/product" className="inline-block border border-black text-black px-6 py-3 rounded-md font-medium hover:bg-black hover:text-white transition-all">
              View All Products
            </a>
          </div>
        </div>
      </section>

     
      {/* Call to Action */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Community</h2>
            <p className="text-xl text-white/80 mb-8">Sign up to receive updates on new products, exclusive offers, and more.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="px-6 py-3 rounded-md bg-white/10 text-white border border-white/20 focus:outline-none focus:border-white/50"
              />
              <button className="bg-white text-black px-6 py-3 rounded-md font-medium hover:bg-opacity-90 transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Guaranteed</h3>
              <p className="text-neutral-600">All our products are carefully selected to ensure premium quality.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-neutral-600">We pride ourselves on quick and reliable shipping options.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-neutral-600">Our customer service team is available to assist you anytime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-neutral-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">UniTrade</h3>
              <p className="text-neutral-600">Premium products for every lifestyle.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Shop</h3>
              <ul className="space-y-2">
                <li><a href="/product" className="text-neutral-600 hover:text-black">All Products</a></li>
                <li><a href="/categories" className="text-neutral-600 hover:text-black">Categories</a></li>
                <li><a href="/deals" className="text-neutral-600 hover:text-black">Special Deals</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">About</h3>
              <ul className="space-y-2">
                <li><a href="/about" className="text-neutral-600 hover:text-black">Our Story</a></li>
                <li><a href="/contact" className="text-neutral-600 hover:text-black">Contact Us</a></li>
                <li><a href="/careers" className="text-neutral-600 hover:text-black">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="/faq" className="text-neutral-600 hover:text-black">FAQ</a></li>
                <li><a href="/shipping" className="text-neutral-600 hover:text-black">Shipping</a></li>
                <li><a href="/returns" className="text-neutral-600 hover:text-black">Returns</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-200 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-600 mb-4 md:mb-0">© 2024 UniTrade. All rights reserved.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-600 hover:text-black">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-neutral-600 hover:text-black">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-neutral-600 hover:text-black">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
