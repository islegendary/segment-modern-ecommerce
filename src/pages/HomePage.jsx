import { useEffect } from 'react';
import { Box, Package, Shirt, BellRing } from 'lucide-react';
import { trackPage } from '../analytics.js';
import ProductImage from '../components/ProductImage.jsx';

const categories = [
  { name: 'Models', icon: Box, description: 'Discover our range of Titan AI robots.' },
  { name: 'Accessories', icon: Package, description: 'Enhance your Titan with essential add-ons.' },
  { name: 'Modules', icon: BellRing, description: 'Unlock new capabilities with subscription modules.' },
  { name: 'Apparel', icon: Shirt, description: 'Show your Titan pride with exclusive apparel.' },
];

export default function HomePage({ navigateTo }) {
  useEffect(() => {
    trackPage('Home Page');
  }, []);

  return (
    <div className="p-4 sm:p-6">
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 lg:p-16 mb-8 sm:mb-12 flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6 md:gap-8">
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-3 sm:mb-4 leading-tight">
            Meet <span className="text-blue-600">Titan</span>, Your AI Companion
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-4 sm:mb-6">
            Revolutionizing daily life with intelligent automation and seamless interaction.
          </p>
          <button
            onClick={() => navigateTo('category', 'Models')}
            className="bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300"
          >
            Explore Models
          </button>
        </div>
        <div className="w-full lg:w-1/2 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 md:gap-6">
          <div className="w-full sm:w-1/2 max-w-xs sm:max-w-sm">
            <ProductImage
              src="/assets/TitanPint.png"
              alt="Titan the AI Robot"
              className="rounded-xl sm:rounded-2xl shadow-2xl w-full h-auto"
              fallback="https://placehold.co/500x400/D1E9FF/000?text=Titan+Robot"
            />
          </div>
          <div className="w-full sm:w-1/2 max-w-xs sm:max-w-sm">
            <video
              src="/assets/TitanVideo.mp4"
              className="rounded-xl sm:rounded-2xl shadow-2xl w-full h-auto"
              autoPlay
              muted
              playsInline
              onEnded={(event) => { event.target.style.display = 'block'; }}
              style={{ maxHeight: '300px', maxWidth: '100%' }}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      <section className="mb-8 sm:mb-12">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 text-center mb-6 sm:mb-8 md:mb-10">Our Product Categories</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.name}
                className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col items-center text-center transform hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-200 hover:border-blue-400"
                onClick={() => navigateTo('category', category.name)}
              >
                <div className="text-blue-600 mb-3 sm:mb-4">
                  <Icon size={40} />
                </div>
                <h4 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-2">{category.name}</h4>
                <p className="text-sm sm:text-base text-gray-600">{category.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 text-center shadow-xl">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Stay Connected with Titan</h3>
        <p className="text-base sm:text-lg md:text-xl mb-4 sm:mb-6">Sign up for exclusive offers and the latest news!</p>
        <button
          onClick={() => navigateTo('signup')}
          className="bg-white text-purple-700 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold shadow-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300"
        >
          Sign Up Now!
        </button>
      </section>
    </div>
  );
}
