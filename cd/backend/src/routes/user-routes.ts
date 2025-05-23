import { Router } from "express";
import { getallUsers, Usersignup,UserLogin } from "../controller/user-controller.js";
import { LoginValidator, signupValidator,validate } from "../utils/validators.js";
const userRoutes = Router();
userRoutes.get("/",getallUsers);
userRoutes.post("/signup",validate(signupValidator), Usersignup);
userRoutes.post("/login",validate(LoginValidator), UserLogin);
export default userRoutes;