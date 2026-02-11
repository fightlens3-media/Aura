
# Aura 💳

Aura is a high-fidelity, mobile-first neobank and investment prototype built with **React**, **Tailwind CSS**, and **Framer Motion**. It features a sophisticated UI/UX with AI-powered financial insights driven by **Google Gemini**.

## ✨ Key Features

- **Multi-Currency Wallets:** Manage USD, GBP, and Crypto vaults with real-time market signal tracking.
- **Investment Hub:** Professional-grade asset deep dives with AI-generated market sentiment analysis.
- **Virtual Card Issuance:** Reactive card management with "Freeze/Unfreeze" animations and 3D flip interactions for card details.
- **Smart Rewards:** A gamified loyalty system where users can discover and redeem exclusive deals using AI-generated discovery.
- **ProBot AI Assistant:** A built-in financial advisor for answering complex market queries and providing personal budget insights.
- **Cloud Receipts:** Generate, share, and print verified transaction receipts with unique secure identifiers.

## 🚀 Tech Stack

- **Framework:** React 19
- **Styling:** Tailwind CSS (ESM)
- **Animations:** Framer Motion
- **AI Engine:** @google/genai (Gemini 2.5 Flash & 3 Pro)
- **Charts:** Recharts
- **Utilities:** html2canvas for receipt capturing

## 🛠️ Setup

This project uses modern browser **Import Maps**, meaning it requires no heavy build step like Webpack or Vite to run basic previews.

1. Clone the repository.
2. Serve the directory using any local web server (e.g., `npx serve .` or Live Server in VS Code).
3. Ensure you have a valid **Google Gemini API Key** configured in your environment as `process.env.API_KEY` or provided via the app's authentication flow.

## 🔒 Security
The prototype includes simulated high-security workflows:
- Secure Node Issuance
- Cryptographic Key Generation animations
- Multi-node Ledger Synchronization simulation

---
*Disclaimer: This is a UI/UX prototype. Financial data and market rates are simulated for demonstration purposes.*
