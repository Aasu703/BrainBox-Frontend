import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { uploadMaterial, getUserMaterials } from "../../services/api";
import "./Materials.css";

const Materials = () => {
    const [file, setFile] = useState(null);
    const [uploadMessage, setUploadMessage] = useState("");
    const [materials, setMaterials] = useState([]);
    const { user, loading, error: authError } = useAuth();

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
        if (!file || !user) {
            setUploadMessage("Please select a file and ensure you are logged in.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("Material_Type", file.type);

        try {
            await uploadMaterial(formData);
            setUploadMessage("File uploaded successfully!");
            fetchMaterials();
        } catch (err) {
            console.error("Upload error:", err.response?.status, err.response?.data || err.message);
            setUploadMessage(`Upload failed: ${err.response?.status === 404 ? "Upload endpoint not found." : err.response?.data?.error || err.message || "Try again."}`);
        }
    };

    const fetchMaterials = async () => {
        try {
            const data = await getUserMaterials();
            setMaterials(data || []);
            setUploadMessage(""); // Clear message on success
        } catch (err) {
            console.error("Error fetching materials:", err.response?.status, err.response?.data || err.message);
            setUploadMessage(`Failed to load materials: ${err.response?.status === 404 ? "Materials endpoint not found." : err.response?.data?.error || err.message || "Try again."}`);
        }
    };

    return (
        <div className="materials-container">
            <h2>Study Materials</h2>
            {authError && <p className="error-message">{authError}</p>}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <form onSubmit={handleUpload} className="upload-form">
                        <input
                            type="file"
                            onChange={handleFileChange}
                            accept=".pdf,.jpg,.png"
                            disabled={!user}
                        />
                        <button type="submit" disabled={!user || !file}>
                            Upload Material
                        </button>
                    </form>
                    {uploadMessage && (
                        <p
                            className={
                                uploadMessage.includes("failed")
                                    ? "error-message"
                                    : "success-message"
                            }
                        >
                            {uploadMessage}
                        </p>
                    )}
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
                                        {material.fileName || material.filePath.split('/').pop() || "Material File"}
                                    </a>
                                    <p>
                                        Uploaded on:{" "}
                                        {material.Uploaded_Date
                                            ? new Date(material.Uploaded_Date).toLocaleDateString()
                                            : "Unknown"}
                                    </p>
                                    <p>Type: {material.Material_Type || "Unknown"}</p>
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