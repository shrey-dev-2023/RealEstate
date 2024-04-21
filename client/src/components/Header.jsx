import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function Header() {
	const { currentUser } = useSelector((state) => state.user);
	const [aboutHovered, setAboutHovered] = useState(false);
	const [homeHovered, setHomeHovered] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();
		const urlParams = new URLSearchParams(window.location.search);
		urlParams.set("searchTerm", searchTerm);
		const searchQuery = urlParams.toString();
		navigate(`/search?${searchQuery}`);
    console.log('Searching for:', searchTerm);
	};

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const searchTermFromUrl = urlParams.get("searchTerm");
		if (searchTermFromUrl) {
			setSearchTerm(searchTermFromUrl);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location.search]);
	return (
		<header className="bg-[#023047] shadow-md top-0 fixed w-full z-50">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link
          to="/"
          className={`text-white font-bold text-xl flex items-center ${
            homeHovered ? 'text-yellow-300' : ''
          } transition-colors duration-300`}
          onMouseEnter={() => setHomeHovered(true)}
          onMouseLeave={() => setHomeHovered(false)}
        >
          <span className="text-blue-700">Real</span>
          <span className="text-blue-500">Estate</span>
        </Link>
        <form
          onSubmit={handleSubmit}
          className="bg-white bg-opacity-25 border p-3 rounded-lg flex items-center ml-4 transition-all duration-300 focus-within:border-blue-500"
        >
          <input
            className="text-white bg-transparent focus:outline-none w-24 sm:w-64 placeholder-white placeholder-opacity-50"
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">
            <FaSearch className="text-blue-500 cursor-pointer" />
          </button>
        </form>
        <ul className="flex gap-4">
          <li>
            <Link
              to="/"
              className={`text-blue-500 hover:text-yellow-300 hover:underline transition-colors duration-300 ${
                homeHovered ? 'font-semibold' : ''
              }`}
              onMouseEnter={() => setHomeHovered(true)}
              onMouseLeave={() => setHomeHovered(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={`text-blue-500 hover:text-yellow-300 hover:underline transition-colors duration-300 ${
                aboutHovered ? 'font-semibold' : ''
              }`}
              onMouseEnter={() => setAboutHovered(true)}
              onMouseLeave={() => setAboutHovered(false)}
            >
              About
            </Link>
          </li>
          <li>
            <Link to="/profile">
              {currentUser ? (
                <img
                  className="rounded-full h-7 w-7 object-cover transition-all duration-300 transform hover:rotate-12"
                  src={currentUser.avatar}
                  alt="Profile"
                />
              ) : (
                <span className="text-blue-500 hover:text-yellow-300 hover:underline font-semibold">Sign In</span>
              )}
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}

