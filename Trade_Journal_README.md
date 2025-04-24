
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

**Naveen** (and other users) uses the Trade Journal app to:
- Track all their stock trades (buy and sell)
- Get insights into trading performance (P&L, hit rate, etc.)
- Keep a log of trade learnings to improve future decision-making
- Manage and analyze open stock positions
- View their entire trading history and analyze past performance

---

## 🛡 Security & Data

- Uses **Supabase Auth** for secure login and authentication
- **Row Level Security (RLS)** for fine-grained access control
- No cookies or external analytics
- **GDPR-compliant** and secure by default

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

## 🔮 Future Enhancements

- 📊 **Trade Analytics**: Add deeper analytics, such as risk analysis, win streaks, etc.
- 📱 **PWA support**: Allow offline access and notifications.
- 🔐 **Invite-only feature** for private portfolios.
- 🧪 **End-to-End Testing**: Setup for integration tests for critical features.

---

## 🧠 State Management

- Global user session handled using `UserContext`.
- Trade data managed through `TradeContext`.

---

## 🧪 Test Login

You can explore Trade Journal using the following demo account:

```
Email: demo@tradejournal.app
Password: trade1234
```

---

## 📜 License

This project is open-source and available under the MIT License. See the LICENSE file for more details.
