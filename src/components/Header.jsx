import { ShoppingCart, Home, Mail } from 'lucide-react';

export default function Header({ navigateTo, cartItemCount }) {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-bold font-inter cursor-pointer" onClick={() => navigateTo('home')}>
          Titan AI Robotics
        </h1>
        <nav className="flex items-center flex-wrap gap-2 sm:gap-4">
          <button
            type="button"
            aria-label="Home"
            onClick={() => navigateTo('home')}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-full hover:bg-white hover:text-blue-600 transition-all duration-300 font-medium text-sm sm:text-base"
          >
            <Home size={18} className="sm:w-5 sm:h-5" /> <span className="hidden sm:inline">Home</span>
          </button>
          <button
            type="button"
            aria-label="Offers"
            onClick={() => navigateTo('signup')}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-full hover:bg-white hover:text-blue-600 transition-all duration-300 font-medium text-sm sm:text-base"
          >
            <Mail size={18} className="sm:w-5 sm:h-5" /> <span className="hidden sm:inline">Offers</span>
          </button>
          <div className="relative">
            <button
              type="button"
              aria-label="Cart"
              onClick={() => navigateTo('cart')}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-full hover:bg-white hover:text-blue-600 transition-all duration-300 font-medium text-sm sm:text-base"
            >
              <ShoppingCart size={18} className="sm:w-5 sm:h-5" /> <span className="hidden sm:inline">Cart</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
