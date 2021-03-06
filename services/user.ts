import User from "../models/User.js";
import { Document } from 'mongoose';

async function findUserByUsername(username: string): Promise<Document | null> {
    const user = await User.findOne({ username });
    return user;
}

async function findUserByEmail(email: string): Promise<Document | null> {
    const user = await User.findOne({ email });
    return user;
}

async function findUserById(id: string): Promise<Document | null> {
    const user = await User.findById(id);
    return user;
}

const userService = {
    findUserByEmail,
    findUserById,
    findUserByUsername,
};

export default userService;