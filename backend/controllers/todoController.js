import asyncHandler from "express-async-handler";
import Todo from "../models/Todo.js";

// @desc    Get todos
// @route   GET /api/todos
// @access  Private
const getTodos = asyncHandler(async (req, res) => {
    const { search, priority, status, startDate, endDate, page = 1, limit = 10 } = req.query;

    const query = { user: req.user._id };

    // Search (Level 3 - Debounced search support)
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
        ];
    }

    // Filter by Priority
    if (priority && priority !== "All") {
        query.priority = priority;
    }

    // Filter by Status
    if (status && status !== "All") {
        query.completed = status === "Completed";
    }

    // Filter by Date Range
    if (startDate || endDate) {
        query.dueDate = {};
        if (startDate) query.dueDate.$gte = new Date(startDate);
        if (endDate) query.dueDate.$lte = new Date(endDate);
    }

    const count = await Todo.countDocuments(query);
    const todos = await Todo.find(query)
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit))
        .populate("category"); // Populate category details

    res.json({
        todos,
        page: Number(page),
        pages: Math.ceil(count / limit),
        total: count
    });
});

// @desc    Create todo
// @route   POST /api/todos
// @access  Private
const createTodo = asyncHandler(async (req, res) => {
    const { title, description, priority, dueDate, category } = req.body;

    // Handle file uploads
    let attachments = [];
    if (req.files) {
        try {
            // Upload to Cloudinary (Mocking if no keys, or use real logic)
            // For real implementation:
            // const import { v2 as cloudinary } from "cloudinary";
            // for (const file of req.files) {
            //   const result = await cloudinary.uploader.upload(file.path);
            //   attachments.push(result.secure_url);
            // }

            // Cloudinary storage already puts the URL in file.path
            req.files.forEach(file => {
                const filePath = file.path.startsWith("http")
                    ? file.path
                    : `/uploads/${file.filename}`;
                attachments.push(filePath);
            });
        } catch (error) {
            console.error("Upload failed", error);
        }
    }

    if (!title) {
        res.status(400);
        throw new Error("Please add a title");
    }

    const todo = await Todo.create({
        user: req.user._id,
        title,
        description,
        priority,
        dueDate,
        category: category || null,
        attachments
    });

    res.status(201).json(todo);
});

// @desc    Update todo
// @route   PUT /api/todos/:id
// @access  Private
const updateTodo = asyncHandler(async (req, res) => {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
        res.status(404);
        throw new Error("Todo not found");
    }

    // Check for user
    if (!req.user) {
        res.status(401);
        throw new Error("User not found");
    }

    // Make sure the logged in user matches the todo user
    if (todo.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error("User not authorized");
    }

    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });

    res.json(updatedTodo);
});

// @desc    Delete todo
// @route   DELETE /api/todos/:id
// @access  Private
const deleteTodo = asyncHandler(async (req, res) => {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
        res.status(404);
        throw new Error("Todo not found");
    }

    if (todo.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error("User not authorized");
    }

    await todo.deleteOne(); // or findByIdAndDelete

    res.json({ id: req.params.id });
});

// @desc    Get stats for graph
// @route   GET /api/todos/stats
// @access  Private
const getStats = asyncHandler(async (req, res) => {
    const completed = await Todo.countDocuments({ user: req.user._id, completed: true });
    const pending = await Todo.countDocuments({ user: req.user._id, completed: false });

    // Additional stats if needed (e.g. by priority)
    const high = await Todo.countDocuments({ user: req.user._id, priority: 'High' });
    const medium = await Todo.countDocuments({ user: req.user._id, priority: 'Medium' });
    const low = await Todo.countDocuments({ user: req.user._id, priority: 'Low' });

    res.json({
        completed,
        pending,
        byPriority: { high, medium, low }
    });
});

export { getTodos, createTodo, updateTodo, deleteTodo, getStats };
