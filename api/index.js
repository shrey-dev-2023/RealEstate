import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import cookieParser from "cookie-parser";
import path from "path";
// import cors from "cors";

dotenv.config();


//mondodb connection
mongoose
	.connect("mongodb+srv://shreykhandelwal9659:ZGa1mmjt2DEasU50@realestate.krjnkop.mongodb.net/?retryWrites=true&w=majority&appName=RealEstate")
	.then(() => {
		console.log("MongoDB Connected");
	})
	.catch((err) => {
		console.log(err);
	});

const __dirname = path.resolve();

// starting server
const app = express();
app.use(express.json());
app.use(cookieParser());

// app.use(
// 	cors([
// 		{
// 			"origin": ["*"],
//     		"method": ["GET", "PUT", "POST", "DELETE"],
// 		}
// 	])
//   );


app.listen(3000, () => {
	console.log("Server is running on port 3000!!!");
});

//routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

app.use(express.static(path.join(__dirname, "/client/dist")));
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

// error middleware
app.use((err, req, res, next) => {
	const statusCode = err.statusCode || 500;
	const message = err.message || "Internal Server Error";
	return res.status(statusCode).json({
		success: false,
		statusCode: statusCode,
		message: message,
	});
});
