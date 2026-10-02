const mongoose = require("mongoose");

const assetAssignmentSchema = new mongoose.Schema(
    {
        asset: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Asset",
            required: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        assignedAt: {
            type: Date,
            default: Date.now
        },

        returnedAt: {
            type: Date,
            default: null
        },

        status: {
            type: String,
            enum: ["ASSIGNED", "RETURNED"],
            default: "ASSIGNED"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "AssetAssignment",
    assetAssignmentSchema
);