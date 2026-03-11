TrackMySubs (SubSentinel) 🛡️
A Full-Stack Subscription Management & Split-Tracking Platform

TrackMySubs is a MERN stack application designed to help users take control of their digital spending. It provides a centralized dashboard to track recurring subscriptions, monitor free trial deadlines with visual urgency alerts, and automatically calculate cost-splits among friends or family.

🚀 Features
Intelligent Dashboard: Color-coded subscription cards (Green/Yellow/Red) based on renewal urgency.

Trial Monitoring: Dedicated logic for free trials with "CANCEL NOW" alerts to avoid unwanted charges.

Live Split-Calculator: Real-time cost-per-person calculation using useMemo for optimal performance.

Dynamic UI: Modern "Glassmorphism" design using Material UI with full Light/Dark mode support.

Secure API: RESTful backend with Node.js and Express to handle CRUD operations.

Persistent Storage: MongoDB integration for reliable data management.

🛠️ Tech Stack
Frontend: * React.js

Material UI (MUI)

Axios (API communication)

Context API (Theme & State management)

Backend:

Node.js

Express.js

Mongoose (ODM)

Database:

MongoDB Atlas

📦 Installation & Setup
Clone the repository:

Bash
git clone https://github.com/yourusername/trackmysubs.git
cd trackmysubs
Backend Setup:

Navigate to the server directory: cd server

Install dependencies: npm install

Create a .env file and add your credentials:

Code snippet
PORT=5050
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
Start the server: npm start

Frontend Setup:

Navigate to the client directory: cd client

Install dependencies: npm install

Start the development server: npm start
