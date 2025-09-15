import { Request, Response, Router } from "express";
import { getToolsByCategory } from "mcp-utils/utils";
import { PORT } from "../config/config";
import { tools } from "../utils/constants";
import { generateHomepageHTML } from "../templates/homepageHTML";

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    const toolsByCategory = getToolsByCategory(tools);
    const homepageHtml = generateHomepageHTML(toolsByCategory, PORT);
    res.send(homepageHtml);
});

export default router;
