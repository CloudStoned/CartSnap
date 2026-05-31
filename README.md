# CartSnap

CartSnap is a smart, real-time web-based grocery scanner and budget tracker. Using your camera or device gallery, CartSnap reads item labels and price tags, extracts the product details via the Gemini Vision API, and tracks your basket totals in real time against your personal budget limits.

## Key Features

- **Real-Time OCR Scanner**: Take a photo of an item and its price tag to extract info instantly.
- **Budget Tracking**: Set a currency preference and budget cap to monitor subtotal limits as you shop.
- **Dynamic Diagnostics**: Telemetry system logs monitor state machine signals and audio feedback.

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Configure your API Key**:
   Create a `.env` or `.env.local` file and add:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
3. **Run the development server**:
   ```bash
   npm run dev
   ```
