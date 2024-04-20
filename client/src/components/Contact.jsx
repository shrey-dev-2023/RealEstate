/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

export default function Contact({ listing, setContact, listingId }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setmessage] = useState("");

  useEffect(() => {
    const fetchLandLord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandLord();
  }, [listing.userRef]);

  const sendMessage = async () => {
    try {
      console.log(listingId);
      const res = await fetch(`/api/listing/contact`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId,
          message,
        }),
      });
      const data = await res?.json();
      console.log(data);
      if (data?.success) {
        alert("Your message is sent successfully");
        setContact();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {landlord && (
        <div className="flex-col flex gap-2">
          <p>
            Contact{" "}
            <span
              className="font-semibold
						"
            >
              {landlord.username}
            </span>{" "}
            for <span className="lowercase font-semibold ">{listing.name}</span>
          </p>
          <textarea
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={(e) => {
              setmessage(e.target.value);
            }}
            placeholder="Message for Landlord"
            className="w-full border p-3 rounded-lg "
          ></textarea>
          <div
            className="bg-blue-900 text-white text-center p-3 uppercase rounded-lg hover:opacity-70 "
            onClick={sendMessage}
          >
            Send Message
          </div>
        </div>
      )}
    </div>
  );
}
