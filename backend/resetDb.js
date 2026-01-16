import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../backend/models/User.js";
import Todo from "../backend/models/Todo.js";
import Category from "../backend/models/Category.js";
import connectDB from "../backend/config/db.js";

dotenv.config({ path: '../backend/.env' });

const resetDb = async () => {
    try {
        await connectDB();

        await User.deleteMany({});
        await Todo.deleteMany({});
        await Category.deleteMany({});

        console.log("Data Destroyed!");
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
}

resetDb();
