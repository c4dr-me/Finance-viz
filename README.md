# Finance Visualizer

Finance Visualizer is a modern web application for tracking budgets, expenses, and income with real-time analytics and beautiful visualizations.

## Tech Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- MongoDB
- Pusher (real-time updates)

## Project Setup

1. **Clone the repository**
   ```sh
   git clone https://github.com/c4dr-me/Finance-viz
   cd my-app
   ```
2. **Install dependencies**
   ```sh
   npm install
   ```
3. **Configure environment variables**
   - Copy `.env.example` to `.env.local` and fill in your values:
     ```env
     # .env.example
     MONGODB_URI=your_mongodb_connection_string
     PUSHER_APP_ID=
     PUSHER_KEY=
     PUSHER_SECRET=
     PUSHER_CLUSTER=
     NEXT_PUBLIC_PUSHER_KEY=
     NEXT_PUBLIC_PUSHER_CLUSTER=
     ```
4. **Run the development server**
   ```sh
   npm run dev
   ```
5. **Open** [http://localhost:3000](http://localhost:3000) in your browser

## API Endpoints

- `GET /api/analytics` — Get dashboard analytics
- `GET /api/budgets` — List all budgets
- `POST /api/budgets` — Create a new budget
- `GET /api/transactions` — List all transactions
- `POST /api/transactions` — Add a new transaction
- `PUT /api/transactions/[id]` — Update a transaction
- `DELETE /api/transactions/[id]` — Delete a transaction
- `GET /api/socketio` — Socket.IO server endpoint

## Screenshots

### Dashboard Overview

![Dashboard Overview](public/image_1.png)

### Spending Insights

![Spending Insights](public/image.png)

### Category Analysis

![Category Analysis](public/image_2.png)

## License

MIT
