import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../context";
import Select from "react-select";
import axios from "axios";

export default function Admin() {
  const [freeStudents, setFreeStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(""); // For success or error messages
  const { fetchAdvisers, fetchStudents, studentsData, adviserData } =
    useContext(GlobalContext);

  useEffect(() => {
    const loadData = async () => {
      await fetchStudents();
      await fetchAdvisers();
      setLoading(false);
    };
    loadData();
  }, []);

  const [assignedSupervisors, setAssignedSupervisors] = useState([
    {
      selectedAdviser: "",
      selectedStudents: [],
    },
  ]);

  useEffect(() => {
    const freeStudentsList = studentsData.filter(
      (student) => student.supervisor === ""
    );
    setFreeStudents(freeStudentsList);
  }, [studentsData]);

  const handleDeleteDay = (index) => {
    const updatedSupervisors = assignedSupervisors.filter(
      (_, i) => i !== index
    );
    setAssignedSupervisors(updatedSupervisors);
  };

  const handleAddDay = () => {
    setAssignedSupervisors([
      ...assignedSupervisors,
      { selectedAdviser: "", selectedStudents: [] },
    ]);
  };

  const getAvailableStudents = () => {
    const selectedStudentIds = assignedSupervisors.flatMap((entry) =>
      entry.selectedStudents.map((student) => student.id)
    );
    return freeStudents.filter(
      (student) => !selectedStudentIds.includes(student._id)
    );
  };

  const handleSubmit = async () => {
    const payload = assignedSupervisors.map((entry) => ({
      adviser: entry.selectedAdviser,
      students: entry.selectedStudents.map((student) => student.name),
    }));

    try {
      const res = await axios.put(
        "http://127.0.0.1:4000/api/ticket/user/supervisor",
        payload
      );
      setMessage("Supervisors assigned successfully!"); // Success message
      console.log("Supervisors assigned successfully:", res.data);
    } catch (error) {
      setMessage("Error submitting supervisors. Please try again."); // Error message
      console.error("Error submitting supervisors:", error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center mt-12">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Hello, Admin</h1>

        {assignedSupervisors.map((entry, index) => (
          <div key={index} className="space-y-4">
            <div className="flex items-center justify-between">
              <select
                id="adviser"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                aria-label="Select an adviser"
                value={entry.selectedAdviser}
                onChange={(e) => {
                  const updatedSupervisors = [...assignedSupervisors];
                  updatedSupervisors[index].selectedAdviser = e.target.value;
                  setAssignedSupervisors(updatedSupervisors);
                }}
              >
                <option value="">Select an Adviser</option>
                {adviserData.map((adviser) => (
                  <option key={adviser._id} value={adviser.username}>
                    {adviser.username}
                  </option>
                ))}
              </select>

              <button
                className="ml-4 px-3 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
                onClick={() => handleDeleteDay(index)}
              >
                Delete
              </button>
            </div>

            <div>
              <Select
                isMulti
                name="students"
                options={getAvailableStudents().map((student) => ({
                  value: student._id,
                  label: student.username,
                }))}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Select Free Students"
                value={entry.selectedStudents.map((student) => ({
                  value: student.id,
                  label: student.name,
                }))}
                onChange={(selected) => {
                  const updatedSupervisors = [...assignedSupervisors];
                  updatedSupervisors[index].selectedStudents = selected.map(
                    (s) => ({
                      id: s.value,
                      name: s.label,
                    })
                  );
                  setAssignedSupervisors(updatedSupervisors);
                }}
              />
            </div>
          </div>
        ))}

        <button
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          onClick={handleAddDay}
        >
          Add Another Adviser
        </button>

        <button
          className="w-full px-4 py-2 mt-4 text-white bg-green-600 rounded-lg hover:bg-green-700"
          onClick={handleSubmit}
        >
          Submit
        </button>

        {/* Display success or error message */}
        {message && (
          <div
            className={`mt-4 p-4 text-center rounded-lg ${
              message.includes("successfully")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
