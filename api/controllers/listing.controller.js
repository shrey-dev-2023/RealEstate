import Listing from "../models/listing.model.js";
import ContactModel from "../models/contact.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const message = await ContactModel.create(req.body);
    return res.status(201).json({ success: true, message: message });
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only delete your own listings!"));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only update your own listings!"));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListingById = async (req, res, next) => {
  try {
    const listingId = req.params.id; // Get the listing ID from request params
    const listing = await Listing.findById(listingId); // Find the listing by ID in the database

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" }); // Return 404 if listing not found
    }

    res.status(200).json(listing); // Return the found listing
  } catch (error) {
    console.error("Error fetching listing:", error);
    next(error); // Pass the error to the error handling middleware
  }
};

//search
export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;
    if (offer === "false" || offer === undefined) {
      offer = { $in: [true, false] };
    }
    let furnished = req.query.furnished;
    if (furnished === "false" || furnished === undefined) {
      furnished = { $in: [true, false] };
    }
    let parking = req.query.parking;
    if (parking === "false" || parking === undefined) {
      parking = { $in: [true, false] };
    }
    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }

    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
