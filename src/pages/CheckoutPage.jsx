import { useEffect } from 'react';
import { cartTotal, formatMoney } from '../lib/format.js';
import { toCartProducts, trackEvent, trackPage } from '../analytics.js';
import ProductImage from '../components/ProductImage.jsx';

export default function CheckoutPage({ cart, navigateTo, completeOrder }) {
  const total = cartTotal(cart);

  useEffect(() => {
    trackPage('Checkout Page', { cart_id: 'demo-cart', cartItems: cart.length });
    if (cart.length > 0) {
      trackEvent('Checkout Started', {
        checkout_id: 'demo-checkout',
        currency: 'USD',
        value: total,
        revenue: total,
        products: toCartProducts(cart),
      });
    }
  }, [cart, total]);

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 text-center px-4">Confirm Your Order</h2>
      {cart.length === 0 ? (
        <div className="text-center text-gray-600 text-lg sm:text-xl p-6 sm:p-10 bg-white rounded-xl shadow-md mx-4">
          <p className="mb-6">Your cart is empty.</p>
          <button
            onClick={() => navigateTo('home')}
            className="bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300"
          >
            Start shopping!
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 w-full mx-auto max-w-4xl">
          <div className="divide-y divide-gray-200 mb-4 sm:mb-6">
            {cart.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 sm:py-4 gap-2 sm:gap-4">
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <ProductImage
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-md shadow-sm flex-shrink-0"
                    fallback="https://placehold.co/80x80/F0F9FF/000?text=Image"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 leading-tight mb-1">{item.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="text-base sm:text-lg font-bold text-gray-800 text-right sm:text-left">{formatMoney(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 gap-4">
            <div className="text-center sm:text-right sm:mr-6">
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Total: {formatMoney(total)}</p>
            </div>
            <button
              onClick={() => completeOrder(cart, total)}
              className="bg-blue-600 text-white px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg md:text-xl font-semibold shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
            >
              Buy Now
            </button>
          </div>
          <button
            onClick={() => navigateTo('cart')}
            className="mt-4 sm:mt-6 bg-gray-200 text-gray-800 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base md:text-lg font-medium hover:bg-gray-300 transition-colors duration-300 block mx-auto"
          >
            Back to Cart
          </button>
        </div>
      )}
    </div>
  );
}
