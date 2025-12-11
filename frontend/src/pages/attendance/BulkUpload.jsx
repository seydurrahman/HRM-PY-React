import { useState } from "react";
import api from "../../lib/api";

const BulkUpload = () => {
  const [file, setFile] = useState(null);

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post("/attendance-upload/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert("File uploaded successfully!");
  };

  return (
    <div>
      <h1 className="text-xl font-semibold">Attendance Bulk Upload</h1>

      <div className="bg-white p-4 rounded-xl shadow-sm mt-4 space-y-4">

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full border p-2 rounded"
        />

        <button
          onClick={uploadFile}
          className="bg-slate-900 text-white px-4 py-2 rounded"
        >
          Upload CSV
        </button>

      </div>
    </div>
  );
};

export default BulkUpload;
