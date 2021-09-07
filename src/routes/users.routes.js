import { Router } from "express";
import {
  renderSignUpForm,
  singup,
  renderSigninForm,
  signin,
  logout,
  renderSecurityPage,
  securityCheck,
} from "../controllers/users.controller";

const router = Router();

// Routes

router.get("/users/signup", renderSignUpForm);

router.post("/users/signup", singup);

router.get("/users/signin", renderSigninForm);

router.post("/users/signin", signin);

router.get("/users/security-check", renderSecurityPage);
router.post("/users/security-check", securityCheck);


router.get("/users/logout", logout);

export default router;
