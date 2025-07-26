# 🤖 Segment Modern E-commerce - Titan AI Robotics Demo

![Titan AI Robotics](https://img.shields.io/badge/React-19.1.0-blue)
![Vite](https://img.shields.io/badge/Vite-7.0.6-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-blueviolet)
![License](https://img.shields.io/badge/license-MIT-green)

A modern, responsive e-commerce platform showcasing Titan AI Robotics products with integrated analytics tracking. Built with React, Vite, and Tailwind CSS, featuring a complete shopping experience with Segment analytics integration.

## ✨ Features

### 🛍️ E-commerce Functionality
- **Product Catalog**: Browse AI robots, accessories, subscription modules, and apparel
- **Product Details**: Detailed product pages with specifications and pricing
- **Shopping Cart**: Full cart management with quantity updates and item removal
- **Checkout Process**: Complete order workflow with confirmation
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### 📊 Analytics & Tracking
- **Segment Integration**: Track user interactions, page views, and conversions
- **Event Tracking**: Product views, cart additions, purchases, and user signups
- **User Identification**: Capture user data for personalized experiences

### 🎨 Modern UI/UX
- **Full-Width Design**: Immersive shopping experience using entire browser width
- **Tailwind CSS**: Utility-first styling with responsive breakpoints
- **Lucide Icons**: Beautiful, consistent iconography
- **Smooth Animations**: Engaging hover effects and transitions

## 🚀 Live Demo

Visit the live demo: [Segment Modern E-commerce Demo](coming soon)

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.1.0 | Frontend framework |
| **Vite** | 7.0.6 | Build tool and dev server |
| **Tailwind CSS** | 3.4.17 | Utility-first CSS framework |
| **Lucide React** | 0.525.0 | Icon library |
| **ESLint** | 9.30.1 | Code linting |

## 📦 Installation

### Prerequisites
- Node.js 18.0.0 or higher
- npm 9.0.0 or higher

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/segment-modern-ecommerce.git
   cd segment-modern-ecommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

## 🏗️ Build Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📱 Product Categories

### 🤖 Models
- **Titan Pint** ($499.99) - Compact desktop AI companion
- **Titan Power** ($1,299.99) - Mobile AI robot for home navigation

### 🔧 Accessories  
- Rapid Charging Dock ($79.99)
- Privacy Shield ($29.99)
- Rugged Travel Case ($59.99)
- Enhanced Voice Module ($49.99)

### 📡 Subscription Modules
- Home Security Module ($9.99/month)
- Smart Learning Module ($14.99/month)
- Wellness Assistant Module ($12.99/month)
- Developer API Module ($19.99/month)

### 👕 Apparel
- Titan Pint T-Shirt ($24.99)
- Titan Pint Hoodie ($49.99)
- Titan Power Cap ($19.99)
- Titan Power Jacket ($79.99)

## 🔧 Configuration

### Segment Analytics Setup

To enable analytics tracking with your own Segment workspace, simply update the write key constant at **line 77** in `src/App.jsx`:

```javascript
const writeKey = "YOUR_SEGMENT_WRITE_KEY_HERE"; // Replace with your actual Segment write key
```

The application comes with Segment integration already configured - you only need to replace the placeholder write key with your actual key from your Segment workspace.

### Environment Variables

Create a `.env` file for environment-specific configuration:

```env
VITE_SEGMENT_WRITE_KEY=your_segment_write_key
VITE_API_URL=your_api_endpoint
```

## 📂 Project Structure

```
segment-modern-ecommerce/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── App.jsx          # Main application component
│   ├── App.css          # Custom styles (minimal)
│   ├── index.css        # Global styles + Tailwind
│   └── main.jsx         # Application entry point
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── tailwind.config.js   # Tailwind configuration
├── vite.config.js       # Vite configuration
└── README.md
```

## 🎯 Key Features Implementation

### Full-Width Shopping Cart
The cart page utilizes the entire browser width for an immersive shopping experience:
- Removed flexbox centering constraints
- Used `w-screen` for true viewport width
- Optimized for all screen sizes

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Responsive grid layouts for product catalogs
- Adaptive navigation and UI components

### Analytics Tracking
- Page view tracking for all routes
- Product interaction events
- Cart and checkout conversion tracking
- User signup and identification

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) for the frontend framework
- [Vite](https://vitejs.dev/) for the blazing fast build tool
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Lucide](https://lucide.dev/) for the beautiful icons
- [Segment](https://segment.com/) for analytics infrastructure

---

**Built with ❤️ for the future of AI robotics**

   Your application will be available at `http://localhost:5173`.

For detailed setup instructions, including Segment integration, please see [SETUP.md](SETUP.md).
