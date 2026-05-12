# Web3 Move Admin Platform

A standalone administration platform for managing the Web3 E-book Library. This application allows administrators to manage the book collection, adjust prices, and monitor the library's inventory synced with the SUI Network.

## Features

- **Inventory Management**: Add, edit, and delete books from the collection.
- **Price Adjustment**: Real-time adjustment of book prices in MIST (SUI).
- **Modern UI**: Built with React, Tailwind CSS, and Lucide icons for a premium experience.
- **Standalone Backend**: Dedicated Node.js backend with Express.

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide React, Sonner (Toasts).
- **Backend**: Node.js, Express, TypeScript, Local JSON database.
- **Package Manager**: pnpm.

## Getting Started

### Prerequisites

- Node.js (v18+)
- pnpm

### Installation

1. Clone the repository.
2. Install dependencies for both frontend and backend:
   ```bash
   pnpm install
   cd server && pnpm install
   ```

### Environment Setup

1. Copy `.env.example` to `.env` in the root directory:
   ```bash
   cp .env.example .env
   ```
2. Copy `server/.env.example` to `server/.env`:
   ```bash
   cd server && cp .env.example .env
   ```

### Running the Application

1. Start the backend server:
   ```bash
   pnpm server
   ```
2. Start the frontend development server:
   ```bash
   pnpm dev
   ```

## Project Structure

- `/src`: React frontend application.
- `/server`: Node.js Express backend.
- `/public`: Static assets.
- `db.json`: Local database file (generated on first run).
