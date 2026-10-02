const express = require("express");

const {
    createAsset,
    getAssets,
    getAssetById,
    updateAsset,
    deleteAsset
} = require("../controllers/assetController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create asset
router.post("/", authMiddleware, createAsset);

// Get all assets
router.get("/", authMiddleware, getAssets);

// Get single asset
router.get("/:id", authMiddleware, getAssetById);

// Update asset
router.put("/:id", authMiddleware, updateAsset);

// Delete asset
router.delete("/:id", authMiddleware, deleteAsset);

module.exports = router;