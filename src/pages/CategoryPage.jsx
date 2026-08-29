import { useEffect } from 'react';
import { products } from '../data/products.js';
import { getPriceDisplay } from '../lib/format.js';
import { toProductProperties, trackEvent, trackPage } from '../analytics.js';
import ProductImage from '../components/ProductImage.jsx';

export default function CategoryPage({ categoryName, navigateTo }) {
  const filteredProducts = products.filter((product) => product.category === categoryName);

  useEffect(() => {
    const listed = products.filter((product) => product.category === categoryName);
    trackPage('Category Page', { category: categoryName });
    trackEvent('Product List Viewed', {
      category: categoryName,
      products: listed.map((product) => toProductProperties(product)),
    });
  }, [categoryName]);

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 text-center px-4">{categoryName}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-200 hover:border-blue-400"
            onClick={() => {
              trackEvent('Product Clicked', toProductProperties(product));
              navigateTo('product', product.id);
            }}
          >
            <ProductImage
              src={product.image}
              alt={product.name}
              className="w-full h-48 sm:h-56 md:h-64 object-cover"
              fallback="https://placehold.co/400x300/F0F9FF/000?text=Image+Not+Found"
            />
            <div className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-2">{product.name}</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-2">{product.description}</p>
              <p className="text-blue-600 text-lg sm:text-xl md:text-2xl font-bold">{getPriceDisplay(product)}</p>
              {product.subscription && (
                <span className="text-xs sm:text-sm text-purple-600 font-medium mt-2 block">Monthly Subscription</span>
              )}
              {product.hasSizes && (
                <span className="text-xs sm:text-sm text-green-600 font-medium mt-2 block">
                  {product.id === 'power-cap' ? 'Available in 2 options' : 'Available in 3 sizes'}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 sm:mt-8 text-center">
        <button
          onClick={() => navigateTo('home')}
          className="bg-gray-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-base sm:text-lg font-medium hover:bg-gray-800 transition-colors duration-300"
        >
          Back to All Categories
        </button>
      </div>
    </div>
  );
}
