const mongoose = require("mongoose");

const KitchenSchema = new mongoose.Schema({
    item:String,
    amount: Number,
    unit:String,
    quantity:Number,
    price:Number,
    category:String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"

        },
        username: String
    },
});

module.exports = mongoose.model("Kitchen", KitchenSchema);