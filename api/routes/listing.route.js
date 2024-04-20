import express from "express";
import {
	createListing,
	createContact,
	deleteListing,
	updateListing,
	getListingById,
	getListings,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createListing);
router.delete("/delete/:id", verifyToken, deleteListing);
router.post("/update/:id", verifyToken, updateListing);
router.get("/get/:id", getListingById);
router.get ('/get', getListings)
router.post('/contact', createContact)


export default router;
