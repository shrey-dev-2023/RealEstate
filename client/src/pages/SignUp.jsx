import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

export default function SignUp() {
	const [formData, setFormData] = useState({}); // from submition
	const [error, setError] = useState(null); //error handling
	const [loading, setLoading] = useState(false); // set loading
	const navigate = useNavigate(); //navigation post signup
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
			setLoading(true);
			//create record
			const res = await fetch("/api/auth/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			//error handling
			if (data.success === false) {
				setError(data.message);
				setLoading(false);
				return;
			}
			setLoading(false);
			setError(null);
			navigate("/sign-in");
			// console.log(data);
		} catch (error) {
			setLoading(false);
			setError(error.message);
		}
	};
	// }console.log(formData);
	return (
		<div className="p-5 max-w-lg mx-auto mt-32 bg-white rounded-lg shadow-md">
  <h1 className="text-3xl mb-6 text-center font-semibold">Sign Up</h1>

  <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
    <input
      type="text"
      placeholder="Username"
      className="border-b-2 border-blue-900 p-3 rounded-lg focus:outline-none focus:border-blue-500"
      id="username"
      onChange={handleChange}
    />
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
      {loading ? "Loading..." : "Sign Up"}
    </button>
  </form>

  <div className="flex items-center justify-center mt-4">
    <p className="mr-2">Already have an account?</p>
    <Link to="/sign-in" className="text-blue-600 hover:underline">
      Sign In
    </Link>
  </div>

  {error && <p className="text-red-500 mt-5">{error}</p>}
</div>

	);
}
