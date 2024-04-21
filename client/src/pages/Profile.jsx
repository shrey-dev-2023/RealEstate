import { useDispatch, useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { Link } from "react-router-dom";
import { FaUser } from 'react-icons/fa';


import {
	updateUserStart,
	updateUserSuccess,
	updateUserFailure,
	deleteUserFailure,
	deleteUserStart,
	deleteUserSuccess,
	logOutUserStart,
	logOutUserFailure,
	logOutUserSuccess,
} from "../redux/user/userSlice";

export default function Profile() {
	const { currentUser, loading, error } = useSelector((state) => state.user);
	const fileRef = useRef(null);
	const [file, setfile] = useState(undefined);
	const [filePerc, setFilePerc] = useState(0);
	const [fileUploadError, setFileUploadError] = useState(false);
	const [updateSuccess, setUpdateSuccess] = useState(false);
	const [userListing, setUserListing] = useState([]);
		const [formData, setFormData] = useState({
		  avatar: null,
		  username: '',
		  email: '',
		});


	const dispatch = useDispatch();

	useEffect(() => {
		if (file) {
			handleFileUpload(file);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [file]);

	const handleFileUpload = (file) => {
		const storage = getStorage(app);
		const fileName = new Date().getTime() + file.name;
		const storageRef = ref(storage, fileName);
		const uploadTask = uploadBytesResumable(storageRef, file);

		uploadTask.on(
			"state_changed",
			(snapshot) => {
				const progress =
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				setFilePerc(Math.round(progress));
			},
			() => {
				setFileUploadError(true);
			},
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
					setFormData({ ...formData, avatar: downloadURL })
				);
			}
		);
	};

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};
	// console.log(formData);
	// console.log(userListing);
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			dispatch(updateUserStart());
			const res = await fetch(`/api/user/update/${currentUser._id}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			// console.log(data);
			if (data.success === false) {
				dispatch(updateUserFailure(data.message));
				return;
			}
			dispatch(updateUserSuccess(data));
		} catch (error) {
			dispatch(updateUserFailure(error.message));
			setUpdateSuccess(true);
		}
	};

	const handleDeleteUser = async () => {
		try {
			dispatch(deleteUserStart());
			const res = await fetch(`/api/user/delete/${currentUser._id}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (data.success === false) {
				dispatch(deleteUserFailure(data.message));
				return;
			}
			dispatch(deleteUserSuccess(data));
		} catch (error) {
			dispatch(deleteUserFailure(error.message));
		}
	};

	const handleSignOut = async () => {
		try {
			dispatch(logOutUserStart());
			const res = await fetch(`/api/auth/signout`);
			const data = await res.json();
			if (data.respose === false) {
				dispatch(logOutUserFailure(data.message));
				return;
			}
			dispatch(logOutUserSuccess(data));
		} catch (error) {
			dispatch(logOutUserFailure(error.message));
		}
	};

	const handleListingDelete = async (listingId) => {
		try {
			const res = await fetch(`/api/listing/delete/${listingId}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (data.success === false) {
				console.log(data.message);
				return;
			}

			setUserListing((prev) =>
				prev.filter((listing) => listing._id !== listingId)
			);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="p-5 max-w-lg mx-auto mt-32 bg-white rounded-lg shadow-md">
  <h1 className="text-3xl mb-6 text-center font-semibold text-gray-800">Profile</h1>
  <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
    <div className="flex justify-center items-center">
      <input
        type="file"
        onChange={(e) => setfile(e.target.files[0])}
        ref={fileRef}
        hidden
        accept="image/*"
      />
      <label htmlFor="fileInput">
        <img
          onClick={() => fileRef.current.click()}
          className="rounded-full h-24 w-24 object-cover cursor-pointer border-2 border-gray-200 hover:border-blue-500 transition duration-300"
          src={formData.avatar || currentUser.avatar}
          alt="Profile Image"
        />
      </label>
    </div>
    <div className="text-sm text-center">
      {fileUploadError ? (
        <span className="text-red-500">Error uploading image</span>
      ) : filePerc > 0 && filePerc < 100 ? (
        <span className="text-gray-500">Uploading {filePerc}%</span>
      ) : filePerc === 100 ? (
        <span className="text-green-500">Image uploaded successfully</span>
      ) : (
        ''
      )}
    </div>
    <input
      type="text"
      defaultValue={currentUser.username}
      placeholder="Username"
      className="border-b-2 border-blue-900 p-3 rounded-lg focus:outline-none focus:border-blue-500"
      id="username"
      onChange={handleChange}
    />
    <input
      type="email"
      placeholder="Email"
      defaultValue={currentUser.email}
      className="border-b-2 border-blue-900 p-3 rounded-lg focus:outline-none focus:border-blue-500"
      id="email"
      onChange={handleChange}
    />
    <button
      disabled={loading}
      className="bg-blue-500 text-white p-3 rounded-lg uppercase hover:bg-blue-600 focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-300 shadow-md"
    >
      {loading ? 'Loading...' : 'Update Profile'}
    </button>
    <Link
      to="/create-listing"
      className="bg-green-500 text-white p-3 rounded-lg uppercase text-center hover:bg-green-600 focus:outline-none transition duration-300 shadow-md"
    >
      Create Listing
    </Link>
  </form>

  <div className="flex justify-between mt-5">
    <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer hover:underline">
      Delete Account
    </span>
    <span onClick={handleSignOut} className="text-red-700 cursor-pointer hover:underline">
      Sign Out
    </span>
  </div>

  <p className="text-red-700 mt-5">{error ? error : ''}</p>
  <p className="text-green-600 mt-5">{updateSuccess ? 'Profile updated successfully' : ''}</p>

  {userListing && userListing.length > 0 && (
    <div className="flex flex-col gap-3" id="Wrapper">
      <h1 className="text-center mt-7 text-2xl font-semibold">Your Listings</h1>
      {userListing.map((listing) => (
        <div
          key={listing._id}
          className="p-1 flex gap-2 items-center border rounded-lg justify-between hover:shadow-md transition duration-300"
        >
          <Link to={`/listing/${listing._id}`}>
            <img
              src={listing.imageUrls[0]}
              alt="Listing Image"
              className="h-20 w-20 object-contain rounded-lg"
            />
          </Link>

          <Link
            className="text-slate-600 font-semibold flex-1 hover:underline truncate"
            to={`/listing/${listing._id}`}
          >
            <p>{listing.name}</p>
          </Link>
          <div className="flex flex-col items-center">
            <button
              onClick={() => {
                handleListingDelete(listing._id);
              }}
              className="text-red-600 uppercase hover:underline"
            >
              Delete
            </button>
            <Link to={`/update-listing/${listing._id}`}>
              <button className="text-emerald-600 uppercase hover:underline">Edit</button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )}
</div>


	);
}
