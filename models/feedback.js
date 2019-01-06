const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema({
    names:String,
    Phone: Number,
    email: { type: String, unique: true, required: true },
    feedback:String,
});

module.exports = mongoose.model("Feedback", FeedbackSchema);