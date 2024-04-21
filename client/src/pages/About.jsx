import { FaUser, FaBuilding, FaComments } from 'react-icons/fa';

export default function About() {
  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="py-10 px-4 max-w-6xl mx-auto flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-8 text-slate-800">About Real Estate</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md">
            <FaUser className="text-5xl text-blue-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">Expert Agents</h2>
            <p className="text-slate-700 text-center">
              Our team of experienced agents is dedicated to providing exceptional service and making the buying and selling process as smooth as possible.
            </p>
          </div>
          <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md">
            <FaBuilding className="text-5xl text-blue-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">Desirable Neighborhoods</h2>
            <p className="text-slate-700 text-center">
              We specialize in helping clients buy, sell, and rent properties in the most desirable neighborhoods.
            </p>
          </div>
          <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md">
            <FaComments className="text-5xl text-blue-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">Personalized Service</h2>
            <p className="text-slate-700 text-center">
              Our mission is to help our clients achieve their real estate goals by providing expert advice, personalized service, and a deep understanding of the local market.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
