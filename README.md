# MyPasswords - VaultX Manager

VaultX is a password and card management application built using **Next.js**, **Clerk authentication**, and **Tailwind CSS**. This app allows users to securely store and manage their passwords and card details.

## 🚀 Features
- **User Authentication** (Clerk)
- **Add, View, and Manage Cards & Passwords**
- **Responsive UI** with Tailwind CSS
- **Secure Storage**
- **Modern UI with Dark & Light Mode Support**

## 📦 Tech Stack
- **Frontend**: Next.js, React, Tailwind CSS
- **Authentication**: Clerk
- **State Management**: React Context / useState
- **Database**: Clerk Private Metadata

## 📂 Folder Structure
```
root
│── components
│   ├── add-card.tsx
│   ├── add-password.tsx
│   ├── your-cards.tsx
│   ├── your-passwords.tsx
│── pages
│   ├── index.tsx (Home Page)
│── styles
│   ├── globals.css
│── public
│── README.md
│── package.json
```

## 🛠 Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/mypasswords.git
cd mypasswords
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Set Up Environment Variables
Create a `.env.local` file and add the required Clerk API keys:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

### 4️⃣ Run the Development Server
```bash
npm run dev
```

Visit **http://localhost:3000** to see the app in action.

## 🚀 Deployment
You can deploy this app on **Vercel** or **Netlify**.

### Deploy to Vercel:
```bash
npm install -g vercel
vercel
```
Follow the CLI instructions to complete deployment.

## 🔒 Security Notes
- Ensure that sensitive data is securely stored using Clerk's private metadata.
- Avoid storing raw passwords in plaintext.

## 📝 License
This project is licensed under the **MIT License**.




