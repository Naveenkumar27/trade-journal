
# Trade Journal

A web platform for tracking, analyzing, and managing your stock trading activity. Built to improve decision-making and provide insights into your portfolio.

---

## ✨ Features

- ✅ **Signup / Login** with email (via Supabase Auth)
- ✅ **Record Trades**: Add details like stock symbol, buy/sell dates, quantity, and price
- ✅ **View Past Trades**: Filter and view all completed trades
- ✅ **Track Open Positions**: View your current holdings and invested capital
- ✅ **Profit/Loss Calculation**: See your profit or loss for each trade
- ✅ **Portfolio Analysis**: Gain insights like current portfolio value, win rate, profit factor, etc.
- ✅ **Trade Learnings/Notes**: Add notes or lessons learned for each trade
- ✅ **Modern UI**: Easy-to-use interface built with Next.js, Tailwind CSS, and ShadCN/UI

---

## 👥 User Story

**Traders** use **Trade Journal** to:
- Log all their stock trades and investments
- Track all their stock trades (buy and sell)
- Get insights into trading performance (P&L, hit rate, etc.)
- Keep a log of trade learnings to improve future decision-making
- Manage and analyze open stock positions
- View their entire trading history and analyze past performance

---

## ⚙️ Tech Stack

| Tool                  | Version    |
|-----------------------|------------|
| **Next.js**           | 15.3.0     |
| **React**             | ^19.0.0    |
| **Supabase**          | ^2.49.4    |
| **Tailwind CSS**      | ^3.4.17    |
| **ShadCN/UI**         | latest     |
| **Lucide Icons**      | ^0.488.0   |
| **React Hook Form**   | ^7.56.0    |
| **Zod**               | ^3.24.3    |
| **Recharts**          | ^2.15.2    |

---

## 🧱 Project Structure

```
app/            # Next.js App Router structure
components/     # UI components (Button, Card, Table, etc.)
contexts/       # Context providers (UserContext, TradeContext)
hooks/          # Custom hooks (e.g., useToast, useTrade)
lib/            # Supabase client and helpers
styles/         # Tailwind config & global styles
```

---

## 🚀 Getting Started

### 1. Clone the repository:

```bash
git clone https://github.com/Naveenkumar27/trade-journal.git
cd trade-journal
```

### 2. Install dependencies:

```bash
npm install
```

### 3. Set up environment variables:

Create a `.env.local` file and add the following:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run the development server:

```bash
npm run dev
```

---

## 📦 Notable Dependencies

```json
{
  "@supabase/supabase-js": "^2.49.4",
  "react-hook-form": "^7.56.0",
  "next": "15.3.0",
  "tailwindcss": "^3.4.17",
  "lucide-react": "^0.488.0",
  "zod": "^3.24.3",
  "recharts": "^2.15.2"
}
```

---

## 🧠 State Management

- Global user session handled using `UserContext`.
- Trade data managed through `TradeContext`.

---

## 🧪 Test Login

You can explore Trade Journal using the following demo account:

```
Email: demo@tradejournal.app
Password: TradeDemo123!
```
> ✅ You can also sign up with your own email. Email confirmation is disabled, so any address will work.


## 📸 Screenshots

### Dashboard
![Dashboard Screenshot](/public/screenshots/Dashboard.png)

### Trade Entry
![Trade Entry Screenshot](/public/screenshots/Trade-entry-page.png)

### Trade History
![Trade History Screenshot](/public/screenshots/Trade-history.png)
