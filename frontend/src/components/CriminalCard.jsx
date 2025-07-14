// src/components/CriminalCard.jsx
const CriminalCard = ({ criminal }) => {
  const defaultMugshot = '/images/default-mugshot.jpg'; // Place this in your public folder
  const mugshotUrl = criminal.mugshot || defaultMugshot;

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden w-full max-w-sm mx-auto">
      {/* Mugshot */}
      <img
        src={mugshotUrl}
        alt={`${criminal.name}'s mugshot`}
        loading="lazy"
        className="w-full h-48 object-cover"
      />

      {/* Criminal Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{criminal.name}</h3>
        <p className="text-sm text-gray-700">Gender: {criminal.gender}</p>
        <p className="text-sm text-gray-700">Age: {criminal.age}</p>
        <p className="text-sm text-gray-700">Crime: {criminal.crime}</p>
        <p className="text-sm text-gray-700">Status: {criminal.status}</p>
        <p className="text-sm text-gray-700">Location: {criminal.location}</p>
      </div>
    </div>
  );
};

export default CriminalCard;
