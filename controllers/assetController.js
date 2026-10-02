const Asset = require("../models/Asset");

// CREATE ASSET
const createAsset = async (req, res) => {
    try {
        const { name, category, serialNumber, status } = req.body;

        if (!name || !category || !serialNumber) {
            return res.status(400).json({
                message: "Name, category and serialNumber are required"
            });
        }

        const existingAsset = await Asset.findOne({ serialNumber });

        if (existingAsset) {
            return res.status(409).json({
                message: "Asset with this serial number already exists"
            });
        }

        const asset = await Asset.create({
            name,
            category,
            serialNumber,
            status: status || "AVAILABLE"
        });

        res.status(201).json({
            message: "Asset created successfully",
            asset
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create asset",
            error: error.message
        });
    }
};

// GET ALL ASSETS
const getAssets = async (req, res) => {
    try {
        const assets = await Asset.find();

        res.status(200).json({
            count: assets.length,
            assets
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch assets",
            error: error.message
        });
    }
};

// GET SINGLE ASSET
const getAssetById = async (req, res) => {
    try {
        const asset = await Asset.findById(req.params.id);

        if (!asset) {
            return res.status(404).json({
                message: "Asset not found"
            });
        }

        res.status(200).json(asset);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch asset",
            error: error.message
        });
    }
};

// UPDATE ASSET
const updateAsset = async (req, res) => {
    try {
        const asset = await Asset.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!asset) {
            return res.status(404).json({
                message: "Asset not found"
            });
        }

        res.status(200).json({
            message: "Asset updated successfully",
            asset
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update asset",
            error: error.message
        });
    }
};

// DELETE ASSET
const deleteAsset = async (req, res) => {
    try {
        const asset = await Asset.findByIdAndDelete(req.params.id);

        if (!asset) {
            return res.status(404).json({
                message: "Asset not found"
            });
        }

        res.status(200).json({
            message: "Asset deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete asset",
            error: error.message
        });
    }
};

module.exports = {
    createAsset,
    getAssets,
    getAssetById,
    updateAsset,
    deleteAsset
};