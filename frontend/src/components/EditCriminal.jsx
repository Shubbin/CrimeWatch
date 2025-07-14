import { useParams, useNavigate } from "react-router-dom"; 
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const EditCriminal = () => {
  const { id } = useParams();
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
    mugshotUrl: "", 
    category: "normal",
    type: "",
    custodyStatus: "in custody",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchCriminal = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:8000/api/criminals/${id}`, { withCredentials: true });
        const data = res.data;

        setCriminal({
          name: data.name || "",
          dob: data.dob ? data.dob.slice(0,10) : "",
          gender: data.gender || "",
          crimeCommitted: data.crimeCommitted || "",
          dateOfCrime: data.dateOfCrime ? data.dateOfCrime.slice(0,10) : "",
          dateOfArrest: data.dateOfArrest ? data.dateOfArrest.slice(0,10) : "",
          dateReleased: data.dateReleased ? data.dateReleased.slice(0,10) : "",
          address: data.address || "",
          arrestingOfficer: data.arrestingOfficer || "",
          status: data.status || "detained",
          phoneNumber: data.phoneNumber || "",
          maritalStatus: data.maritalStatus || "",
          nextOfKin: data.nextOfKin || "",
          nextOfKinRelationship: data.nextOfKinRelationship || "",
          nextOfKinRelationshipOther: data.nextOfKinRelationshipOther || "",
          nextOfKinAddress: data.nextOfKinAddress || "",
          nextOfKinPhoneNumber: data.nextOfKinPhoneNumber || "",
          mugshot: null,
          mugshotUrl: data.mugshotUrl || "", // assuming your backend provides this
          category: data.category || "normal",
          type: data.type || "",
          custodyStatus: data.custodyStatus || "in custody",
        });
      } catch (error) {
        toast.error("Failed to fetch criminal data");
      } finally {
        setLoading(false);
      }
    };
    fetchCriminal();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCriminal(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setCriminal(prev => ({ ...prev, mugshot: e.target.files[0], mugshotUrl: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(criminal).forEach(([key, value]) => {
        if (key === "mugshot" && value) {
          formData.append("mugshot", value);
        } else if (key === "nextOfKinRelationship" && value === "others") {
          formData.append("nextOfKinRelationship", criminal.nextOfKinRelationshipOther);
        } else if (key !== "nextOfKinRelationshipOther" && key !== "mugshotUrl" && value !== null && value !== "") {
          formData.append(key, value);
        }
      });

      await axios.put(`http://localhost:8000/api/criminals/${id}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Criminal record updated successfully");
      navigate("/viewcriminals");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update criminal");
    }
    setSubmitting(false);
  };

  if (loading) return <p>Loading criminal data...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded mt-8">
      <h1 className="text-3xl font-bold mb-6">Edit Criminal Record</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
        {/* Example for a few fields, you must mirror all inputs from AddCriminal */}
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={criminal.name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <label>Date of Birth</label>
        <input
          type="date"
          name="dob"
          value={criminal.dob}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <select
          name="gender"
          value={criminal.gender}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {/* Continue all other fields exactly as in AddCriminal */}
        {/* ... */}
        <label>Mugshot Upload:</label>
        {criminal.mugshotUrl && !criminal.mugshot && (
          <div className="mb-2">
            <img
              src={criminal.mugshotUrl}
              alt="Current Mugshot"
              className="w-32 h-32 object-cover rounded"
            />
          </div>
        )}
        <input
          type="file"
          name="mugshot"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {submitting ? "Updating..." : "Update Criminal"}
        </button>
      </form>
    </div>
  );
};

export default EditCriminal;
