# [WhisperBox 💬](https://whisperbox-msg.vercel.app/)

<p align="center">
  <strong>An AI-powered anonymous messaging platform built with Next.js, TypeScript, and the MERN stack.</strong>
</p>

<p align="center">
  <a href="https://whisperbox-msg.vercel.app/">🌐 Live Demo</a> •
  <a href="https://github.com/vaidikdubey/WhisperBox">📂 Repository</a>
</p>

---

## 📖 Overview

WhisperBox is an anonymous messaging platform where every user gets a unique public profile link based on their username. Anyone with the link can send anonymous messages without creating an account, while the recipient manages everything securely from their personal dashboard.

The platform also integrates **Google Gemini AI** to generate message suggestions, making it easier for visitors to send engaging anonymous messages.

---

## ✨ Features

### 👤 User Authentication

- Secure JWT-based authentication using **NextAuth**
- OTP-based email verification using **Resend**
- User registration and login
- Protected dashboard routes

### 🔗 Unique Public Profile

- Every user gets a unique public page:

  ```link
  https://whisperbox-msg.vercel.app/u/<username>
  ```

- Visitors can send anonymous messages without signing in

### 💌 Anonymous Messaging

- Send messages anonymously
- No sender identity is stored or revealed
- Clean and intuitive messaging interface

### 📬 User Dashboard

- View all received anonymous messages
- Delete messages instantly
- Optimistic UI updates for a smoother experience
- Memoized components for improved rendering performance

### ⚙️ Message Preferences

- Toggle to enable or disable receiving anonymous messages
- Public page automatically respects the user's preference

### 🤖 AI Message Suggestions

- Powered by **Google Gemini API**
- Generates creative anonymous message suggestions
- Helps visitors who don't know what to write

---

## 🛠️ Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod

### Backend

- Next.js API Routes
- MongoDB
- Mongoose
- NextAuth (JWT Authentication)

### AI & Services

- Google Gemini API
- Resend (OTP Email Verification)

### Deployment

- Vercel

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm / pnpm / yarn
- MongoDB Database
- Google Gemini API Key

### Clone the Repository

```bash
git clone https://github.com/vaidikdubey/WhisperBox.git

cd WhisperBox
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env.local` file in the root directory.

```env
MONGODB_URI=

NEXTAUTH_SECRET=

NEXT_PUBLIC_APP_URL=http://localhost:3000

GEMINI_API_KEY=

RESEND_API_KEY
```

> **Note:** Replace the values above with your own credentials before running the project.

### Run the Development Server

```bash
npm run dev
```

Visit:

```link
http://localhost:3000
```

---

## 📂 Project Structure

```text
WhisperBox/
│
├── src/
│   ├── app/
│   ├── components/
│   ├── helpers/
│   ├── hooks/
│   ├── lib/
│   ├── models/
│   ├── schemas/
│   ├── types/
│   ├── middleware.ts
│   └── ...
│
├── public/
├── .env.local
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## ⚡ Performance Optimizations

- Optimistic UI updates for instant state changes
- Optimistic deletion of messages
- Component memoization to reduce unnecessary re-renders
- Efficient API interactions
- Client-side form validation using Zod
- Server-side route protection with NextAuth

---

## 🔒 Authentication

WhisperBox uses **NextAuth** with **JWT sessions** for authentication.

Features include:

- Secure login
- Protected dashboard
- Persistent sessions
- Middleware-based route protection

---

## 🔒 Authentication Flow

- User signs up with email and username
- OTP is sent via **Resend**
- Account is verified after successful OTP validation
- User logs in using **NextAuth (JWT)**
- Authenticated users can access their dashboard securely

## 🤖 AI Integration

The application integrates the **Google Gemini API** to generate anonymous message suggestions.

Users visiting a public profile can generate thoughtful, fun, or engaging message ideas with a single click.

---

## 📸 Application Workflow

```text
Sign Up
    │
    ▼
Verify Email (OTP via Resend)
    │
    ▼
Login (NextAuth)
    │
    ▼
Unique Public Page Generated
    │
    ▼
Visitors Send Anonymous Messages
    │
    ▼
Messages Stored in MongoDB
    │
    ▼
Dashboard
    ├── View Messages
    ├── Delete Messages
    └── Toggle Message Receiving
```

---

## 🌐 Live Demo

**Website**
[WhisperBox](https://whisperbox-msg.vercel.app/)

---

## 📦 Repository

**GitHub**
[WhisperBox-Github](https://github.com/vaidikdubey/WhisperBox)

---

## 🔮 Future Improvements

- Email notifications for new messages
- Message reactions
- Reply with public responses
- User profile customization
- Analytics dashboard
- Rate limiting and spam detection
- Dark/Light theme synchronization

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome.

If you'd like to contribute:

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/amazing-feature
```

3. Commit your changes

```bash
git commit -m "Add amazing feature"
```

4. Push to your branch

```bash
git push origin feature/amazing-feature
```

5. Open a Pull Request


## 👨‍💻 Author

**Vaidik Dubey**

- GitHub: https://github.com/vaidikdubey
- LinkedIn: https://www.linkedin.com/in/vaidik-dubey/

---

<p align="center">
Built with ❤️ using Next.js, TypeScript, MongoDB, NextAuth, Tailwind CSS, Shadcn, and Google Gemini AI.
</p>