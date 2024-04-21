/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import 'animate.css';

// import 'swiper/swiper-bundle.min.css';
import ListingItem from "../components/ListingItem";

export default function Home() {
	const [offerListings, setOfferListings] = useState([]);
	const [saleListings, setSaleListings] = useState([]);
	const [rentListings, setRentListings] = useState([]);
	SwiperCore.use(Navigation);
	// console.log(saleListings);
	useEffect(() => {
		const fetchOfferListings = async () => {
			try {
				const res = await fetch("/api/listing/get?offer=true&limit=4");
				const data = await res.json();
				setOfferListings(data);
				fetchRentListings();
			} catch (error) {
				console.log(error);
			}
		};
		const fetchRentListings = async () => {
			try {
				const res = await fetch("/api/listing/get?type=rent&limit=4");
				const data = await res.json();
				setRentListings(data);
				fetchSaleListings();
			} catch (error) {
				console.log(error);
			}
		};

		const fetchSaleListings = async () => {
			try {
				const res = await fetch("/api/listing/get?type=sale&limit=4");
				const data = await res.json();
				setSaleListings(data);
			} catch (error) {
				console.log(error);
			}
		};

		fetchOfferListings();
	}, []);

	return (
		<main className="bg-gray-100 min-h-screen">
		<div className="flex flex-col gap-6 py-28 px-3 max-w-6xl mx-auto animate__animated animate__fadeInDown"> {/* Added animate__animated and animate__fadeInDown */}
  <h1 className="text-blue-800 font-bold text-3xl lg:text-6xl">
    <span className="animate__animated animate__bounceInLeft">Find your Next</span> {/* Added animate__animated and animate__bounceInLeft */}
    <span className="text-blue-600 animate__animated animate__bounceInRight">Perfect</span> {/* Added animate__animated and animate__bounceInRight */}
    <span className="animate__animated animate__bounceInUp">place with ease</span> {/* Added animate__animated and animate__bounceInUp */}
  </h1>
  <div className="bg-white rounded-lg shadow-lg flex flex-col justify-between h-full">
  <div className="p-8">
    <p className="text-gray-800 text-lg md:text-xl">
      Welcome to Sahand Estate - your gateway to discovering the perfect home. With our diverse range of properties, finding your ideal living space has never been easier.
    </p>
    <div className="mt-6 text-gray-800">
      <p className="text-lg md:text-xl">
        Whether you're searching for a cozy apartment in the heart of the city, a tranquil suburban retreat, or a luxurious estate with breathtaking views, we have something for everyone.
      </p>
      <p className="text-lg md:text-xl mt-4">
        Our dedicated team is here to assist you every step of the way, ensuring that your journey to finding your dream home is seamless and enjoyable.
      </p>
    </div>
  </div>
  <div className="p-8">
    <Link
      to="/search"
      className="bg-emerald-500 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-emerald-600 hover:shadow-lg transition duration-300 ease-in-out text-center"
    >
      <span className="animate__animated animate__pulse">Let's get started...</span>
    </Link>
  </div>
</div>

		</div>
  
		<Swiper navigation>
		  {offerListings && offerListings.length > 0 &&
			offerListings.map((listing) => (
			  <SwiperSlide key={listing._id}>
				<div
				  style={{
					background: `url(${listing.imageUrls[0]}) center no-repeat`,
					backgroundSize: "cover",
				  }}
				  className="h-[500px]"
				></div>
			  </SwiperSlide>
			))}
		</Swiper>
  
		<div className="max-w-full mx-auto p-6 flex flex-col gap-8 my-10">
  {offerListings && offerListings.length > 0 && (
    <div className="" key={offerListings?._id}>
      <div className="flex justify-between items-center">
        <h2 className="text-blue-800 font-bold text-3xl lg:text-5xl">Recent Offers</h2>
        <Link
          className="text-emerald-700 hover:underline text-base sm:text-lg"
          to="/search?offer=true"
        >
          Show More Offers
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {offerListings.map((listing) => (
          <ListingItem listing={listing} key={listing._id} />
        ))}
      </div>
    </div>
  )}

  {/* Rent */}
  {rentListings && rentListings.length > 0 && (
    <div className="">
      <div className="flex justify-between items-center">
        <h2 className="text-blue-800 font-bold text-3xl lg:text-5xl">Recent Rent Locations</h2>
        <Link
          className="text-emerald-700 hover:underline text-base sm:text-lg"
          to="/search?offer=true"
        >
          Show More Rent Locations
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {rentListings.map((listing) => (
          <ListingItem listing={listing} key={listing._id} />
        ))}
      </div>
    </div>
  )}

  {/* Sale */}
  {saleListings && saleListings.length > 0 && (
    <div className="">
      <div className="flex justify-between items-center">
        <h2 className="text-blue-800 font-bold text-3xl lg:text-5xl">Recent Sale Locations</h2>
        <Link
          className="text-emerald-700 hover:underline text-base sm:text-lg"
          to="/search?offer=true"
        >
          Show More Sale Locations
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {saleListings.map((listing) => (
          <ListingItem listing={listing} key={listing._id} />
        ))}
      </div>
    </div>
  )}
</div>

	  </main>
	);
}
