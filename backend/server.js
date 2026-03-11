const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const router = express.Router();

// Load environment variables (needed for local testing and Render builds)
dotenv.config(); 
connectDB(); // Connects to MongoDB Atlas

const app = express();
app.use(express.json());

// ----------------------------------------------------------------------
// FINAL CORS FIX: Define a fallback origin to guarantee the Netlify URL is used.
// This prevents the invalid 'multiple values' error if process.env.ORIGIN is corrupted/empty.
const ALLOWED_ORIGIN = process.env.ORIGIN || 'https://biddbud.netlify.app';
// ----------------------------------------------------------------------

// CORS Configuration
app.use(
    cors({
        // Use the clean allowed origin value
        origin: ALLOWED_ORIGIN,
        methods: ["GET", "PUT", "POST", "DELETE"],
        credentials: true,
    })
);

// Health Check Route for the Root URL
app.get('/', (req, res) => {
    res.status(200).send('Auction System API is running successfully!');
});

// Primary API Routes
app.use(router);
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/auctions", require("./routes/auctionRoutes"));
app.use("/api/bids", require("./routes/bidRoutes"));

// 👇👇👇 CRUCIAL FOR RENDER (Standard Web Service) 👇👇👇

// Render sets the PORT environment variable. We listen on it.
const PORT = process.env.PORT || 5000;

// Listen on '0.0.0.0' to ensure it's accessible externally (important for containerized environments like Render)
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));

// ❌ Do NOT include: module.exports = app; ❌
