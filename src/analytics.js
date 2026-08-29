import { AnalyticsBrowser } from '@segment/analytics-next';

// Paste a write key here for a live demo, or set VITE_SEGMENT_WRITE_KEY in .env.
// Events are always logged to the console. A real key also sends them to Segment.
const WRITE_KEY = String(
  import.meta.env.VITE_SEGMENT_WRITE_KEY || 'YOUR_SEGMENT_WRITE_KEY_HERE'
).trim();

const PLACEHOLDER_KEYS = new Set([
  '',
  'YOUR_SEGMENT_WRITE_KEY_HERE',
  '<YOUR_SEGMENT_WRITE_KEY>',
]);

export const hasWriteKey = Boolean(WRITE_KEY) && !PLACEHOLDER_KEYS.has(WRITE_KEY);

const GUEST_ID_KEY = 'titan-demo-user-id';

let analyticsClient = null;
let didAnnounceMode = false;
let lastPageCall = null;
const lastTrackCalls = {};

const EVENT_SETTINGS = {
  'Product Added': { allowDuplicates: true, cooldownMs: 500 },
  'Product Removed': { allowDuplicates: true, cooldownMs: 500 },
  'Product Viewed': { allowDuplicates: false, cooldownMs: 5000 },
  'Product Clicked': { allowDuplicates: false, cooldownMs: 1000 },
  'Product List Viewed': { allowDuplicates: false, cooldownMs: 2000 },
  'Cart Viewed': { allowDuplicates: false, cooldownMs: 2000 },
  'Checkout Started': { allowDuplicates: false, cooldownMs: 5000 },
  'Order Completed': { allowDuplicates: false, cooldownMs: 10000 },
  'Signed Up': { allowDuplicates: false, cooldownMs: 10000 },
  'Form Submitted': { allowDuplicates: false, cooldownMs: 5000 },
};

function sendLabel() {
  return hasWriteKey ? 'console (also sent to Segment)' : 'console (not sent)';
}

function getAnalytics() {
  if (!hasWriteKey) return null;
  if (!analyticsClient) {
    analyticsClient = AnalyticsBrowser.load({ writeKey: WRITE_KEY });
  }
  return analyticsClient;
}

export function initializeAnalytics() {
  if (didAnnounceMode) return;
  didAnnounceMode = true;

  if (hasWriteKey) {
    getAnalytics();
    console.log('Segment: events are logged to the console and also sent to your workspace.');
  } else {
    console.log(
      'Segment: events are logged to the console. Paste a write key in src/analytics.js or set VITE_SEGMENT_WRITE_KEY to also send them.'
    );
  }
}

export function getStableUserId(preferredId) {
  if (preferredId) return preferredId;

  try {
    const existing = localStorage.getItem(GUEST_ID_KEY);
    if (existing) return existing;
    const id = `guest-${crypto.randomUUID()}`;
    localStorage.setItem(GUEST_ID_KEY, id);
    return id;
  } catch {
    return `guest-${Date.now()}`;
  }
}

export function toProductProperties(product, extras = {}) {
  const price = typeof product.price === 'number' ? product.price : undefined;
  const imagePath = product.image;

  return {
    product_id: product.id,
    sku: product.id,
    name: product.name,
    category: product.category,
    price,
    currency: 'USD',
    image_url: imagePath && typeof window !== 'undefined'
      ? new URL(imagePath, window.location.origin).href
      : imagePath,
    ...extras,
  };
}

export function toCartProducts(items) {
  return items.map((item) => toProductProperties(item, {
    quantity: item.quantity,
  }));
}

export function trackPage(pageName, properties = {}) {
  const currentCall = `${pageName}-${JSON.stringify(properties)}`;
  if (lastPageCall === currentCall) {
    console.log(`Duplicate page call prevented for: ${pageName}`);
    return;
  }
  lastPageCall = currentCall;

  console.group(`Segment Page Call: ${pageName}`);
  console.log('Page Properties:', JSON.stringify(properties, null, 2));
  console.log('Logged to:', sendLabel());
  console.groupEnd();

  const analytics = getAnalytics();
  if (analytics) {
    analytics.page(pageName, properties);
  }
}

export function trackEvent(eventName, properties = {}, options = {}) {
  const currentCall = `${eventName}-${JSON.stringify(properties)}-${JSON.stringify(options)}`;
  const currentTime = Date.now();
  const setting = EVENT_SETTINGS[eventName] || { allowDuplicates: true, cooldownMs: 1000 };

  if (!lastTrackCalls[eventName]) {
    lastTrackCalls[eventName] = { lastCall: null, lastTime: null };
  }

  const lastEventData = lastTrackCalls[eventName];
  if (
    lastEventData.lastCall === currentCall &&
    lastEventData.lastTime &&
    (currentTime - lastEventData.lastTime) < setting.cooldownMs
  ) {
    console.log(
      `${setting.allowDuplicates ? 'Rapid duplicate' : 'Duplicate'} ${eventName} prevented (cooldown: ${setting.cooldownMs}ms)`
    );
    return;
  }

  lastTrackCalls[eventName] = {
    lastCall: currentCall,
    lastTime: currentTime,
  };

  console.group(`Segment Track Event: ${eventName}`);
  console.log('Event Properties:', JSON.stringify(properties, null, 2));
  if (Object.keys(options).length > 0) {
    console.log('Event Options:', JSON.stringify(options, null, 2));
  }
  console.log('Logged to:', sendLabel());
  console.groupEnd();

  const analytics = getAnalytics();
  if (analytics) {
    analytics.track(eventName, properties, options);
  }
}

export function identifyUser(userId, traits = {}) {
  console.group(`Segment Identify User: ${userId}`);
  console.log('User Traits:', JSON.stringify(traits, null, 2));
  console.log('Logged to:', sendLabel());
  console.groupEnd();

  const analytics = getAnalytics();
  if (analytics) {
    analytics.identify(userId, traits);
  }
}
