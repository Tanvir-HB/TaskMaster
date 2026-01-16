import asyncHandler from "express-async-handler";
import Category from "../models/Category.js";

// @desc    Get categories
// @route   GET /api/categories
// @access  Private
const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({ user: req.user.id });
    res.json(categories);
});

// @desc    Create category
// @route   POST /api/categories
// @access  Private
const createCategory = asyncHandler(async (req, res) => {
    const { name, icon, color } = req.body;

    if (!name || !icon) {
        res.status(400);
        throw new Error("Please add all fields");
    }

    const category = await Category.create({
        user: req.user.id,
        name,
        icon,
        color,
    });

    res.status(201).json(category);
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private
const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        res.status(404);
        throw new Error("Category not found");
    }

    // Check for user
    if (!req.user) {
        res.status(401);
        throw new Error("User not found");
    }

    // Make sure the logged in user matches the category user
    if (category.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error("User not authorized");
    }

    await category.deleteOne();

    res.json({ id: req.params.id });
});

export { getCategories, createCategory, deleteCategory };
