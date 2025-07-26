# 🚀 Segment Modern E-commerce - Complete Setup Guide

This comprehensive guide will walk you through setting up the Segment Modern E-commerce demo from scratch, including all dependencies and configuration options.

## � Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 9.0.0 or higher (comes with Node.js)
- **Git**: For cloning the repository
- **Code Editor**: VS Code, WebStorm, or your preferred editor

### Verify Installation

```bash
node --version  # Should be 18.0.0 or higher
npm --version   # Should be 9.0.0 or higher
git --version   # Any recent version
```

## 🏗️ Project Setup Options

### Option 1: Clone Existing Repository (Recommended)

```bash
# Clone the repository
git clone https://github.com/your-username/segment-modern-ecommerce.git
cd segment-modern-ecommerce

# Install dependencies
npm install

# Start development server
npm run dev
```

### Option 2: Build from Scratch

If you want to understand how the project was built, follow these steps:

#### Step 1: Initialize Vite React Project

```bash
# Create new project with Vite
npm create vite@latest segment-modern-ecommerce -- --template react
cd segment-modern-ecommerce
npm install
```

#### Step 2: Install Tailwind CSS

```bash
# Install Tailwind CSS and dependencies
npm install -D tailwindcss@^3 postcss autoprefixer
npx tailwindcss init -p
```

Update `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

#### Step 3: Install Additional Dependencies

```bash
# Install Lucide React for icons
npm install lucide-react
```

## 🛠️ Development Commands

```bash
# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint for code quality
npm run lint
```

## 🔧 Configuration Options

### Segment Analytics Setup

1. **Get Segment Write Key**
   - Sign up at [Segment.com](https://segment.com)
   - Create a new source (Website)
   - Copy your write key

2. **Update Configuration**

In `src/App.jsx` at **line 77**, find this constant and replace with your key:

```javascript
const writeKey = "YOUR_SEGMENT_WRITE_KEY_HERE"; // Replace with your actual Segment write key
```

That's it! The Segment integration is already fully configured - you only need to update this single line with your write key.

### Environment Variables (Optional)

Create `.env` file in project root:

```env
VITE_SEGMENT_WRITE_KEY=your_segment_write_key
VITE_API_URL=https://your-api.com
VITE_APP_TITLE=Segment Modern E-commerce
```

## 🚀 Deployment Options

### Option 1: Netlify (Recommended)

1. Build the project: `npm run build`
2. Drag the `dist` folder to Netlify Deploy
3. Or connect your GitHub repository for auto-deployment

### Option 2: Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### Option 3: GitHub Pages

1. Install gh-pages: `npm install -D gh-pages`
2. Add to package.json scripts:
   ```json
   "deploy": "gh-pages -d dist"
   ```
3. Run: `npm run build && npm run deploy`

## 🐛 Troubleshooting

### Common Issues

**Issue**: Development server won't start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue**: Tailwind styles not working
```bash
# Ensure Tailwind is properly configured
npm run build
# Check if build includes CSS
```

**Issue**: Build fails
```bash
# Check for ESLint errors
npm run lint
# Fix any reported issues
```

---

**Happy coding! 🚀**

Next, configure your `tailwind.config.js` file:

```javascript
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif']
      },
    },
  },
  plugins: [],
};
```

### 3. Configure Base Styles

Add the Tailwind directives to your main CSS file, located at `src/index.css` (or `src/App.css`).

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-white text-gray-900 overflow-x-hidden;
}
```

### 4. Install Lucide Icons

This project uses `lucide-react` for icons.

```sh
npm install lucide-react
```

### 5. Start the Development Server

Once everything is set up, you can start the local development server.

```sh
npm run dev
```

The application will be available at `http://localhost:5173`.

## 🧠 Segment Integration

The application comes with Segment analytics **already integrated and configured**. You have two options for tracking:

### Option 1: Development/Demo Mode (Default)

By default, the application includes a placeholder write key (`<YOUR_SEGMENT_WRITE_KEY>`) that will safely log all analytics calls to the console without sending data to Segment. This is perfect for:
- Development and testing
- Demo environments  
- Learning how the integration works

### Option 2: Live Segment Tracking

To enable real Segment tracking with your workspace:

1. **Update the Write Key**
   - Open `src/App.jsx`
   - Go to **line 77**
   - Replace the placeholder with your actual Segment write key:

   ```javascript
   const writeKey = "your_actual_segment_write_key_here";
   ```

2. **That's it!** 
   The Segment snippet is already embedded and will automatically start sending data to your workspace.

**No additional configuration needed** - the application handles:
- Automatic Segment snippet injection
- Duplicate call prevention
- Proper event tracking with context support

## 📦 Segment Events

This application tracks the following events:

- `analytics.page()`: Fired on every page load and view.
- `analytics.track()`: Used for specific user actions, including:
    - `Product Viewed`
    - `Product Added`
    - `Product Removed`
    - `Order Completed`
    - `Signed Up`
- `analytics.identify()`: Called when a user submits their information, such as through an email/SMS signup form.
