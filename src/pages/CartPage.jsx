import { useEffect } from 'react';
import { cartTotal, formatMoney } from '../lib/format.js';
import { toCartProducts, toProductProperties, trackEvent, trackPage } from '../analytics.js';
import ProductImage from '../components/ProductImage.jsx';

export default function CartPage({ cart, updateCartQuantity, removeFromCart, navigateTo }) {
  const total = cartTotal(cart);

  useEffect(() => {
    trackPage('Cart Page', { cart_id: 'demo-cart', cartItems: cart.length });
    trackEvent('Cart Viewed', {
      cart_id: 'demo-cart',
      currency: 'USD',
      value: total,
      products: toCartProducts(cart),
    });
  }, [cart, total]);

  return (
    <div className="w-screen min-h-screen bg-white">
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 py-6 sm:py-8 text-center px-4">Your Shopping Cart</h2>
      {cart.length === 0 ? (
        <div className="text-center text-gray-600 text-lg sm:text-xl py-10 px-4">
          <p className="mb-6">Your cart is empty.</p>
          <button
            onClick={() => navigateTo('home')}
            className="bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300"
          >
            Start shopping!
          </button>
        </div>
      ) : (
        <div className="w-full">
          <div className="divide-y divide-gray-200 px-4 sm:px-8">
            {cart.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 sm:py-6 gap-3 sm:gap-4">
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <ProductImage
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover rounded-lg shadow-md flex-shrink-0"
                    fallback="https://placehold.co/100x100/F0F9FF/000?text=Image"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 leading-tight mb-1">{item.name}</h3>
                    <p className="text-sm sm:text-base text-gray-600 font-medium">{formatMoney(item.price)}</p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:gap-4 w-full sm:w-auto">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="px-2 sm:px-3 py-1 text-sm sm:text-base font-bold text-gray-700 hover:bg-gray-100 rounded-l-lg transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-2 sm:px-3 py-1 text-sm sm:text-base font-medium min-w-[2rem] text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="px-2 sm:px-3 py-1 text-sm sm:text-base font-bold text-gray-700 hover:bg-gray-100 rounded-r-lg transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <p className="text-base sm:text-lg font-bold text-gray-800 min-w-fit">{formatMoney(item.price * item.quantity)}</p>
                    <button
                      onClick={() => {
                        removeFromCart(item.id);
                        trackEvent('Product Removed', toProductProperties(item, {
                          quantity: item.quantity,
                        }));
                      }}
                      className="bg-red-500 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-full hover:bg-red-600 transition-colors duration-300 text-xs sm:text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 px-4 sm:px-8 pb-6 sm:pb-8 gap-4">
            <div className="text-center sm:text-right sm:mr-6">
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Total: {formatMoney(total)}</p>
            </div>
            <button
              onClick={() => navigateTo('checkout')}
              className="bg-green-600 text-white px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg md:text-xl font-semibold shadow-lg hover:bg-green-700 transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
            >
              Buy Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
