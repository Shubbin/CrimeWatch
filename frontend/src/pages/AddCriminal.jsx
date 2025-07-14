import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const AddCriminal = () => {
  const navigate = useNavigate();

  const [criminal, setCriminal] = useState({
    name: "",
    dob: "",
    gender: "",
    crimeCommitted: "",
    dateOfCrime: "",
    dateOfArrest: "",
    dateReleased: "",
    address: "",
    arrestingOfficer: "",
    status: "detained",
    phoneNumber: "",
    maritalStatus: "",
    nextOfKin: "",
    nextOfKinRelationship: "",
    nextOfKinRelationshipOther: "",
    nextOfKinAddress: "",
    nextOfKinPhoneNumber: "",
    mugshot: null,
    category: "normal",
    type: "",
    custodyStatus: "in custody",
  });

  const [loading, setLoading] = useState(false);
  const [mugshotPreview, setMugshotPreview] = useState(null);

  useEffect(() => {
    if (criminal.mugshot) {
      const url = URL.createObjectURL(criminal.mugshot);
      setMugshotPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setMugshotPreview(null);
    }
  }, [criminal.mugshot]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCriminal((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCriminal((prev) => ({ ...prev, mugshot: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      Object.entries(criminal).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          if (key === "nextOfKinRelationship" && value === "others") {
            formData.append("nextOfKinRelationship", criminal.nextOfKinRelationshipOther);
          } else if (key !== "nextOfKinRelationshipOther" && key !== "mugshot") {
            formData.append(key, value);
          }
        }
      });

      if (criminal.mugshot) {
        formData.append("mugshot", criminal.mugshot);
      }

      await axios.post("http://localhost:8000/api/criminals", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Criminal record created successfully!");
      navigate("/viewcriminals");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl rounded-xl p-10 text-gray-100">
        <h2 className="text-4xl font-extrabold mb-8 tracking-wide text-cyan-400 drop-shadow-lg">
          Add Criminal Record
        </h2>

        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="space-y-10"
          autoComplete="off"
        >
          {/* Personal Info Section */}
          <section>
            <h3 className="text-2xl font-semibold mb-4 border-b border-cyan-500 pb-2">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FloatingInput
                label="Full Name"
                name="name"
                value={criminal.name}
                onChange={handleChange}
                required
              />
              <FloatingInput
                label="Date of Birth"
                type="date"
                name="dob"
                value={criminal.dob}
                onChange={handleChange}
              />
              <FloatingSelect
                label="Gender"
                name="gender"
                value={criminal.gender}
                onChange={handleChange}
                options={[
                  { value: "", text: "Select Gender" },
                  { value: "male", text: "Male" },
                  { value: "female", text: "Female" },
                  { value: "other", text: "Other" },
                ]}
              />
            </div>
          </section>

          {/* Crime Details Section */}
          <section>
            <h3 className="text-2xl font-semibold mb-4 border-b border-cyan-500 pb-2">
              Crime Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FloatingInput
                label="Crime Committed"
                name="crimeCommitted"
                value={criminal.crimeCommitted}
                onChange={handleChange}
                required
              />
              <FloatingInput
                label="Date of Crime"
                type="date"
                name="dateOfCrime"
                value={criminal.dateOfCrime}
                onChange={handleChange}
                required
              />
              <FloatingInput
                label="Date of Arrest"
                type="date"
                name="dateOfArrest"
                value={criminal.dateOfArrest}
                onChange={handleChange}
              />
            </div>

            {criminal.status === "released" && (
              <div className="mt-6 max-w-sm">
                <FloatingInput
                  label="Date Released"
                  type="date"
                  name="dateReleased"
                  value={criminal.dateReleased}
                  onChange={handleChange}
                />
              </div>
            )}

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <FloatingSelect
                label="Status"
                name="status"
                value={criminal.status}
                onChange={handleChange}
                options={[
                  { value: "detained", text: "Detained" },
                  { value: "bailed", text: "Bailed" },
                  { value: "convicted", text: "Convicted" },
                  { value: "released", text: "Released" },
                ]}
              />

              <FloatingSelect
                label="Category"
                name="category"
                value={criminal.category}
                onChange={handleChange}
                options={[
                  { value: "", text: "Select Category" },
                  { value: "wanted", text: "Wanted" },
                  { value: "dangerous", text: "Dangerous" },
                  { value: "normal", text: "Normal" },
                ]}
              />

              <FloatingSelect
                label="Crime Type"
                name="type"
                value={criminal.type}
                onChange={handleChange}
                required
                options={[
                  { value: "", text: "Select Crime Type" },
                  { value: "rape", text: "Rape" },
                  { value: "homicide", text: "Homicide" },
                  { value: "fraud", text: "Fraud" },
                  { value: "assault", text: "Assault" },
                  { value: "robbery", text: "Robbery" },
                  { value: "kidnap", text: "Kidnap" },
                  { value: "other", text: "Other" },
                ]}
              />
            </div>
          </section>

          {/* Custody and Contact Section */}
          <section>
            <h3 className="text-2xl font-semibold mb-4 border-b border-cyan-500 pb-2">
              Custody & Contact
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FloatingSelect
                label="Custody Status"
                name="custodyStatus"
                value={criminal.custodyStatus}
                onChange={handleChange}
                options={[
                  { value: "", text: "Select Custody Status" },
                  { value: "in custody", text: "In Custody" },
                  { value: "escaped", text: "Escaped" },
                  { value: "on bail", text: "On Bail" },
                  { value: "released", text: "Released" },
                  { value: "convicted", text: "Convicted" },
                  { value: "detained", text: "Detained" },
                ]}
              />

              <FloatingInput
                label="Phone Number"
                name="phoneNumber"
                value={criminal.phoneNumber}
                onChange={handleChange}
              />

              <FloatingInput
                label="Arresting Officer ID"
                name="arrestingOfficer"
                value={criminal.arrestingOfficer}
                onChange={handleChange}
              />
            </div>

            <FloatingInput
              label="Address"
              name="address"
              value={criminal.address}
              onChange={handleChange}
              className="mt-6"
            />
          </section>

          {/* Next of Kin Section */}
          <section>
            <h3 className="text-2xl font-semibold mb-4 border-b border-cyan-500 pb-2">
              Next of Kin
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FloatingInput
                label="Next of Kin Name"
                name="nextOfKin"
                value={criminal.nextOfKin}
                onChange={handleChange}
              />
              <FloatingSelect
                label="Relationship"
                name="nextOfKinRelationship"
                value={criminal.nextOfKinRelationship}
                onChange={handleChange}
                options={[
                  { value: "", text: "Select Relationship" },
                  { value: "family", text: "Family" },
                  { value: "friend", text: "Friend" },
                  { value: "colleague", text: "Colleague" },
                  { value: "others", text: "Others" },
                ]}
              />

              {criminal.nextOfKinRelationship === "others" && (
                <FloatingInput
                  label="Specify Relationship"
                  name="nextOfKinRelationshipOther"
                  value={criminal.nextOfKinRelationshipOther}
                  onChange={handleChange}
                  required
                />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <FloatingInput
                label="Next of Kin Address"
                name="nextOfKinAddress"
                value={criminal.nextOfKinAddress}
                onChange={handleChange}
              />
              <FloatingInput
                label="Next of Kin Phone Number"
                name="nextOfKinPhoneNumber"
                value={criminal.nextOfKinPhoneNumber}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* Mugshot Upload Section */}
          <section>
            <h3 className="text-2xl font-semibold mb-4 border-b border-cyan-500 pb-2">
              Mugshot Upload
            </h3>

            <div className="flex items-center space-x-6">
              <label
                htmlFor="mugshot-upload"
                className="cursor-pointer bg-cyan-600 hover:bg-cyan-700 transition text-white px-6 py-3 rounded shadow-md flex items-center gap-2 select-none"
              >
                Upload Image
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 12v8m0-8l3 3m-3-3l-3 3M4 12v-4a3 3 0 013-3h10a3 3 0 013 3v4"
                  />
                </svg>
              </label>
              <input
                id="mugshot-upload"
                type="file"
                name="mugshot"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {mugshotPreview ? (
                <img
                  src={mugshotPreview}
                  alt="Mugshot preview"
                  className="h-24 w-24 object-cover rounded-lg shadow-lg border-2 border-cyan-500"
                />
              ) : (
                <div className="h-24 w-24 rounded-lg border-2 border-dashed border-cyan-500 flex items-center justify-center text-cyan-500 text-sm font-medium select-none">
                  No Image Selected
                </div>
              )}
            </div>
          </section>

          {/* Buttons */}
          <section className="flex justify-between items-center pt-6 border-t border-cyan-600">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="text-cyan-400 hover:text-cyan-600 font-semibold flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-cyan-500 disabled:bg-cyan-300 text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-cyan-600 transition shadow-lg"
            >
              {loading ? "Saving..." : "Add Criminal"}
            </button>
          </section>
        </form>
      </div>
    </div>
  );
};

// Floating input component with animated label
const FloatingInput = ({ label, type = "text", name, value, onChange, required, className }) => {
  return (
    <div className={`relative z-0 w-full group ${className}`}>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete="off"
        className="block py-2.5 px-0 w-full text-gray-300 bg-transparent border-0 border-b-2 border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-cyan-400 peer"
        placeholder=" "
      />
      <label
        htmlFor={name}
        className="absolute text-gray-500 text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 cursor-text"
      >
        {label}{required ? " *" : ""}
      </label>
    </div>
  );
};

const FloatingSelect = ({ label, name, value, onChange, options, required }) => {
  return (
    <div className="relative z-0 w-full group">
      <select
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        required={required}
        className="block py-2.5 px-0 w-full text-gray-300 bg-transparent border-0 border-b-2 border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-cyan-400 peer"
      >
        {options.map(({ value: val, text }) => (
          <option key={val} value={val}>
            {text}
          </option>
        ))}
      </select>
      <label
        htmlFor={name}
        className="absolute text-gray-500 text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:scale-75 peer-focus:-translate-y-6 cursor-pointer"
      >
        {label}
      </label>
    </div>
  );
};

export default AddCriminal;
