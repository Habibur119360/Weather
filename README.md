# 🌤️ AeroScope - Real-Time Weather, AQI & Humidity Monitor

A full-stack modern web application built with **React.js, Node.js, and Express.js** to monitor real-time weather, Air Quality Index (AQI), humidity, and forecasts worldwide.

---

## 🚀 Features (ফিচারসমূহ)

- 🌡️ **Real-Time Weather**: Live temperature, feels-like, wind speed, pressure, UV index.
- 🍃 **Real-Time AQI**: US AQI scale, health category badges, and pollutant breakdown (PM2.5, PM10, NO₂, SO₂, CO, O₃).
- 💧 **Humidity Analysis**: Relative humidity percentage, dew point calculation, and comfort gauge.
- 🕒 **24-Hour Hourly Forecast**: Interactive time slider with precipitation probability & conditions.
- 📅 **7-Day Daily Forecast**: High/low temperatures, sunrise/sunset, UV index, rainfall amounts.
- 🔍 **City Search & GPS**: Search any city in the world or use GPS one-click auto-detection.
- 🌐 **Bilingual Support**: English & Bengali (বাংলা).
- 📱 **Fully Responsive**: Mobile, tablet, and desktop friendly.

---

## 📁 Project Structure (প্রজেক্ট স্ট্রাকচার)

```
project/
├── client/                 # React.js Frontend (Vite)
│   ├── src/
│   │   ├── components/     # Clean UI Components
│   │   ├── services/       # API call handlers
│   │   ├── App.jsx         # Main React Component
│   │   └── main.jsx        # React entry point
│   ├── package.json
│   └── vite.config.js
├── server/                 # Node.js + Express.js Backend
│   ├── src/
│   │   ├── controllers/    # API Controllers
│   │   ├── services/       # Weather & AQI data fetchers
│   │   ├── utils/          # Calculations & code mappings
│   │   └── index.js        # Express Server
│   └── package.json
├── .gitignore              # Ignores node_modules, .env, dist
├── package.json            # Root Scripts
└── README.md
```

---

## 💻 Local Setup (আপনার কম্পিউটারে চালানোর নিয়ম)

### 1. Install Dependencies (প্যাকেজ ইন্সটল করুন):
```bash
# Server packages
cd server
npm install

# Client packages
cd ../client
npm install
```

### 2. Run Development Mode (লোকালি চালু করুন):

**Option A (Backend + Frontend আলাদা টার্মিনালে):**
- **Terminal 1 (Backend):**
  ```bash
  cd server
  npm start
  ```
  *(Server runs at http://localhost:5000)*

- **Terminal 2 (Frontend):**
  ```bash
  cd client
  npm run dev
  ```
  *(Frontend opens at http://localhost:5173)*

**Option B (Single Command Fullstack Run):**
```bash
npm run build
npm start
```
*(Open http://localhost:5000 in your browser)*

---

## 📤 How to Upload to GitHub (গিটহাবে আপলোড করার নিয়ম)

GitHub-এ আপনার প্রোজেক্টটি আপলোড করতে নিচের কমান্ডগুলো ধারাবাহিকভাবে রান করুন:

1. **Git শুরু করুন (Initialize Git):**
   ```bash
   git init
   ```

2. **সব ফাইল যোগ করুন (Add files):**
   ```bash
   git add .
   ```

3. **কমিট করুন (Commit):**
   ```bash
   git commit -m "Initial commit - Weather & AQI Fullstack App"
   ```

4. **GitHub-এ একটি নতুন Repository তৈরি করুন:**
   - [github.com/new](https://github.com/new) এ যান।
   - Repository-র নাম দিন (যেমন: `weather-aqi-app`)।
   - **Public** নির্বাচন করে **Create repository** বাটনে ক্লিক করুন।

5. **GitHub-এর সাথে লিঙ্ক করুন এবং পুশ করুন:**
   ```bash
   git branch -M main
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>.git
   git push -u origin main
   ```

*(নোট: `.gitignore` ফাইলটি অলরেডি কনফিগার করা আছে, তাই অপ্রয়োজনীয় `node_modules` ফাইল গিটহাবে আপলোড হবে না।)*

---

## 🌐 Free Online Deployment Guide (অনলাইনে ফ্রিতে হোস্ট করার নিয়ম)

### Method 1: Render.com (Full-Stack Deployment - সবচেয়ে সহজ)
1. [render.com](https://render.com) এ লগইন করুন।
2. **New +** > **Web Service** ক্লিক করুন।
3. আপনার GitHub রিপোজিটরিটি সিলেক্ট করুন।
4. সেটিংস দিন:
   - **Runtime:** `Node`
   - **Build Command:** `npm install --prefix server && npm install --prefix client && npm run build`
   - **Start Command:** `npm start`
5. **Create Web Service** বাটনে ক্লিক করুন। ২ মিনিটের মধ্যে আপনার লাইভ সাইট রেডি হয়ে যাবে!

### Method 2: Vercel / Netlify (Frontend Only)
1. [vercel.com](https://vercel.com) এ যান এবং GitHub রিপোজিটরি কানেক্ট করুন।
2. **Root Directory:** `client` সিলেক্ট করুন।
3. **Deploy** বাটনে ক্লিক করুন।
*(আমাদের ফ্রন্টএন্ডে বিল্ট-ইন অটো ফলব্যাক রাখা আছে, তাই ব্যাকএন্ড ছাড়াই লাইভ ডেটা কাজ করবে!)*

---

## 🛠️ Tech Stack
- **Frontend:** React 18, Vite, Lucide Icons, CSS3 Glassmorphism
- **Backend:** Node.js, Express.js, Axios, Node-Cache
- **Data APIs:** Open-Meteo & Open-Meteo Air Quality (100% Free, No API Key Required)
