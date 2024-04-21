// import React from 'react'

import { useState } from "react";
import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CreateListing() {
	const { currentUser } = useSelector((state) => state.user);
	const [files, setfiles] = useState([]);
	const [formData, setFormData] = useState({
		imageUrls: [],
		name: "",
		description: "",
		address: "",
		type: "rent",
		bedRooms: 1,
		bathRooms: 1,
		regularPrice: "50",
		discountPrice: "0",
		offer: false,
		parking: false,
		furnished: false,
	});
	const navigate = useNavigate();

	const [errorForm, setErrorForm] = useState(false);
	const [loading, setLoading] = useState(false);

	const [imageUploadError, setImageUploadError] = useState(false);
	const [uploading, setUploading] = useState(false);

	console.log(formData);
	const storeImage = async (file) => {
		return new Promise((resolve, reject) => {
			const storage = getStorage(app);
			const fileName = new Date().getTime() + file.name;
			const storageRef = ref(storage, fileName);
			const uploadTask = uploadBytesResumable(storageRef, file);

			uploadTask.on(
				"state_changed",
				(snapshot) => {
					const progress =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					console.log(Math.round(progress));
				},
				(error) => {
					reject(error);
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
						resolve(downloadURL);
					});
				}
			);
		});
	};
	// eslint-disable-next-line no-unused-vars
	const handleImageSubmit = (e) => {
		// e.preventDefault();
		if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
			setUploading(true);
			setImageUploadError(false);
			const promises = [];
			for (let i = 0; i < files.length; i++) {
				promises.push(storeImage(files[i]));
			}
			Promise.all(promises)
				.then((urls) => {
					setFormData({
						...formData,
						imageUrls: formData.imageUrls.concat(urls),
					});
					setImageUploadError(false);
					setUploading(false);
				})
				.catch((err) => {
					setImageUploadError(`"image Upload  failed "+ ${err.message}`);
					setUploading(false);
				});
			// console.log(promises);
		} else {
			setImageUploadError("you can only upload 6 images");
			setUploading(false);
		}
	};
	// console.log(files)



	const handleRemoveImage = (index) => {
		setFormData({
			...formData,
			imageUrls: formData.imageUrls.filter((url, i) => i !== index),
		});
	};

	const handleChangeForm = (e) => {
		if (e.target.id === "sale" || e.target.id === "rent") {
			setFormData({
				...formData,
				type: e.target.id,
			});
		}

		if (
			e.target.id === "parking" ||
			e.target.id === "furnished" ||
			e.target.id === "offer"
		) {
			setFormData({
				...formData,
				[e.target.id]: e.target.checked,
			});
		}

		if (
			e.target.type === "number" ||
			e.target.type === "text" ||
			e.target.type === "textarea"
		) {
			setFormData({ ...formData, [e.target.id]: e.target.value });
		}
	};

	const handleFormSubmit = async (e) => {
		e.preventDefault();

		try {
			//check for image upload
			if (formData.imageUrls.length < 1)
				return setErrorForm("You must upload at least 1 Image");
			// check for sicount price
			if (+formData.regularPrice < +formData.discountPrice)
				return setErrorForm("Discount price must be lower than Regular Price");

			setLoading(false);
			setErrorForm(false);
			const res = await fetch("api/listing/create", {
				method: "post",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...formData,
					userRef: currentUser._id,
				}),
			});
			const data = await res.json();
			setLoading(false);
			if (data.success === false) {
				setErrorForm(data.message);
			}
			navigate(`/listing/${data._id}`);
		} catch (error) {
			setErrorForm(error.message);
			setLoading(false);
		}
	};
	return (
		<main className="p-3 mt-20 max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold text-center my-7 text-blue-900">
        Start Your Listing Journey
      </h1>
  <form
    onSubmit={handleFormSubmit}
    className="bg-gray-100 rounded-lg p-6 shadow-lg"
  >
    <div className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Name"
        className="border p-3 rounded-lg"
        id="name"
        minLength="10"
        maxLength="62"
        required
        onChange={handleChangeForm}
        value={formData.name}
      />
      <textarea
        type="text"
        placeholder="Description"
        className="border p-3 rounded-lg h-32 resize-none"
        id="description"
        required
        onChange={handleChangeForm}
        value={formData.description}
      />
      <input
        type="text"
        placeholder="Address"
        className="border p-3 rounded-lg"
        id="address"
        required
        onChange={handleChangeForm}
        value={formData.address}
      />
    </div>
    <div className="flex gap-4 mt-4">
      <div className="flex items-center gap-2">
        <input
          type="radio"
          id="sale"
          className="w-5 h-5"
          onChange={handleChangeForm}
          checked={formData.type === "sale"}
        />
        <label htmlFor="sale">Sell</label>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="radio"
          id="rent"
          className="w-5 h-5"
          onChange={handleChangeForm}
          checked={formData.type === "rent"}
        />
        <label htmlFor="rent">Rent</label>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="parking"
          className="w-5 h-5"
          onChange={handleChangeForm}
          checked={formData.parking}
        />
        <label htmlFor="parking">Parking Spot</label>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="furnished"
          className="w-5 h-5"
          onChange={handleChangeForm}
          checked={formData.furnished}
        />
        <label htmlFor="furnished">Furnished</label>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="offer"
          className="w-5 h-5"
          onChange={handleChangeForm}
          checked={formData.offer}
        />
        <label htmlFor="offer">Offer</label>
      </div>
    </div>
    <div className="flex gap-4 mt-4">
      <div className="flex items-center gap-2">
        <input
          className="p-3 border-blue-500 rounded-lg w-16"
          type="number"
          id="bedRooms"
          min="1"
          max="10"
          required
          onChange={handleChangeForm}
          value={formData.bedRooms}
        />
        <label htmlFor="bedRooms">Beds</label>
      </div>
      <div className="flex items-center gap-2">
        <input
          className="p-3 border-blue-500 rounded-lg w-16"
          type="number"
          id="bathRooms"
          min="1"
          max="10"
          required
          onChange={handleChangeForm}
          value={formData.bathRooms}
        />
        <label htmlFor="bathRooms">Baths</label>
      </div>
      <div className="flex items-center gap-2">
        <input
          className="p-3 border-blue-500 rounded-lg w-24"
          type="number"
          id="regularPrice"
          min="50"
          max="10000000000"
          required
          onChange={handleChangeForm}
          value={formData.regularPrice}
        />
        <label htmlFor="regularPrice">Regular Price</label>
        {formData.type === "rent" && (
          <span className="text-xs">($/Month)</span>
        )}
      </div>
      {formData.offer && (
        <div className="flex items-center gap-2">
          <input
            className="p-3 border-blue-500 rounded-lg w-24"
            type="number"
            id="discountPrice"
            required
            min="0"
            max="10000000"
            onChange={handleChangeForm}
            value={formData.discountPrice}
          />
          <label htmlFor="discountPrice">Discounted Price</label>
          {formData.type === "rent" && (
            <span className="text-xs">($/Month)</span>
          )}
        </div>
      )}
    </div>
    <p className="font-semibold mt-4">
      Images:
      <span className="font-normal text-gray-500 ml-2">
        The First image will be cover( max6)
      </span>
    </p>
    {formData.imageUrls.length > 0 &&
      formData.imageUrls.map((url, index) => (
        <div
          key={index}
          className="flex justify-between p-3 items-center border-blue-900"
        >
          <img
            src={url}
            alt="listing image"
            key={index}
            className="w-20 h-20 object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={() => handleRemoveImage(index)}
            className="p-3 uppercase text-red-700 hover:opacity-75"
          >
            Delete
          </button>
        </div>
      ))}
    <div className="flex gap-4 mt-4">
      <input
        onChange={(e) => setfiles(e.target.files)}
        className="p-3 border-blue-400 rounded w-full"
        type="file"
        id="images"
        accept="image/*"
        multiple
      />
      <p className="text-red-500 text-center">
        {imageUploadError && imageUploadError}
      </p>
      <button
        type="button"
        onClick={handleImageSubmit}
        disabled={uploading}
        className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
      >
        {uploading ? "Uploading " : "Upload"}
      </button>
    </div>
    <button
  disabled={loading || uploading}
  className="p-3 bg-blue-900 rounded-lg text-white uppercase hover:bg-blue-800 focus:outline-none transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-80 mt-4 mx-auto block shadow-lg"
>
  {loading ? "Creating..." : "Create Listing"}
</button>
    {errorForm && <p className="text-red-500 mt-4">{errorForm}</p>}
  </form>
</main>

	);
}