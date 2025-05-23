import User from "../models/Users.js";
import { hash, compare } from "bcrypt";
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";
export const getallUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        return res.status(201).json({ message: "OK", users });
    }
    catch (error) {
        console.log(error);
        // Check if the error is a validation error
        return res.status(200).json({ message: "Internal Server Error", cause: error.message });
    }
};
export const Usersignup = async (req, res, next) => {
    try {
        //user signup
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(200).send({ message: "User already exists" });
        }
        const hashedPassword = await hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        return res.status(200).json({ message: "OK", id: user._id.toString() });
    }
    catch (error) {
        console.log(error);
        // Check if the error is a validation error
        return res.status(200).json({ message: "Internal Server Error", cause: error.message });
    }
};
export const UserLogin = async (req, res, next) => {
    try {
        //user signup
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send({ message: "User not found" });
        }
        const isMatch = await compare(password, user.password);
        if (!isMatch) {
            return res.status(403).send({ message: "Invalid credentials" });
        }
        res.clearCookie(COOKIE_NAME, { domain: "localhost", httpOnly: true, signed: true, path: "/" });
        const token = createToken(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(COOKIE_NAME, token, { path: "/", domain: "localhost", expires, httpOnly: true, signed: true });
        return res.status(200).json({ message: "OK", id: user._id.toString() });
    }
    catch (error) {
        console.log(error);
        // Check if the error is a validation error
        return res.status(200).json({ message: "Internal Server Error", cause: error.message });
    }
};
//# sourceMappingURL=user-controller.js.map