import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext"; // For user authentication
import { uploadMaterial, getUserMaterials } from "../../services/api"; // New API functions
import "./Materials.css"; // Ensure your CSS file is imported

const Materials = () => {
    const [file, setFile] = useState(null);
    const [uploadMessage, setUploadMessage] = useState("");
    const [materials, setMaterials] = useState([]);
    const { user, loading, error } = useAuth(); // Get user, loading, and error

    // Fetch user's materials on mount
    useEffect(() => {
        if (user && !loading) {
            fetchMaterials();
        }
    }, [user, loading]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file || !user) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await uploadMaterial(formData);
            setUploadMessage("File uploaded successfully!");
            fetchMaterials(); // Refresh the list
        } catch (err) {
            setUploadMessage(`Upload failed: ${err.message || "Try again."}`);
        }
    };

    const fetchMaterials = async () => {
        try {
            const data = await getUserMaterials();
            setMaterials(data);
        } catch (err) {
            console.error("Error fetching materials:", err);
            setUploadMessage(`Failed to load materials: ${err.message || "Try again."}`);
        }
    };

    return (
        <div className="materials-container">
            <h2>Materials</h2>
            {error && <p className="error-message">{error}</p>}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <form onSubmit={handleUpload} className="upload-form">
                        <input
                            type="file"
                            onChange={handleFileChange}
                            accept=".pdf,.jpg,.png" // Adjust file types as needed
                            disabled={!user}
                        />
                        <button type="submit" disabled={!user || !file}>Upload File</button>
                    </form>
                    {uploadMessage && <p className="message">{uploadMessage}</p>}
                    <div className="materials-list">
                        <h3>Uploaded Materials</h3>
                        {materials.length === 0 ? (
                            <p>No materials uploaded yet.</p>
                        ) : (
                            materials.map((material) => (
                                <div key={material.id} className="material-item">
                                    <a
                                        href={`http://localhost:5000/uploads/${material.filePath.split('/').pop()}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {material.fileName || "Material File"}
                                    </a>
                                    <p>Uploaded on: {new Date(material.uploadedAt).toLocaleDateString()}</p>
                                    <p>Type: {material.fileType}</p>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Materials;