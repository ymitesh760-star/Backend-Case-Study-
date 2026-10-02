const express = require("express");

const {
    createAssignment,
    getAssignments,
    getAssignmentById,
    returnAsset
} = require("../controllers/assignmentController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create asset assignment
router.post("/", authMiddleware, createAssignment);

// Get all assignments
router.get("/", authMiddleware, getAssignments);

// Get single assignment
router.get("/:id", authMiddleware, getAssignmentById);

// Return asset
router.put("/:id/return", authMiddleware, returnAsset);

module.exports = router;