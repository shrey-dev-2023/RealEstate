import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
	{
        listingId: {
            type: String,
            required: true,
        },
		message: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

const ContactModel = mongoose.model("Contact", contactSchema);

export default ContactModel;
