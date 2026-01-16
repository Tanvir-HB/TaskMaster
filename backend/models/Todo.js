import mongoose from "mongoose";

const todoSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String, // Rich text content (HTML)
        },
        priority: {
            type: String,
            enum: ["High", "Medium", "Low"],
            default: "Low",
        },
        completed: {
            type: Boolean,
            default: false,
        },
        dueDate: {
            type: Date,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        },
        attachments: [
            {
                type: String,
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Todo = mongoose.model("Todo", todoSchema);

export default Todo;
