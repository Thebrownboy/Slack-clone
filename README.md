# Slack Clone – Real-Time Messaging App

## 🚀 Overview
Slack Clone is a **full-stack** real-time messaging application that mimics the core functionalities of Slack, including real-time messaging, threaded replies, and emoji reactions. The app provides a seamless user experience with a fully responsive UI and efficient state management. Built using **Next.js, Pusher, Prisma, Auth.js, and TypeScript**, this project ensures a smooth and interactive communication platform.

## ✨ Features
- **Real-time messaging** powered by **Pusher**.
- **Threaded conversations** to keep discussions organized.
- **Emoji reactions** for interactive engagement.
- **User authentication and session management** with **Auth.js**.
- **Optimized database handling** using **Prisma**.
- **Fully responsive and dynamic UI** with **Next.js and TypeScript**.
- **Scalable and maintainable architecture**.

## 🛠️ Technologies Used
- **Frontend:** Next.js, React, TypeScript
- **Backend:** Next.js API Routes, Prisma, Pusher
- **Authentication:** Auth.js
- **Database:** PostgreSQL (with Prisma ORM)
- **Real-Time Updates:** Pusher
- **Styling:** Tailwind CSS

## 📸 Screenshots
_(Add some screenshots here to showcase the UI and functionality)_

## 📦 Installation & Setup

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/yourusername/slack-clone.git
cd slack-clone
```

### 2️⃣ Install Dependencies
```sh
npm install  # or yarn install
```

### 3️⃣ Set Up Environment Variables
Create a `.env.local` file and add the following environment variables:
```env
DATABASE_URL=your_postgresql_database_url
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_auth_secret
PUSHER_APP_ID=your_pusher_app_id
PUSHER_KEY=your_pusher_key
PUSHER_SECRET=your_pusher_secret
PUSHER_CLUSTER=your_pusher_cluster
```

### 4️⃣ Apply Database Migrations
```sh
npx prisma migrate dev --name init
```

### 5️⃣ Start the Development Server
```sh
npm run dev  # or yarn dev
```
App runs locally at: [http://localhost:3000](http://localhost:3000)


Make sure to set the **environment variables** in Vercel.

## 🛡️ Security & Best Practices
- Uses **NextAuth.js** for secure authentication.
- Database queries managed efficiently using **Prisma**.
- **Environment variables** securely managed with `.env.local`.

## 📖 Future Enhancements
- **File sharing** functionality, till now you can share images only 
- **Customizable user profiles**.
- **Push notifications for new messages**. the messages are sent in real time but without notifications

## 💡 Contributing
Contributions are welcome! Feel free to fork the repo, create a feature branch, and submit a pull request.

## 📝 License
This project is licensed under the **MIT License**.

---
Made with ❤️ by [Thebrownboy]([https://github.com/yourusername](https://github.com/Thebrownboy))

