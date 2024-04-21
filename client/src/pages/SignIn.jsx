import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
	signInStart,
	signInSuccess,
	signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

export default function SignIn() {
	const [formData, setFormData] = useState({}); // form submition
	// const [error, setError] = useState(null); //error handling  --using redux now
	// const [loading, setLoading] = useState(false); // set loading  --using redux now

	const { loading, error } = useSelector((state) => state.user); // coming from global state now
	const navigate = useNavigate(); //navigation post signup
	const dispatch = useDispatch();
	//getting user input & form data
	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.id]: e.target.value,
		});
	};
	//handle submittimg page
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			// to prevent error crashing server
			// setLoading(true);     ---using redux state now
			dispatch(signInStart());
			//create record
			const res = await fetch("/api/auth/signin", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			//error handling
			if (data.success === false) {
				// setError(data.message);
				// setLoading(false);  using redux state hooks now
				dispatch(signInFailure(data.message));
				return;
			}
			// setLoading(false);
			// setError(null);  -- using redux hooks now

			dispatch(signInSuccess(data));
			navigate("/");
			// console.log(data);
		} catch (error) {
			// setLoading(false);
			// setError(error.message);  --- using redux hooks now
			dispatch(signInFailure);
		}
	};
	// }console.log(formData);
	return (
		<div className="p-5 max-w-lg mx-auto mt-32 bg-white rounded-lg shadow-md">
  <h1 className="text-3xl mb-6 text-center font-semibold">Sign In</h1>

  <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
    <input
      type="email"
      placeholder="Email"
      className="border-b-2 border-blue-900 p-3 rounded-lg focus:outline-none focus:border-blue-500"
      id="email"
      onChange={handleChange}
    />
    <input
      type="password"
      placeholder="Password"
      className="border-b-2 border-blue-900 p-3 rounded-lg focus:outline-none focus:border-blue-500"
      id="password"
      onChange={handleChange}
    />

    <button
      disabled={loading}
      className="bg-blue-900 text-white p-3 rounded-lg uppercase hover:bg-blue-800 focus:outline-none transition duration-300"
    >
      {loading ? "Loading..." : "Sign In"}
    </button>
  </form>

  <div className="flex items-center justify-center mt-4">
    <p className="mr-2">Don't have an account?</p>
    <Link to="/sign-up" className="text-blue-600 hover:underline">
      Sign Up
    </Link>
  </div>

  {error && <p className="text-red-500 mt-5">{error}</p>}
</div>


	);
}
