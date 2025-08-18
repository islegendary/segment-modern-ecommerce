import React, { useState, useEffect, useCallback } from 'react';
import { ShoppingCart, Home, Box, Package, Shirt, BellRing, Mail } from 'lucide-react';

// --- Product Data ---
const products = [
  // Models
  { id: 'titan-pint', name: 'Titan Pint', price: 499.99, category: 'Models', description: 'Your compact desktop AI companion for smart automations.', image: '/assets/TitanPint.png' },
  { id: 'titan-power', name: 'Titan Power', price: 1299.99, category: 'Models', description: 'The mobile AI robot designed to navigate and assist throughout your home.', image: '/assets/TitanPower.png' },
  { id: 'titan-custom', name: 'Titan Custom', price: 'TBD', category: 'Models', description: 'Engineered specifically for you - our team designs and builds a bespoke AI robot tailored to your unique requirements and environment.', image: '/assets/TitanCustom.png', isCustom: true },

  // Accessories
  { id: 'charging-dock', name: 'Rapid Charging Dock', price: 79.99, category: 'Accessories', description: 'Fast-charge station for your Titan robot.', image: '/assets/TitanDock.png' },
  { id: 'privacy-shield', name: 'Privacy Shield', price: 29.99, category: 'Accessories', description: 'Physical cover for Titan\'s camera and microphone.', image: '/assets/TitanShield.png' },
  { id: 'travel-case', name: 'Rugged Travel Case', price: 59.99, category: 'Accessories', description: 'Durable case for transporting your Titan Pint.', image: '/assets/TitanCase.png' },
  { id: 'voice-module', name: 'Enhanced Voice Module', price: 49.99, category: 'Accessories', description: 'Upgrade Titan\'s voice recognition and output.', image: '/assets/TitanVoice.png' },

  // Modules (Subscription)
  { id: 'home-security-module', name: 'Home Security Module', price: 9.99, category: 'Modules', description: '24/7 monitoring and alerts (monthly subscription).', subscription: true, image: '/assets/ModuleSecurity.png' },
  { id: 'smart-learning-module', name: 'Smart Learning Module', price: 14.99, category: 'Modules', description: 'Advanced AI learning capabilities (monthly subscription).', subscription: true, image: '/assets/ModuleLearning.png' },
  { id: 'wellness-assistant-module', name: 'Wellness Assistant Module', price: 12.99, category: 'Modules', description: 'Personalized health and wellness coaching (monthly subscription).', subscription: true, image: '/assets/ModuleWellness.png' },
  { id: 'developer-api-module', name: 'Developer API Module', price: 19.99, category: 'Modules', description: 'Access to Titan\'s API for custom integrations (monthly subscription).', subscription: true, image: '/assets/ModuleDeveloper.png' },

  // Apparel
  {
    id: 'pint-tshirt',
    name: 'Titan Pint T-Shirt',
    price: 24.99,
    category: 'Apparel',
    description: 'Show your love for Titan Pint with this comfortable tee.',
    image: '/assets/TitanTshirt.png',
    hasSizes: true,
    sizes: [
      { id: 'SM', name: 'Tiny (SM)', price: 24.99 },
      { id: 'LG', name: 'Boom (LG)', price: 24.99 },
      { id: 'XL', name: 'Power (XL)', price: 24.99 }
    ]
  },
  {
    id: 'pint-hoodie',
    name: 'Titan Pint Hoodie',
    price: 49.99,
    category: 'Apparel',
    description: 'Stay warm and stylish with the Titan Pint hoodie.',
    image: '/assets/TitanHoodie.png',
    hasSizes: true,
    sizes: [
      { id: 'SM', name: 'Tiny (SM)', price: 49.99 },
      { id: 'LG', name: 'Boom (LG)', price: 49.99 },
      { id: 'XL', name: 'Power (XL)', price: 49.99 }
    ]
  },
  {
    id: 'power-cap',
    name: 'Titan Power Cap',
    price: 19.99,
    category: 'Apparel',
    description: 'Sport the Titan Power logo with this adjustable cap.',
    image: '/assets/TitanCap.png',
    hasSizes: true,
    sizes: [
      { id: 'ADJUSTABLE', name: 'Adjustable', price: 19.99 },
      { id: 'NEURALINK', name: 'Neuralink (become 1 with Titan)', price: 9999.00 }
    ]
  },
  {
    id: 'power-jacket',
    name: 'Titan Power Jacket',
    price: 79.99,
    category: 'Apparel',
    description: 'Premium jacket for the dedicated Titan Power enthusiast.',
    image: '/assets/TitanJacket.png',
    hasSizes: true,
    sizes: [
      { id: 'SM', name: 'Tiny (SM)', price: 79.99 },
      { id: 'LG', name: 'Boom (LG)', price: 79.99 },
      { id: 'XL', name: 'Power (XL)', price: 79.99 }
    ]
  },
];

// --- Segment Analytics Integration ---
// This function will dynamically inject the Segment Analytics.js snippet.
// All calls to Segment will now use the global 'analytics' object.

// Track last calls to prevent unwanted duplicates
let lastPageCall = null;
let lastTrackCalls = {}; // Store per-event-type tracking

