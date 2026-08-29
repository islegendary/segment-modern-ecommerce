import { useEffect, useState } from 'react';
import { BellRing, Mail } from 'lucide-react';
import { getStableUserId, identifyUser, trackEvent, trackPage } from '../analytics.js';
import ProductImage from '../components/ProductImage.jsx';

export default function SignupForm({ navigateTo }) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    trackPage('Signup Page');
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email && !phone) {
      setMessage('Please enter an email address or phone number.');
      return;
    }
    const traits = {};
    if (email) traits.email = email;
    if (phone) traits.phone = phone;
    const userId = getStableUserId(email || phone);

    identifyUser(userId, traits);

    trackEvent('Signed Up', {
      source: 'Signup Form',
      method: 'form',
    }, {
      context: { traits },
    });

    setMessage('Thank you for signing up! Check your console for Segment identify and track calls.');
    setEmail('');
    setPhone('');
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 lg:p-12 w-full mx-auto max-w-6xl">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 text-center px-4">Sign Up for Exclusive Offers</h2>
        <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8 text-center px-4">
          Get the latest news, updates, and special discounts on Titan robots and accessories delivered straight to your inbox or phone!
        </p>
        <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8">
          <div className="w-full lg:w-1/2">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label htmlFor="email" className="block text-left text-gray-700 text-base sm:text-lg font-medium mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    id="email"
                    className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-base sm:text-lg"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="block text-left text-gray-700 text-base sm:text-lg font-medium mb-2">Phone Number (for SMS)</label>
                <div className="relative">
                  <BellRing className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="tel"
                    id="phone"
                    className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-base sm:text-lg"
                    placeholder="(123) 456-7890"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 sm:px-6 py-3 rounded-full text-base sm:text-lg md:text-xl font-semibold shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300"
              >
                Subscribe
              </button>
            </form>
            {message && (
              <p className="mt-4 sm:mt-6 text-green-700 font-semibold text-base sm:text-lg">{message}</p>
            )}
            <button
              onClick={() => navigateTo('home')}
              className="mt-6 sm:mt-8 bg-gray-200 text-gray-800 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base md:text-lg font-medium hover:bg-gray-300 transition-colors duration-300"
            >
              Back to Home
            </button>
          </div>
          <div className="w-full lg:w-1/2 flex justify-center">
            <ProductImage
              src="/assets/TitanOffer.png"
              alt="Titan Robot Special Offer"
              className="rounded-xl sm:rounded-2xl shadow-2xl max-w-full h-auto"
              fallback="https://placehold.co/500x400/D1E9FF/000?text=Titan+Offer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
