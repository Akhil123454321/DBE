import { Router } from "express";
import {
  renderSignUpForm,
  singup,
  renderSigninForm,
  signin,
  logout,
  success,
} from "../controllers/users.controller";

const router = Router();

// Routes
router.get("/users/signup", renderSignUpForm);

router.post("/users/signup", singup);

router.get("/users/signin", renderSigninForm);

router.post("/users/signin", signin);

router.get("/users/logout", logout);

router.get("/users/success", success)

export default router;