const trackPage = (pageName, properties = {}) => {
  const currentCall = `${pageName}-${JSON.stringify(properties)}`;

  // Prevent duplicate page calls (pages should only be tracked once per unique page+properties combination)
  if (lastPageCall === currentCall) {
    console.log(`Duplicate page call prevented for: ${pageName}`);
    return;
  }

  lastPageCall = currentCall;

  if (window.analytics) {
    console.group(`📄 Segment Page Call: ${pageName}`);
    console.log('📊 Page Properties:', JSON.stringify(properties, null, 2));
    console.groupEnd();
    window.analytics.page(pageName, properties);
  }
};

const trackEvent = (eventName, properties = {}, options = {}) => {
  const currentCall = `${eventName}-${JSON.stringify(properties)}-${JSON.stringify(options)}`;
  const currentTime = Date.now();

  // Define which events should allow duplicates and their cooldown periods
  const eventSettings = {
    'Product Added': { allowDuplicates: true, cooldownMs: 500 }, // Allow adding same product multiple times, short cooldown for rapid clicks
    'Product Removed': { allowDuplicates: true, cooldownMs: 500 }, // Allow removing same product multiple times
    'Product Viewed': { allowDuplicates: false, cooldownMs: 5000 }, // Prevent viewing same product repeatedly for 5 seconds
    'Order Completed': { allowDuplicates: false, cooldownMs: 10000 }, // Prevent duplicate orders for 10 seconds
    'Signed Up': { allowDuplicates: false, cooldownMs: 10000 }, // Prevent duplicate signups for 10 seconds
    'Form Submitted': { allowDuplicates: false, cooldownMs: 5000 }, // Prevent duplicate form submissions for 5 seconds
  };

  const setting = eventSettings[eventName] || { allowDuplicates: true, cooldownMs: 1000 }; // Default: allow with 1s cooldown

  // Initialize tracking for this event type if it doesn't exist
  if (!lastTrackCalls[eventName]) {
    lastTrackCalls[eventName] = { lastCall: null, lastTime: null };
  }

  const lastEventData = lastTrackCalls[eventName];

  // Check for rapid duplicates based on event-specific settings
  if (lastEventData.lastCall === currentCall && lastEventData.lastTime && (currentTime - lastEventData.lastTime) < setting.cooldownMs) {
    if (!setting.allowDuplicates) {
      console.log(`Duplicate ${eventName} prevented (cooldown: ${setting.cooldownMs}ms)`);
      return;
    } else {
      console.log(`Rapid duplicate ${eventName} prevented (cooldown: ${setting.cooldownMs}ms)`);
      return;
    }
  }

  // Update tracking for this event type
  lastTrackCalls[eventName] = {
    lastCall: currentCall,
    lastTime: currentTime
  };

  if (window.analytics) {
    console.group(`🎯 Segment Track Event: ${eventName}`);
    console.log('📊 Event Properties:', JSON.stringify(properties, null, 2));
    if (Object.keys(options).length > 0) {
      console.log('⚙️ Event Options:', JSON.stringify(options, null, 2));
    }
    console.groupEnd();
    window.analytics.track(eventName, properties, options);
  }
};

const initializeSegment = () => {
  // Check if Segment snippet script is already in the DOM
  if (document.querySelector('script[data-segment-loaded="true"]')) {
    console.log("Segment snippet already injected.");
    return;
  }
  const writeKey = "YOUR_SEGMENT_WRITE_KEY_HERE"; // Replace with your actual Segment write key
  // Define the Segment snippet as a string, WITHOUT the initial analytics.page() call
  const segmentSnippet = `
    !function(){var i="analytics",analytics=window[i]=window[i]||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","screen","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware","register"];analytics.factory=function(e){return function(){if(window[i].initialized)return window[i][e].apply(window[i],arguments);var n=Array.prototype.slice.call(arguments);if(["track","screen","alias","group","page","identify"].indexOf(e)>-1){var c=document.querySelector("link[rel='canonical']");n.push({__t:"bpc",c:c&&c.getAttribute("href")||void 0,p:location.pathname,u:location.href,s:location.search,t:document.title,r:document.referrer})}n.unshift(e);analytics.push(n);return analytics}};for(var n=0;n<analytics.methods.length;n++){var key=analytics.methods[n];analytics[key]=analytics.factory(key)}analytics.load=function(key,n){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.setAttribute("data-global-segment-analytics-key",i);t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(t,r);analytics._loadOptions=n};analytics._writeKey="${writeKey}";analytics.SNIPPET_VERSION="5.2.0";
    analytics.load("${writeKey}");
    }}(); // Removed analytics.page() from here
  `;

  // Create a script element and set its innerHTML to the snippet
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.innerHTML = segmentSnippet;
  script.async = true; // Ensure it loads asynchronously
  script.setAttribute('data-segment-loaded', 'true'); // Add a custom attribute to mark it as loaded

  // Append the script to the head of the document
  document.head.appendChild(script);

  // Log a message to confirm snippet injection
  console.log("Segment Analytics.js snippet injected.");
};


