const mongoose = require("mongoose");

const touristSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    image: {
        type: String,
        required: true,
    },

    state: {
        type: String,
        required: true,
    },

    city: {
        type: String,
        required: true,
    },

    category: {
        type: String,
        enum: ["Heritage", "Nature", "Religious", "Adventure"],
        required: true,
    },

    bestTime: {
        type: String,
    },

    entryFee: {
        type: String,
    },

    timings: {
        type: String,
    },

    nearbyAttractions: {
        type: String,
    },

    mapLink: {
        type: String,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Tourist", touristSchema);