require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('./models/Order');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || process.env.DATABASE_URL;

if (!MONGO_URI) {
    console.error("❌ No MONGO_URI found in your .env file.");
    process.exit(1);
}

mongoose.connect(MONGO_URI).then(async () => {
    console.log("✅ Connected to MongoDB");
    
    // Find all orders with capital 'Approved' and change to lowercase
    const result = await Order.updateMany(
        { status: "Approved" },
        { $set: { status: "approved" } }
    );
    
    console.log(`✅ SUCCESS: Fixed ${result.modifiedCount} old approved orders!`);
    process.exit(0);
}).catch(err => {
    console.error("❌ DB Error:", err);
    process.exit(1);
});