// --- Header Component ---
const Header = ({ navigateTo, cartItemCount }) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-bold font-inter cursor-pointer" onClick={() => navigateTo('home')}>
          Titan AI Robotics
        </h1>
        <nav className="flex items-center flex-wrap gap-2 sm:gap-4">
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-full hover:bg-white hover:text-blue-600 transition-all duration-300 font-medium text-sm sm:text-base"
          >
            <Home size={18} className="sm:w-5 sm:h-5" /> <span className="hidden sm:inline">Home</span>
          </button>
          <button
            onClick={() => navigateTo('signup')}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-full hover:bg-white hover:text-blue-600 transition-all duration-300 font-medium text-sm sm:text-base"
          >
            <Mail size={18} className="sm:w-5 sm:h-5" /> <span className="hidden sm:inline">Offers</span>
          </button>
          <div className="relative">
            <button
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
};

// --- Home Page Component ---
const HomePage = ({ navigateTo }) => {
  useEffect(() => {
    // Use centralized page tracking to prevent duplicates
    trackPage('Home Page');
  }, []);

  const categories = [
    { name: 'Models', icon: <Box size={40} />, description: 'Discover our range of Titan AI robots.' },
    { name: 'Accessories', icon: <Package size={40} />, description: 'Enhance your Titan with essential add-ons.' },
    { name: 'Modules', icon: <BellRing size={40} />, description: 'Unlock new capabilities with subscription modules.' },
    { name: 'Apparel', icon: <Shirt size={40} />, description: 'Show your Titan pride with exclusive apparel.' },
  ];

  return (
    <div className="p-6">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl shadow-xl p-8 md:p-16 mb-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            Meet <span className="text-blue-600">Titan</span>, Your AI Companion
          </h2>
          <p className="text-xl text-gray-700 mb-6">
            Revolutionizing daily life with intelligent automation and seamless interaction.
          </p>
          <button
            onClick={() => navigateTo('category', 'Models')}
            className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300"
          >
            Explore Models
          </button>
        </div>
        <div className="md:w-1/2 flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6">
          <div className="w-full md:flex-1 max-w-sm">
            <img
              src="/assets/TitanPint.png"
              alt="Titan the AI Robot"
              className="rounded-2xl shadow-2xl w-full h-auto"
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/500x400/D1E9FF/000?text=Titan+Robot'; }}
            />
          </div>
          <div className="w-full md:flex-1 max-w-sm">
            <video
              src="/assets/TitanVideo.mp4"
              className="rounded-2xl shadow-2xl w-full h-auto"
              autoPlay
              muted
              playsInline
              onEnded={(e) => { e.target.style.display = 'block'; }} // Keep visible after playing
              style={{ maxHeight: '400px' }}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="mb-12">
        <h3 className="text-4xl font-bold text-gray-900 text-center mb-10">Our Product Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <div
              key={category.name}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center transform hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-200 hover:border-blue-400"
              onClick={() => navigateTo('category', category.name)}
            >
              <div className="text-blue-600 mb-4">{category.icon}</div>
              <h4 className="text-2xl font-semibold text-gray-800 mb-2">{category.name}</h4>
              <p className="text-gray-600 text-base">{category.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action for Signup */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-3xl p-8 md:p-12 text-center shadow-xl">
        <h3 className="text-4xl font-bold mb-4">Stay Connected with Titan</h3>
        <p className="text-xl mb-6">Sign up for exclusive offers and the latest news!</p>
        <button
          onClick={() => navigateTo('signup')}
          className="bg-white text-purple-700 px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300"
        >
          Sign Up Now!
        </button>
      </section>
    </div>
  );
};

// --- Category Page Component ---
const CategoryPage = ({ categoryName, navigateTo }) => {
  const filteredProducts = products.filter(product => product.category === categoryName);

  useEffect(() => {
    // Use centralized page tracking to prevent duplicates
    trackPage('Category Page', { category: categoryName });
  }, [categoryName]);

  const getPriceDisplay = (product) => {
    if (product.isCustom) {
      return 'TBD';
    }
    if (product.hasSizes && product.sizes) {
      const prices = product.sizes.map(size => size.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      if (minPrice === maxPrice) {
        return `$${minPrice.toFixed(2)}`;
      } else {
        return `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;
      }
    }
    return `$${product.price.toFixed(2)}`;
  };

  return (
    <div className="p-6">
      <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">{categoryName}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map(product => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-200 hover:border-blue-400"
            onClick={() => navigateTo('product', product.id)}
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 object-cover"
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x300/F0F9FF/000?text=Image+Not+Found'; }}
            />
            <div className="p-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
              <p className="text-blue-600 text-2xl font-bold">{getPriceDisplay(product)}</p>
              {product.subscription && (
                <span className="text-sm text-purple-600 font-medium mt-2 block">Monthly Subscription</span>
              )}
              {product.hasSizes && (
                <span className="text-sm text-green-600 font-medium mt-2 block">
                  {product.id === 'power-cap' ? 'Available in 2 options' : 'Available in 3 sizes'}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <button
          onClick={() => navigateTo('home')}
          className="bg-gray-700 text-white px-6 py-3 rounded-full text-lg font-medium hover:bg-gray-800 transition-colors duration-300"
        >
          Back to All Categories
        </button>
      </div>
    </div>
  );
};

// --- Product Page Component ---
const ProductPage = ({ productId, navigateTo, addToCart }) => {
  const product = products.find(p => p.id === productId);
  const [showAddedToCartMessage, setShowAddedToCartMessage] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    if (product) {
      // Use centralized page tracking to prevent duplicates
      trackPage('Product Page', {
        productId: product.id,
        productName: product.name,
        category: product.category,
        price: product.price,
      });

      // Use centralized event tracking to prevent duplicates
      trackEvent('Product Viewed', {
        productId: product.id,
        productName: product.name,
        category: product.category,
        price: product.price,
      });

      // Set default size if product has sizes
      if (product.hasSizes && product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
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

    // If product has sizes, include the selected size info
    if (product.hasSizes && selectedSize) {
      productToAdd = {
        ...product,
        id: `${product.id}-${selectedSize.id}`, // Unique ID for size variant
        name: `${product.name} (${selectedSize.name})`,
        price: selectedSize.price,
        selectedSize: selectedSize
      };
    }

    addToCart(productToAdd);

    // Use centralized event tracking to prevent duplicates
    trackEvent('Product Added', {
      productId: productToAdd.id,
      productName: productToAdd.name,
      category: product.category,
      price: productToAdd.price,
      quantity: 1,
      ...(selectedSize && { size: selectedSize.name })
    });

    setShowAddedToCartMessage(true);
    // Optionally hide the message after a few seconds
    setTimeout(() => setShowAddedToCartMessage(false), 5000);
  };

  const currentPrice = product.hasSizes && selectedSize ? selectedSize.price : product.price;
  const canAddToCart = !product.hasSizes || selectedSize;

  return (
    <div className="p-6">
      <div className="bg-white rounded-3xl shadow-xl p-8 flex flex-col md:flex-row items-center gap-10">
        <div className="md:w-1/2 flex justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="rounded-2xl shadow-lg max-w-full h-auto object-cover"
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x450/F0F9FF/000?text=Image+Not+Found'; }}
          />
        </div>
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h2>
          <p className="text-gray-700 text-lg mb-6">{product.description}</p>
          {product.isCustom ? (
            <p className="text-blue-600 text-5xl font-extrabold mb-6">TBD</p>
          ) : (
            <p className="text-blue-600 text-5xl font-extrabold mb-6">${currentPrice.toFixed(2)}</p>
          )}
          {product.subscription && (
            <p className="text-purple-600 text-lg font-semibold mb-6">Monthly Subscription</p>
          )}

          {/* Size Selection for Apparel */}
          {product.hasSizes && product.sizes && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {product.id === 'power-cap' ? 'Select Option:' : 'Select Size:'}
              </h3>
              <div className={`grid gap-3 ${product.id === 'power-cap' ? 'grid-cols-1' : 'grid-cols-3'}`}>
                {product.sizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size)}
                    className={`p-3 rounded-xl border-2 transition-all duration-300 ${selectedSize?.id === size.id
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                      } ${product.id === 'power-cap' && size.id === 'NEURALINK' ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-300 hover:border-purple-400' : ''}`}
                  >
                    <div className="font-semibold">{size.name}</div>
                    <div className={`text-sm ${size.id === 'NEURALINK' ? 'text-purple-600 font-bold' : 'text-gray-600'}`}>
                      ${size.price.toFixed(2)}
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
              className="px-8 py-4 rounded-full text-xl font-semibold shadow-lg transform transition-all duration-300 flex items-center justify-center gap-3 mx-auto md:mx-0 bg-purple-600 text-white hover:bg-purple-700 hover:scale-105"
            >
              <Box size={24} /> Configure Custom Robot
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={!canAddToCart}
              className={`px-8 py-4 rounded-full text-xl font-semibold shadow-lg transform transition-all duration-300 flex items-center justify-center gap-3 mx-auto md:mx-0 ${canAddToCart
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
              <ShoppingCart size={24} /> Add to Cart
            </button>
          )}

          {!canAddToCart && product.hasSizes && !product.isCustom && (
            <p className="text-red-500 text-sm mt-2 text-center md:text-left">
              {product.id === 'power-cap' ? 'Please select an option first' : 'Please select a size first'}
            </p>
          )}

          {showAddedToCartMessage && !product.isCustom && (
            <div className="mt-6 p-5 bg-green-100 text-green-800 rounded-xl shadow-lg border border-green-200">
              <p className="font-bold text-xl mb-4 text-center">Product added to cart!</p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => navigateTo('cart')}
                  className="bg-blue-600 text-white px-5 py-3 rounded-full hover:bg-blue-700 transition-colors duration-300 text-base font-semibold shadow-md"
                >
                  View Cart
                </button>
                <button
                  onClick={() => navigateTo('category', product.category)}
                  className="bg-gray-700 text-white px-5 py-3 rounded-full hover:bg-gray-800 transition-colors duration-300 text-base font-semibold shadow-md"
                >
                  Back to {product.category}
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => navigateTo('category', product.category)}
            className="mt-4 bg-gray-200 text-gray-800 px-6 py-3 rounded-full text-lg font-medium hover:bg-gray-300 transition-colors duration-300 mx-auto md:mx-0 block"
          >
            Back to {product.category}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Cart Page Component ---
const CartPage = ({ cart, updateCartQuantity, removeFromCart, navigateTo }) => {
  useEffect(() => {
    // Use centralized page tracking to prevent duplicates
    trackPage('Cart Page', { cartItems: cart.length });
  }, [cart]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
            {cart.map(item => (
              <div key={item.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 sm:py-6 gap-3 sm:gap-4">
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover rounded-lg shadow-md flex-shrink-0"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/F0F9FF/000?text=Image'; }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 leading-tight mb-1">{item.name}</h3>
                    <p className="text-sm sm:text-base text-gray-600 font-medium">${item.price.toFixed(2)}</p>
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
                    <p className="text-base sm:text-lg font-bold text-gray-800 min-w-fit">${(item.price * item.quantity).toFixed(2)}</p>
                    <button
                      onClick={() => {
                        removeFromCart(item.id);
                        // Use centralized event tracking to prevent duplicates
                        trackEvent('Product Removed', {
                          productId: item.id,
                          productName: item.name,
                          price: item.price,
                          quantity: item.quantity,
                        });
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
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Total: ${total.toFixed(2)}</p>
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
};

// --- Checkout Page Component (New) ---
const CheckoutPage = ({ cart, navigateTo, completeOrder }) => {
  useEffect(() => {
    // Use centralized page tracking to prevent duplicates
    trackPage('Checkout Page', { cartItems: cart.length });
  }, [cart]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="p-6">
      <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Confirm Your Order</h2>
      {cart.length === 0 ? (
        <div className="text-center text-gray-600 text-xl p-10 bg-white rounded-xl shadow-md">
          <p className="mb-6">Your cart is empty.</p>
          <button
            onClick={() => navigateTo('home')}
            className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300"
          >
            Start shopping!
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full mx-auto">
          <div className="divide-y divide-gray-200 mb-6">
            {cart.map(item => (
              <div key={item.id} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md shadow-sm"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/80x80/F0F9FF/000?text=Image'; }}
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-end items-center mt-8 pt-6 border-t border-gray-200">
            <p className="text-3xl font-bold text-gray-900 mr-6">Total: ${total.toFixed(2)}</p>
            <button
              onClick={() => completeOrder(cart, total)} // Call completeOrder function
              className="bg-blue-600 text-white px-8 py-4 rounded-full text-xl font-semibold shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300"
            >
              Buy Now
            </button>
          </div>
          <button
            onClick={() => navigateTo('cart')}
            className="mt-4 bg-gray-200 text-gray-800 px-6 py-3 rounded-full text-lg font-medium hover:bg-gray-300 transition-colors duration-300 block mx-auto"
          >
            Back to Cart
          </button>
        </div>
      )}
    </div>
  );
};

// --- Order Confirmation Page Component (New) ---
const OrderConfirmationPage = ({ navigateTo, clearCart }) => {
  // Use a ref to ensure clearCart is called only once
  const hasClearedCart = React.useRef(false);

  useEffect(() => {
    // Use centralized page tracking to prevent duplicates
    trackPage('Order Confirmation Page');

    // Clear cart only if it hasn't been cleared yet in this component's lifecycle
    if (!hasClearedCart.current) {
      clearCart();
      hasClearedCart.current = true;
    }
  }, [clearCart]); // clearCart is now a stable reference due to useCallback in App

  const handleRefreshDemo = () => {
    navigateTo('home'); // Navigate back to home
  };

  return (
    <div className="p-6">
      <div className="text-center bg-white rounded-xl shadow-md p-10">
        <h3 className="text-3xl font-bold text-green-700 mb-4">Titan thanks you for your order!</h3>
        <p className="text-lg text-gray-700 mb-6">Your order has been successfully placed.</p>
        <button
          onClick={handleRefreshDemo}
          className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300"
        >
          Click here to refresh demo
        </button>
      </div>
    </div>
  );
};

// --- Signup Form Component ---
const SignupForm = ({ navigateTo }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Use centralized page tracking to prevent duplicates
    trackPage('Signup Page');
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const userId = `guest-${Date.now()}`; // placeholder user ID for demo purposes
    const traits = {};
    if (email) traits.email = email;
    if (phone) traits.phone = phone;

    if (window.analytics) {
      console.group(`👤 Segment Identify User: ${userId}`);
      console.log('🏷️ User Traits:', JSON.stringify(traits, null, 2));
      console.groupEnd();
      window.analytics.identify(userId, traits);
    }

    const signUpProperties = {
      source: 'Signup Form',
      ...traits // Include email/phone in the event properties or remove and just use traits in context
    };

    // Use centralized event tracking to prevent duplicates
    // Pass traits in context for additional user information
    trackEvent('Signed Up', signUpProperties, {
      context: {
        traits: traits
      }
    });

    console.log('Sign Up Event Triggered:', {
      properties: signUpProperties,
      context: { traits: traits }
    });

    setMessage('Thank you for signing up! Check your console for Segment identify and track calls.');
    setEmail('');
    setPhone('');
  };

  return (
    <div className="p-6">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl shadow-xl p-8 md:p-12 w-full mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">Sign Up for Exclusive Offers</h2>
        <p className="text-lg text-gray-700 mb-8 text-center">
          Get the latest news, updates, and special discounts on Titan robots and accessories delivered straight to your inbox or phone!
        </p>
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="lg:w-1/2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-left text-gray-700 text-lg font-medium mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    id="email"
                    className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-lg"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="block text-left text-gray-700 text-lg font-medium mb-2">Phone Number (for SMS)</label>
                <div className="relative">
                  <BellRing className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="tel"
                    id="phone"
                    className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-lg"
                    placeholder="(123) 456-7890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-full text-xl font-semibold shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300"
              >
                Subscribe
              </button>
            </form>
            {message && (
              <p className="mt-6 text-green-700 font-semibold text-lg">{message}</p>
            )}
            <button
              onClick={() => navigateTo('home')}
              className="mt-8 bg-gray-200 text-gray-800 px-6 py-3 rounded-full text-lg font-medium hover:bg-gray-300 transition-colors duration-300"
            >
              Back to Home
            </button>
          </div>
          <div className="lg:w-1/2 flex justify-center">
            <img
              src="/assets/TitanOffer.png"
              alt="Titan Robot Special Offer"
              className="rounded-2xl shadow-2xl max-w-full h-auto"
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/500x400/D1E9FF/000?text=Titan+Offer'; }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Custom Robot Form Component ---
const CustomFormPage = ({ navigateTo }) => {
  const [formData, setFormData] = useState({
    customization1: '',
    customization2: '',
    customization3: '',
    customization4: '',
    customization5: '',
    timeframe: '',
    capabilities: '',
    referralCode: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: 'US',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    trackPage('Custom Robot Form');
  }, []);

  const customizationOptions = [
    {
      id: 'customization1',
      label: 'AI Intelligence Level',
      options: [
        { text: 'Basic Voice Commands', score: 2 },
        { text: 'Advanced Natural Language Processing', score: 4 },
        { text: 'Machine Learning Capabilities', score: 6 },
        { text: 'Full Autonomous Decision Making', score: 8 },
        { text: 'Experimental Neural Network Integration', score: 10 }
      ]
    },
    {
      id: 'customization2',
      label: 'Mobility & Navigation',
      options: [
        { text: 'Stationary Desktop Unit', score: 2 },
        { text: 'Basic Wheeled Movement', score: 4 },
        { text: 'Advanced Room Navigation', score: 6 },
        { text: 'Multi-Floor Stair Climbing', score: 8 },
        { text: 'Outdoor Terrain Traversal', score: 10 }
      ]
    },
    {
      id: 'customization3',
      label: 'Interaction Capabilities',
      options: [
        { text: 'Simple LED Display', score: 2 },
        { text: 'Touch Screen Interface', score: 4 },
        { text: 'Gesture Recognition', score: 6 },
        { text: 'Facial Recognition & Emotion Detection', score: 8 },
        { text: 'Holographic Projection Display', score: 10 }
      ]
    },
    {
      id: 'customization4',
      label: 'Physical Manipulation',
      options: [
        { text: 'No Physical Interaction', score: 2 },
        { text: 'Basic Single Arm', score: 4 },
        { text: 'Dual Arm Coordination', score: 6 },
        { text: 'Precision Tool Manipulation', score: 8 },
        { text: 'Advanced Dexterous Multi-Tool System', score: 10 }
      ]
    },
    {
      id: 'customization5',
      label: 'Specialized Functions',
      options: [
        { text: 'Home Security Monitoring', score: 2 },
        { text: 'Personal Health Assistant', score: 4 },
        { text: 'Educational Tutor & Learning Companion', score: 6 },
        { text: 'Professional Workshop Assistant', score: 8 },
        { text: 'Research & Development Partner', score: 10 }
      ]
    }
  ];

  const timeframeOptions = [
    { text: 'Ready Today', score: 10 },
    { text: 'Within 2 weeks', score: 8 },
    { text: 'Within 1 Month', score: 6 },
    { text: 'Within 1 Year', score: 2 }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Calculate scores for each customization option
    const getOptionScore = (optionId, selectedText) => {
      const optionGroup = customizationOptions.find(opt => opt.id === optionId);
      if (optionGroup) {
        const selectedOption = optionGroup.options.find(opt => opt.text === selectedText);
        return selectedOption ? selectedOption.score : 0;
      }
      return 0;
    };

    const getTimeframeScore = (selectedTimeframe) => {
      const timeframe = timeframeOptions.find(tf => tf.text === selectedTimeframe);
      return timeframe ? timeframe.score : 0;
    };

    // Calculate individual scores
    const scores = {
      aiLevel: getOptionScore('customization1', formData.customization1),
      mobility: getOptionScore('customization2', formData.customization2),
      interaction: getOptionScore('customization3', formData.customization3),
      manipulation: getOptionScore('customization4', formData.customization4),
      specialization: getOptionScore('customization5', formData.customization5),
      timeframe: getTimeframeScore(formData.timeframe)
    };

    // Calculate total complexity score
    const totalComplexityScore = Object.values(scores).reduce((sum, score) => sum + score, 0);

    // Track form submission
    trackEvent('Form Submitted', {
      formType: 'Custom Robot Configuration',
      customizations: {
        aiLevel: formData.customization1,
        mobility: formData.customization2,
        interaction: formData.customization3,
        manipulation: formData.customization4,
        specialization: formData.customization5,
      },
      // Internal scoring (not visible to customer)
      complexityScores: scores,
      totalComplexityScore: totalComplexityScore,
      complexityLevel: totalComplexityScore >= 40 ? 'Very High' :
        totalComplexityScore >= 30 ? 'High' :
          totalComplexityScore >= 20 ? 'Medium' :
            totalComplexityScore >= 10 ? 'Low' : 'Very Low',
      timeframe: formData.timeframe,
      capabilities: formData.capabilities,
      referralCode: formData.referralCode,
      country: formData.country,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      contactMethods: {
        email: !!formData.email,
        phone: !!formData.phone
      }
    });

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-2xl mx-auto text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h2>
            <p className="text-lg text-gray-700 mb-6">
              Your custom robot configuration has been submitted. Our engineering team will review your requirements and contact you with a detailed proposal and timeline.
            </p>
            <p className="text-sm text-gray-600 mb-8">
              We'll be in touch within 1-2 business days to discuss your custom Titan robot.
            </p>
            <button
              onClick={() => navigateTo('home')}
              className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-2 text-center">Configure Your Custom Titan Robot</h2>
        <p className="text-lg text-gray-600 mb-8 text-center">
          Tell us about your ideal robot companion and we'll build it specifically for you.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Customization Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {customizationOptions.map((option) => (
              <div key={option.id} className="space-y-3">
                <label className="block text-lg font-semibold text-gray-800">
                  {option.label}
                </label>
                <select
                  value={formData[option.id]}
                  onChange={(e) => handleInputChange(option.id, e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  style={{
                    color: '#111827',
                    backgroundColor: 'white',
                    fontSize: '16px',
                    fontWeight: '400'
                  }}
                  required
                >
                  <option value="">Select {option.label}</option>
                  {option.options.map((opt, index) => (
                    <option
                      key={index}
                      value={opt.text}
                      style={{
                        color: '#111827',
                        backgroundColor: 'white',
                        fontSize: '16px',
                        padding: '8px'
                      }}
                    >
                      {opt.text}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {/* Timeframe */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-3">
              When do you need this completed?
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {timeframeOptions.map((timeframe) => (
                <button
                  key={timeframe.text}
                  type="button"
                  onClick={() => handleInputChange('timeframe', timeframe.text)}
                  className={`p-3 rounded-xl border-2 transition-all duration-300 ${formData.timeframe === timeframe.text
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                    }`}
                >
                  {timeframe.text}
                </button>
              ))}
            </div>
          </div>

          {/* Capabilities Description */}
          <div>
            <label htmlFor="capabilities" className="block text-lg font-semibold text-gray-800 mb-3">
              Describe Capabilities
            </label>
            <p className="text-sm text-gray-600 mb-3">
              Providing details here helps us with an estimate
            </p>
            <textarea
              id="capabilities"
              value={formData.capabilities}
              onChange={(e) => handleInputChange('capabilities', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 h-32 resize-vertical bg-white text-gray-900"
              style={{
                color: '#111827',
                backgroundColor: 'white',
                fontSize: '16px',
                fontWeight: '400'
              }}
              placeholder="Tell us about specific tasks, environments, or capabilities you need your custom robot to handle..."
              required
            />
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-lg font-semibold text-gray-800 mb-3">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                style={{
                  color: '#111827',
                  backgroundColor: 'white',
                  fontSize: '16px',
                  fontWeight: '400'
                }}
                placeholder="John"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-lg font-semibold text-gray-800 mb-3">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                style={{
                  color: '#111827',
                  backgroundColor: 'white',
                  fontSize: '16px',
                  fontWeight: '400'
                }}
                placeholder="Smith"
                required
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="email" className="block text-lg font-semibold text-gray-800 mb-3">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                style={{
                  color: '#111827',
                  backgroundColor: 'white',
                  fontSize: '16px',
                  fontWeight: '400'
                }}
                placeholder="your.email@example.com"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-lg font-semibold text-gray-800 mb-3">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                style={{
                  color: '#111827',
                  backgroundColor: 'white',
                  fontSize: '16px',
                  fontWeight: '400'
                }}
                placeholder="(123) 456-7890"
                required
              />
            </div>
          </div>

          {/* Country and Referral Code */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="country" className="block text-lg font-semibold text-gray-800 mb-3">
                Country
              </label>
              <select
                id="country"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                style={{
                  color: '#111827',
                  backgroundColor: 'white',
                  fontSize: '16px',
                  fontWeight: '400'
                }}
                required
              >
                <option
                  value="US"
                  style={{
                    color: '#111827',
                    backgroundColor: 'white',
                    fontSize: '16px',
                    padding: '8px'
                  }}
                >
                  United States
                </option>
                <option
                  value="OTHER"
                  style={{
                    color: '#111827',
                    backgroundColor: 'white',
                    fontSize: '16px',
                    padding: '8px'
                  }}
                >
                  Other Country
                </option>
              </select>
            </div>
            <div>
              <label htmlFor="referralCode" className="block text-lg font-semibold text-gray-800 mb-3">
                Referral Code
              </label>
              <input
                type="text"
                id="referralCode"
                value={formData.referralCode}
                onChange={(e) => handleInputChange('referralCode', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                style={{
                  color: '#111827',
                  backgroundColor: 'white',
                  fontSize: '16px',
                  fontWeight: '400'
                }}
                placeholder="Optional referral code"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center pt-6">
            <button
              type="submit"
              className="bg-purple-600 text-white px-12 py-4 rounded-full text-xl font-semibold shadow-lg hover:bg-purple-700 transform hover:scale-105 transition-all duration-300"
            >
              Submit Custom Robot Request
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigateTo('category', 'Models')}
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-full text-lg font-medium hover:bg-gray-300 transition-colors duration-300"
          >
            Back to Models
          </button>
        </div>
      </div>
    </div>
  );
};


// --- Main App Component ---
const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [cart, setCart] = useState([]); // { id, name, price, quantity, image }

  // Effect to inject the Segment snippet once when the App mounts
  useEffect(() => {
    initializeSegment();
  }, []);

  // Use useCallback to memoize navigateTo and clearCart functions
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
    window.scrollTo(0, 0); // Scroll to top on page change
  }, []); // Empty dependency array means this function is created once

  const clearCart = useCallback(() => {
    setCart([]);
  }, []); // Empty dependency array means this function is created once

  // Add item to cart or update quantity if already exists
  const addToCart = (productToAdd) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === productToAdd.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === productToAdd.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...productToAdd, quantity: 1 }];
      }
    });
  };

  // Update quantity of an item in cart
  const updateCartQuantity = (productId, newQuantity) => {
    setCart(prevCart => {
      const currentItem = prevCart.find(item => item.id === productId);

      if (newQuantity <= 0) {
        return prevCart.filter(item => item.id !== productId);
      }

      // If quantity is being increased, track a "Product Added" event
      if (currentItem && newQuantity > currentItem.quantity) {
        // Use centralized event tracking to prevent duplicates
        trackEvent('Product Added', {
          productId: currentItem.id,
          productName: currentItem.name,
          category: currentItem.category || 'Unknown',
          price: currentItem.price,
          quantity: 1, // Track as adding 1 more item
          source: 'Cart Quantity Update'
        });
      }

      // If quantity is being decreased, track a "Product Removed" event
      if (currentItem && newQuantity < currentItem.quantity) {
        // Use centralized event tracking to prevent duplicates
        trackEvent('Product Removed', {
          productId: currentItem.id,
          productName: currentItem.name,
          category: currentItem.category || 'Unknown',
          price: currentItem.price,
          quantity: 1, // Track as removing 1 item
          source: 'Cart Quantity Update',
          previousQuantity: currentItem.quantity,
          newQuantity: newQuantity
        });
      }

      return prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      );
    });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  // Function to complete the order, track event, and navigate to confirmation
  const completeOrder = (currentCart, orderTotal) => {
    // Use centralized event tracking to prevent duplicates
    trackEvent('Order Completed', {
      orderId: `ORD-${Date.now()}`, // Simulate an ID
      total: orderTotal,
      products: currentCart.map(item => ({
        productId: item.id,
        productName: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    });
    navigateTo('orderConfirmation'); // Navigate to the final confirmation page
  };

  // Render the current page based on state
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage navigateTo={navigateTo} />;
      case 'category':
        return <CategoryPage categoryName={currentCategory} navigateTo={navigateTo} />;
      case 'product':
        return <ProductPage productId={currentProductId} navigateTo={navigateTo} addToCart={addToCart} />;
      case 'cart':
        return <CartPage cart={cart} updateCartQuantity={updateCartQuantity} removeFromCart={removeFromCart} navigateTo={navigateTo} />;
      case 'checkout':
        return <CheckoutPage cart={cart} navigateTo={navigateTo} completeOrder={completeOrder} />;
      case 'orderConfirmation':
        return <OrderConfirmationPage navigateTo={navigateTo} clearCart={clearCart} />;
      case 'signup':
        return <SignupForm navigateTo={navigateTo} />;
      case 'customForm':
        return <CustomFormPage navigateTo={navigateTo} />;
      default:
        return <HomePage navigateTo={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-inter text-gray-800">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
          body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 0;
          }
          * {
            box-sizing: border-box;
          }
          /* Custom select styling to ensure visibility */
          select {
            color: #111827 !important;
            background-color: white !important;
            font-size: 16px !important;
            font-weight: 400 !important;
          }
          select option {
            color: #111827 !important;
            background-color: white !important;
            font-size: 16px !important;
            padding: 8px !important;
            font-weight: 400 !important;
          }
          select:focus {
            outline: none;
            border-color: #3b82f6 !important;
          }
          /* Custom input and textarea styling to ensure visibility */
          input[type="text"], input[type="email"], input[type="tel"], textarea {
            color: #111827 !important;
            background-color: white !important;
            font-size: 16px !important;
            font-weight: 400 !important;
          }
          input[type="text"]:focus, input[type="email"]:focus, input[type="tel"]:focus, textarea:focus {
            outline: none;
            border-color: #3b82f6 !important;
            color: #111827 !important;
            background-color: white !important;
          }
          input[type="text"]::placeholder, input[type="email"]::placeholder, input[type="tel"]::placeholder, textarea::placeholder {
            color: #9ca3af !important;
            opacity: 1 !important;
          }
        `}
      </style>
      <Header navigateTo={navigateTo} cartItemCount={cart.reduce((count, item) => count + item.quantity, 0)} />
      <main className={`w-full ${currentPage === 'cart' ? '' : 'py-8'}`}>
        {renderPage()}
      </main>
      <footer className="bg-gray-800 text-white p-6 text-center mt-12">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} Titan AI Robotics. All rights reserved.</p>
          <p className="text-sm mt-2">
            This is a demo site includes Segment.io integration. All Segment calls are logged to the console.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
