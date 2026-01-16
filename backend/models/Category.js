import mongoose from "mongoose";

const categorySchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        name: {
            type: String,
            required: [true, "Please add a category name"],
        },
        icon: {
            type: String,
            required: [true, "Please select an icon"],
        },
        color: {
            type: String, // Hex code or tailwind class
            default: "#a855f7",
        },
    },
    {
        timestamps: true,
    }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
