---
description: How to deploy the Finance Dashboard application to Render
---

# Render Deployment Guide

Follow these steps to deploy your MERN stack application to Render.com.

## 1. Prepare your GitHub Repository
Ensure all your latest changes are pushed to GitHub:
```bash
git add .
git commit -m "chore: prepare for render deployment"
git push origin main
```

## 2. Create a New Web Service on Render
1. Go to [Dashboard.render.com](https://dashboard.render.com) and log in.
2. Click **New** > **Web Service**.
3. Connect your GitHub repository.
4. Select the `financeDashboard` repository.

## 3. Configure the Web Service
Set the following values in the Render dashboard:

- **Name**: `finance-dashboard` (or your preferred name)
- **Environment**: `Node`
- **Region**: Select the one closest to you (e.g., `Singapore` or `Frankfurt`)
- **Branch**: `main`
- **Root Directory**: Leave empty (keep it as the project root)
- **Build Command**: `npm run build && npm run render-postinstall`
- **Start Command**: `NODE_ENV=production npm start`
- **Instance Type**: `Free` (or any other tier)

## 4. Set Environment Variables
Click on the **Environment** tab in Render and add the following:

- `MONGO_URI`: Your MongoDB Atlas connection string.
- `JWT_SECRET`: Your secret key (e.g., `supersecret`).
- `PORT`: `5003` (The app is configured to use this, Render will proxy it to port 80/443).
- `NODE_ENV`: `production`

## 5. Update MongoDB Atlas Whitelist
Since Render's IP addresses are dynamic on the Free tier, you must allow access from anywhere in your MongoDB Atlas settings:
1. Go to **Network Access** in MongoDB Atlas.
2. Click **Add IP Address**.
3. Select **Allow Access From Anywhere** (IP `0.0.0.0/0`).
4. Click **Confirm**.

## 6. Deployment
Once you click **Create Web Service**, Render will:
1. Install root dependencies.
2. Build the React frontend (`npm run build`).
3. Install backend dependencies.
4. Start the server in production mode.

Your app will be live at `https://your-app-name.onrender.com`.
