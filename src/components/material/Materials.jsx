// components/Materials.jsx
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import "./Materials.css";

const Materials = () => {
    const { user } = useAuth();
    const [file, setFile] = useState(null);
    const [uploadMessage, setUploadMessage] = useState("");
    const [materials, setMaterials] = useState([]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("userId", user.id); // Assuming user has an id
        formData.append("type", file.type); // Optional: file type (e.g., image/pdf)

        try {
            const response = await fetch("/api/material/upload", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            setUploadMessage("File uploaded successfully!");
            fetchMaterials(); // Refresh the list of materials
        } catch (error) {
            setUploadMessage("Upload failed: " + error.message);
        }
    };

    const fetchMaterials = async () => {
        try {
            const response = await fetch("/api/material/list");
            const data = await response.json();
            setMaterials(data);
        } catch (error) {
            console.error("Error fetching materials:", error);
        }
    };

    // Fetch materials on component mount
    React.useEffect(() => {
        fetchMaterials();
    }, []);

    return (
        <div className="materials-container">
            <h2>Materials</h2>
            <form onSubmit={handleUpload} className="upload-form">
                <input type="file" onChange={handleFileChange} accept=".pdf,.jpg,.png" />
                <button type="submit">Upload File</button>
            </form>
            {uploadMessage && <p>{uploadMessage}</p>}
            <div className="materials-list">
                <h3>Uploaded Materials</h3>
                {materials.length === 0 ? (
                    <p>No materials uploaded yet.</p>
                ) : (
                    materials.map((material) => (
                        <div key={material.id} className="material-item">
                            <a href={`/api/material/download/${material.id}`} target="_blank" rel="noopener noreferrer">
                                {material.fileName || "Material File"}
                            </a>
                            <p>Uploaded by: {material.userName || "Unknown"}</p>
                            <p>Type: {material.type}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Materials;