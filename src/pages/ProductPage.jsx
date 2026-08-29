import { useEffect, useState } from 'react';
import { Box, ShoppingCart } from 'lucide-react';
import { products } from '../data/products.js';
import { formatMoney } from '../lib/format.js';
import { toProductProperties, trackEvent, trackPage } from '../analytics.js';
import ProductImage from '../components/ProductImage.jsx';

export default function ProductPage({ productId, navigateTo, addToCart }) {
  const product = products.find((item) => item.id === productId);
  const [showAddedToCartMessage, setShowAddedToCartMessage] = useState(false);
  const [selectedSize, setSelectedSize] = useState(
    product?.hasSizes && product.sizes?.[0] ? product.sizes[0] : null
  );

  useEffect(() => {
    if (product) {
      const viewed = toProductProperties(product);
      trackPage('Product Page', viewed);
      trackEvent('Product Viewed', viewed);
    }
  }, [productId, product]);

  if (!product) {
    return (
      <div className="p-6 text-center text-red-500">
        Product not found. <button onClick={() => navigateTo('home')} className="text-blue-600 underline">Go Home</button>
      </div>
    );
  }

  const handleAddToCart = () => {
    let productToAdd = { ...product };

    if (product.hasSizes && selectedSize) {
      productToAdd = {
        ...product,
        id: `${product.id}-${selectedSize.id}`,
        name: `${product.name} (${selectedSize.name})`,
        price: selectedSize.price,
        selectedSize,
      };
    }

    addToCart(productToAdd);

    trackEvent('Product Added', toProductProperties(productToAdd, {
      quantity: 1,
      ...(selectedSize && { variant: selectedSize.name }),
    }));

    setShowAddedToCartMessage(true);
    setTimeout(() => setShowAddedToCartMessage(false), 5000);
  };

  const currentPrice = product.hasSizes && selectedSize ? selectedSize.price : product.price;
  const canAddToCart = !product.hasSizes || selectedSize;

  return (
    <div className="p-4 sm:p-6">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 flex flex-col lg:flex-row items-center gap-6 sm:gap-8 md:gap-10">
        <div className="w-full lg:w-1/2 flex justify-center">
          <ProductImage
            src={product.image}
            alt={product.name}
            className="rounded-xl sm:rounded-2xl shadow-lg max-w-full h-auto object-cover"
            fallback="https://placehold.co/600x450/F0F9FF/000?text=Image+Not+Found"
          />
        </div>
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">{product.name}</h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-4 sm:mb-6">{product.description}</p>
          {product.isCustom ? (
            <p className="text-blue-600 text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6">TBD</p>
          ) : (
            <p className="text-blue-600 text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6">{formatMoney(currentPrice)}</p>
          )}
          {product.subscription && (
            <p className="text-purple-600 text-base sm:text-lg font-semibold mb-4 sm:mb-6">Monthly Subscription</p>
          )}

          {product.hasSizes && product.sizes && (
            <div className="mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">
                {product.id === 'power-cap' ? 'Select Option:' : 'Select Size:'}
              </h3>
              <div className={`grid gap-2 sm:gap-3 ${product.id === 'power-cap' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-3'}`}>
                {product.sizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size)}
                    className={`p-2 sm:p-3 rounded-lg sm:rounded-xl border-2 transition-all duration-300 ${selectedSize?.id === size.id
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                    } ${product.id === 'power-cap' && size.id === 'NEURALINK' ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-300 hover:border-purple-400' : ''}`}
                  >
                    <div className="font-semibold text-sm sm:text-base">{size.name}</div>
                    <div className={`text-xs sm:text-sm ${size.id === 'NEURALINK' ? 'text-purple-600 font-bold' : 'text-gray-600'}`}>
                      {formatMoney(size.price)}
                      {size.id === 'NEURALINK' && <span className="block text-xs text-purple-500 mt-1">Premium Neural Interface</span>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.isCustom ? (
            <button
              onClick={() => navigateTo('customForm')}
              className="px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg md:text-xl font-semibold shadow-lg transform transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 mx-auto lg:mx-0 bg-purple-600 text-white hover:bg-purple-700 hover:scale-105"
            >
              <Box size={20} className="sm:w-6 sm:h-6" /> Configure Custom Robot
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={!canAddToCart}
              className={`px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg md:text-xl font-semibold shadow-lg transform transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 mx-auto lg:mx-0 ${canAddToCart
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <ShoppingCart size={20} className="sm:w-6 sm:h-6" /> Add to Cart
            </button>
          )}

          {!canAddToCart && product.hasSizes && !product.isCustom && (
            <p className="text-red-500 text-xs sm:text-sm mt-2 text-center lg:text-left">
              {product.id === 'power-cap' ? 'Please select an option first' : 'Please select a size first'}
            </p>
          )}

          {showAddedToCartMessage && !product.isCustom && (
            <div className="mt-4 sm:mt-6 p-4 sm:p-5 bg-green-100 text-green-800 rounded-xl shadow-lg border border-green-200">
              <p className="font-bold text-lg sm:text-xl mb-3 sm:mb-4 text-center">Product added to cart!</p>
              <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3">
                <button
                  onClick={() => navigateTo('cart')}
                  className="bg-blue-600 text-white px-4 sm:px-5 py-2 sm:py-3 rounded-full hover:bg-blue-700 transition-colors duration-300 text-sm sm:text-base font-semibold shadow-md"
                >
                  View Cart
                </button>
                <button
                  onClick={() => navigateTo('category', product.category)}
                  className="bg-gray-700 text-white px-4 sm:px-5 py-2 sm:py-3 rounded-full hover:bg-gray-800 transition-colors duration-300 text-sm sm:text-base font-semibold shadow-md"
                >
                  Back to {product.category}
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => navigateTo('category', product.category)}
            className="mt-4 bg-gray-200 text-gray-800 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base md:text-lg font-medium hover:bg-gray-300 transition-colors duration-300 mx-auto lg:mx-0 block"
          >
            Back to {product.category}
          </button>
        </div>
      </div>
    </div>
  );
}
