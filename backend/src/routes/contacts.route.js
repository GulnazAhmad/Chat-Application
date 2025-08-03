import { Router } from "express";
import { searchcontacts } from "../controllers/contacts.controller.js";
import { verifytoken } from "../middlewares/AuthMiddleware.js";
const contactrouter = Router();
contactrouter.post("/searchcontact", verifytoken, searchcontacts);
export default contactrouter;
