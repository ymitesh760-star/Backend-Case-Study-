const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        serialNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        status: {
            type: String,
            enum: ["AVAILABLE", "ASSIGNED", "MAINTENANCE"],
            default: "AVAILABLE"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Asset", assetSchema);