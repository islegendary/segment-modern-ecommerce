import { useEffect, useRef } from 'react';
import { trackPage } from '../analytics.js';

export default function OrderConfirmationPage({ navigateTo, clearCart }) {
  const hasClearedCart = useRef(false);

  useEffect(() => {
    trackPage('Order Confirmation Page');
    if (!hasClearedCart.current) {
      clearCart();
      hasClearedCart.current = true;
    }
  }, [clearCart]);

  return (
    <div className="p-4 sm:p-6">
      <div className="text-center bg-white rounded-xl shadow-md p-6 sm:p-8 md:p-10 mx-4">
        <h3 className="text-2xl sm:text-3xl font-bold text-green-700 mb-3 sm:mb-4">Titan thanks you for your order!</h3>
        <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6">Your order has been successfully placed.</p>
        <button
          onClick={() => navigateTo('home')}
          className="bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300"
        >
          Click here to refresh demo
        </button>
      </div>
    </div>
  );
}
