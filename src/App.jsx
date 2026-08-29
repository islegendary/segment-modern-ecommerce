import { useCallback, useEffect, useState } from 'react';
import {
  hasWriteKey,
  initializeAnalytics,
  toCartProducts,
  toProductProperties,
  trackEvent,
} from './analytics.js';
import Header from './components/Header.jsx';
import CartPage from './pages/CartPage.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import CustomFormPage from './pages/CustomFormPage.jsx';
import HomePage from './pages/HomePage.jsx';
import OrderConfirmationPage from './pages/OrderConfirmationPage.jsx';
import ProductPage from './pages/ProductPage.jsx';
import SignupForm from './pages/SignupForm.jsx';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    initializeAnalytics();
  }, []);

  const navigateTo = useCallback((page, param = null) => {
    setCurrentPage(page);
    if (page === 'category') {
      setCurrentCategory(param);
      setCurrentProductId(null);
    } else if (page === 'product') {
      setCurrentProductId(param);
      setCurrentCategory(null);
    } else {
      setCurrentCategory(null);
      setCurrentProductId(null);
    }
    window.scrollTo(0, 0);
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const addToCart = (productToAdd) => {
    setCart((previous) => {
      const existingItem = previous.find((item) => item.id === productToAdd.id);
      if (existingItem) {
        return previous.map((item) => (
          item.id === productToAdd.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      }
      return [...previous, { ...productToAdd, quantity: 1 }];
    });
  };

  const updateCartQuantity = (productId, newQuantity) => {
    setCart((previous) => {
      const currentItem = previous.find((item) => item.id === productId);

      if (newQuantity <= 0) {
        return previous.filter((item) => item.id !== productId);
      }

      if (currentItem && newQuantity > currentItem.quantity) {
        trackEvent('Product Added', toProductProperties(currentItem, {
          quantity: 1,
          source: 'Cart Quantity Update',
        }));
      }

      if (currentItem && newQuantity < currentItem.quantity) {
        trackEvent('Product Removed', toProductProperties(currentItem, {
          quantity: 1,
          source: 'Cart Quantity Update',
          previousQuantity: currentItem.quantity,
          newQuantity,
        }));
      }

      return previous.map((item) => (
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    });
  };

  const removeFromCart = (productId) => {
    setCart((previous) => previous.filter((item) => item.id !== productId));
  };

  const completeOrder = (currentCart, orderTotal) => {
    trackEvent('Order Completed', {
      checkout_id: 'demo-checkout',
      order_id: `ORD-${Date.now()}`,
      affiliation: 'Titan AI Robotics',
      total: orderTotal,
      revenue: orderTotal,
      currency: 'USD',
      products: toCartProducts(currentCart),
    });
    navigateTo('orderConfirmation');
  };

  const pages = {
    home: <HomePage navigateTo={navigateTo} />,
    category: <CategoryPage categoryName={currentCategory} navigateTo={navigateTo} />,
    product: <ProductPage key={currentProductId} productId={currentProductId} navigateTo={navigateTo} addToCart={addToCart} />,
    cart: <CartPage cart={cart} updateCartQuantity={updateCartQuantity} removeFromCart={removeFromCart} navigateTo={navigateTo} />,
    checkout: <CheckoutPage cart={cart} navigateTo={navigateTo} completeOrder={completeOrder} />,
    orderConfirmation: <OrderConfirmationPage navigateTo={navigateTo} clearCart={clearCart} />,
    signup: <SignupForm navigateTo={navigateTo} />,
    customForm: <CustomFormPage navigateTo={navigateTo} />,
  };

  return (
    <div className="min-h-screen bg-gray-50 font-inter text-gray-800">
      <Header
        navigateTo={navigateTo}
        cartItemCount={cart.reduce((count, item) => count + item.quantity, 0)}
      />
      <main className={`w-full ${currentPage === 'cart' ? '' : 'py-8'}`}>
        {pages[currentPage] || pages.home}
      </main>
      <footer className="bg-gray-800 text-white p-6 text-center mt-12">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} Titan AI Robotics. All rights reserved.</p>
          <p className="text-sm mt-2">
            {hasWriteKey
              ? 'Events are logged in the console and also sent to your Segment workspace.'
              : 'Events are logged in the console. Add a write key in src/analytics.js to also send them.'}
          </p>
        </div>
      </footer>
    </div>
  );
}
