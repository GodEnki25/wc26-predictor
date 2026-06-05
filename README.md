# ⚽ WC26 Predictor

A full-stack FIFA World Cup 2026 prediction app built with React, TypeScript, Node.js, Express, and PostgreSQL.

🌐 **Live:** [wc26predictor.vercel.app](https://wc26predictor.vercel.app)
📁 **Repo:** [github.com/GodEnki25/wc26-predictor](https://github.com/GodEnki25/wc26-predictor)

---

## 🏆 Features

- **Group Stage Predictions** — All 48 official FIFA WC26 teams across 12 groups. Click teams to rank them 1st–4th
- **Third Place Selection** — Pick the 8 best third-place teams that advance per official FIFA rules
- **Two-Sided Knockout Bracket** — Official FIFA WC26 bracket layout from Round of 32 → Final, with picks cascading forward automatically
- **Summary Page** — Full recap of all predictions with a share button
- **User Authentication** — Sign up and save your predictions with JWT-based auth *(coming soon)*
- **Persistent Predictions** — PostgreSQL database saves every user's picks *(coming soon)*
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Official FIFA Colors** — Matches the real WC26 brand (red, purple, lime green)

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI framework — components, state management |
| TypeScript | Type safety — catches bugs before runtime |
| Vite | Build tool — fast dev server and hot reload |
| Tailwind CSS | Utility-first CSS framework |

### Backend *(in progress)*
| Technology | Purpose |
|------------|---------|
| Node.js | JavaScript runtime |
| Express | Web framework — REST API routes |
| TypeScript | Typed backend code |
| JWT | JSON Web Tokens — user authentication |
| bcrypt | Password hashing |

### Database *(in progress)*
| Technology | Purpose |
|------------|---------|
| PostgreSQL | Relational database — stores users and predictions |
| Prisma | ORM — type-safe database queries |

### DevOps & Tooling
| Technology | Purpose |
|------------|---------|
| Git + GitHub | Version control and remote repository |
| Vercel | Frontend hosting with CI/CD |
| Railway | Backend and database hosting *(coming soon)* |
| npm | Package manager |
| VS Code | Code editor |

---

## 📁 Project Structure


---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL v14+
- npm v9+

### Installation

1. **Clone the repo**
```bash
git clone https://github.com/GodEnki25/wc26-predictor.git
cd wc26-predictor
```

2. **Install frontend dependencies**
```bash
cd client
npm install
```

3. **Install backend dependencies**
```bash
cd ../server
npm install
```

4. **Set up environment variables**
```bash
# In server/.env
DATABASE_URL="postgresql://user:password@localhost:5432/wc26"
JWT_SECRET="your-secret-key"
PORT=3001
```

5. **Run database migrations**
```bash
cd server
npx prisma migrate dev
```

6. **Start the development servers**

Frontend:
```bash
cd client
npm run dev
```

Backend:
```bash
cd server
npm run dev
```

7. **Open the app**



---

## 🌍 FIFA WC26 Rules Implemented

- ✅ 48 teams across 12 groups of 4
- ✅ Top 2 from each group advance automatically (24 teams)
- ✅ Best 8 third-place teams also advance (per FIFA Annex C)
- ✅ Official Round of 32 matchups (1E vs 3ABCDF, 2A vs 2B, etc.)
- ✅ Two-sided bracket layout matching official FIFA bracket
- ✅ No duplicate third-place team assignments

---

## 👨‍💻 Author

**Sorel** — CS Student
[GitHub](https://github.com/GodEnki25) · [LinkedIn](https://linkedin.com/in/sorel-agbogla)

---

## 📄 License

MIT License — feel free to fork and build your own version!