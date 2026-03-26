# QR Studio by MCMC Studio

A lightweight, aesthetically pleasing single-page web application for generating, visually customizing, and validating QR codes. Built with React and Vite.

## Features
- **High Customizability:** Easily change the color of the background, QR corners (finder boxes), and inner dots.
- **Logo Integration:** Upload any standard image to place it securely in the middle of your QR code.
- **Auto-Verification:** The app renders the QR code and automatically scans it locally to verify it works, providing you with real-time feedback and peace of mind before you export.
- **Exporting:** Instantly export your fully styled QR codes as PNG or SVG files.
- **Local & Secure:** Everything runs in your browser. No data is sent to external servers.

## Prerequisites
Before you begin, ensure you have [Node.js](https://nodejs.org/) installed on your machine.

## Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/mattcallaway/QR Studio by MCMC.git
   cd QR Studio by MCMC
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```

## Usage

### Starting the App
Run the local development server:
```bash
npm run dev
```
Open your browser and navigate to the localhost URL provided in your terminal (typically `http://localhost:5173`). *(Note: You can also use the desktop shortcut if you have it installed).*

### Creating a QR Code
1. **Content**: Type the destination URL, text, email, or phone number into the input field.
2. **Colors**: Click the color swatches to adjust the styling of the main pattern, finder corners, and background. Ensure there is enough contrast between the background and foreground colors.
3. **Logo (Optional)**: Click "Choose Logo" to embed an image in the center. Use the slider to scale the logo. Be careful: making the logo too big may obscure too much data.
4. **Verification**: Look at the status indicator right below the QR code.
   - **Green (Verified)**: The code is highly readable.
   - **Yellow/Red (Failed/Warning)**: Try increasing front/back contrast or reducing the logo size to restore readability.
5. **Exporting**: Click **Export as PNG** or **Export as SVG** to download your ready-to-use QR code.

## Tech Stack
- Frontend Framework: React + Vite
- QR Engine: `qr-code-styling`
- Validation Engine: `jsQR`
- Icons: `lucide-react`
