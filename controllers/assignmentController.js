const AssetAssignment = require("../models/AssetAssignment");
const Asset = require("../models/Asset");
const User = require("../models/User");

// CREATE ASSIGNMENT
const createAssignment = async (req, res) => {
    try {
        const { asset, user } = req.body;

        if (!asset || !user) {
            return res.status(400).json({
                message: "Asset and user are required"
            });
        }

        const existingAsset = await Asset.findById(asset);

        if (!existingAsset) {
            return res.status(404).json({
                message: "Asset not found"
            });
        }

        const existingUser = await User.findById(user);

        if (!existingUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (existingAsset.status !== "AVAILABLE") {
            return res.status(400).json({
                message: "Asset is not available for assignment"
            });
        }

        const assignment = await AssetAssignment.create({
            asset,
            user
        });

        existingAsset.status = "ASSIGNED";
        await existingAsset.save();

        res.status(201).json({
            message: "Asset assigned successfully",
            assignment
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to assign asset",
            error: error.message
        });
    }
};


// GET ALL ASSIGNMENTS
const getAssignments = async (req, res) => {
    try {
        const assignments = await AssetAssignment.find()
            .populate("asset")
            .populate("user", "-password");

        res.status(200).json({
            count: assignments.length,
            assignments
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch assignments",
            error: error.message
        });
    }
};


// GET ASSIGNMENT BY ID
const getAssignmentById = async (req, res) => {
    try {
        const assignment = await AssetAssignment.findById(req.params.id)
            .populate("asset")
            .populate("user", "-password");

        if (!assignment) {
            return res.status(404).json({
                message: "Assignment not found"
            });
        }

        res.status(200).json(assignment);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch assignment",
            error: error.message
        });
    }
};


// RETURN ASSET
const returnAsset = async (req, res) => {
    try {
        const assignment = await AssetAssignment.findById(req.params.id);

        if (!assignment) {
            return res.status(404).json({
                message: "Assignment not found"
            });
        }

        if (assignment.status === "RETURNED") {
            return res.status(400).json({
                message: "Asset is already returned"
            });
        }

        assignment.status = "RETURNED";
        assignment.returnedAt = new Date();

        await assignment.save();

        await Asset.findByIdAndUpdate(
            assignment.asset,
            { status: "AVAILABLE" }
        );

        res.status(200).json({
            message: "Asset returned successfully",
            assignment
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to return asset",
            error: error.message
        });
    }
};


module.exports = {
    createAssignment,
    getAssignments,
    getAssignmentById,
    returnAsset
};