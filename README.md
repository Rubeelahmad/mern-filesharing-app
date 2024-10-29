
# MERN File Sharing App

This MERN (MongoDB, Express, React, Node) **File Sharing App** provides users with secure authentication, file upload capabilities, and shareable links for uploaded files. It also supports viewing, downloading, and file management. Tailwind CSS is used for styling, and React Toastify for notifications. The app is deployed with Nginx and PM2 on a DigitalOcean server.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Running the Project Locally](#running-the-project-locally)
- [Deployment Guide](#deployment-guide)
- [API Endpoints](#api-endpoints)

## Features

- **User Authentication**: Secure login and signup with JWT.
- **File Upload**: Users can upload single or multiple files.
- **File Sharing**: Files can be shared through a unique, shareable URL.
- **File Viewing and Downloading**: Files are displayed with metadata, and supported formats (images, PDFs) have previews.
- **File Statiscs**: Files stats are displayed with metadata, and supported formats..
- **Responsive UI**: Tailwind CSS provides a modern and responsive design.
- **Notifications**: React Toastify displays user-friendly success/error notifications.

## Technologies Used

- **Frontend**: React, Tailwind CSS, React Toastify
- **Backend**: Node.js, Express, MongoDB with Mongoose
- **Deployment**: DigitalOcean, Nginx, PM2, Git, SSH

## Installation

To install the app locally, follow these steps.

### Prerequisites

- **Node.js** (v18.x or higher)
- **MongoDB Atlas** account (or a locally installed MongoDB server)
- **Git** for version control
- **PM2** (for server process management)
- **Nginx** (for DigitalOcean deployment)

### 1. Clone the Repository

```bash
git clone https://github.com/Rubeelahmad/mern-filesharing-app.git
cd your-repo
```

### 2. Configure the Backend (Server)

Navigate to the server directory and install dependencies.

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory with the following environment variables:

```plaintext
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dbname?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
```

### 3. Configure the Frontend (Client)

Navigate to the client directory and install dependencies.

```bash
cd ../client
npm install
```

In the `client` directory, create a `.env` file for development mode:

```plaintext
REACT_APP_API_URL=http://localhost:5000/api
```

## Running the Project Locally

1. **Start the Backend**: 

   Go to the server directory and start the server.

   ```bash
   cd server
   npm start
   ```

2. **Start the Frontend**:

   In a new terminal, go to the client directory and start the React development server.

   ```bash
   cd client
   npm start
   ```

The frontend will be accessible at `http://localhost:3000`, and the backend API at `http://localhost:5000`.

## Deployment Guide

Deploy the app to DigitalOcean with the following steps.

### Step 1: Set Up the DigitalOcean Droplet

1. Create an Ubuntu Droplet on DigitalOcean.
2. Use SSH to connect to your Droplet.

### Step 2: Install Dependencies on the Droplet

```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Node.js (v18.x)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Git, PM2, and Nginx
sudo apt install git -y
sudo npm install -g pm2
sudo apt install nginx -y
```

### Step 3: Clone the Project on the Server

```bash
# Clone the repository
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### Step 4: Install Project Dependencies

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### Step 5: Build the Frontend

```bash
cd client
npm run build
```

### Step 6: Configure Nginx

1. **Edit Nginx Configuration**:

   ```bash
   sudo nano /etc/nginx/sites-available/mern_app
   ```

2. **Add Configuration**:

   ```nginx
   server {
       listen 80;
       server_name your_server_ip;

       # Serve frontend from React build
       location / {
           root /home/your_username/your-repo/client/build;
           index index.html index.htm;
           try_files $uri /index.html;
       }

       # Proxy backend API requests
       location /api/ {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Replace `your_server_ip` with the Droplet's IP.

3. **Enable and Restart Nginx**:

   ```bash
   sudo ln -s /etc/nginx/sites-available/mern_app /etc/nginx/sites-enabled/
   sudo systemctl restart nginx
   ```

### Step 7: Start the Backend Server with PM2

1. **Start the backend with PM2**:

   ```bash
   cd ~/your-repo/server
   pm2 start index.js --name "mern_backend"
   ```

2. **Save PM2 Process List**:

   ```bash
   pm2 save
   pm2 startup
   ```

### Step 8: Access the Deployed App

Visit `http://your_server_ip` to view the frontend and test API endpoints by going to `http://your_server_ip/api/your_endpoint`.

## API Endpoints

### Authentication
- `POST /api/register`: Register a new user.
- `POST /api/login`: Log in an existing user.

### File Management
- `POST /api/files/upload`: Upload a file.
- `GET /api/files`: Get all uploaded files.
- `GET /api/files/:id`: Get a single file by ID (used for download).
- `DELETE /api/files/:id`: Delete a file by ID.

## Troubleshooting

- **EADDRINUSE Error**: If you encounter a "port already in use" error, use `pm2 delete all` and `pm2 restart` to clear and restart processes.
- **MongoDB Connection Issues**: Ensure the IP address of your DigitalOcean Droplet is whitelisted in MongoDB Atlas.
- **CORS Issues**: Ensure CORS settings in `server/app.js` allow requests from your frontend's production and development URLs.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---
