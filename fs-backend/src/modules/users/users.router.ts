import express from "express";
import { UserController } from "./users.controller";
import { SecurityMiddleware } from "../security/security.middleware";

export class UserRouter {
    private router: express.Router = express.Router();
    private controller: UserController = new UserController();

    public getRouter(): express.Router {
        // this.router.get("/:id", this.controller.getUser);
        this.router.get(
            "/me",
            SecurityMiddleware.validateUser,
            this.controller.getUserProfile
          );
          
        return this.router;
    }
}
