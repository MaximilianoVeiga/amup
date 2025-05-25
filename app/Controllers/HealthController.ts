import { Request, Response } from "express";

export default class HealthController {
    async show(req: Request, res: Response): Promise<void> {
        res.status(200).send({
            status: "ON",
            message: "Server is running",
        });
    }
}
