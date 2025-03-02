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
        formData.append("filePath", file);
        formData.append("fileType", file.type);
        formData.append("uploadedBy", user.id);

        try {
            await uploadMaterial(formData);
            setUploadMessage("File uploaded successfully!");
            setFile(null);
            fetchMaterials();
        } catch (err) {
            console.error("Upload error:", err);
            setUploadMessage(
                `Upload failed: ${
                    err.message === "No token found. Please log in."
                        ? "Please log in first"
                        : err.response?.data?.message || "Server error"
                }`
            );
        }
    };

    const fetchMaterials = async () => {
        try {
            const data = await getUserMaterials();
            // Filter materials based on user role and ownership
            const filteredMaterials = user.role === "teacher" 
                ? data 
                : data.filter(material => material.uploadedBy === user.id);
            setMaterials(filteredMaterials || []);
            setUploadMessage("");
        } catch (err) {
            console.error("Error fetching materials:", err);
            setUploadMessage(
                `Failed to load materials: ${
                    err.message === "No token found. Please log in."
                        ? "Please log in first"
                        : err.response?.data?.message || "Server error"
                }`
            );
        }
    };

    const getFileName = (filePath) => {
        if (!filePath) return "Unknown";
        return filePath.split(/[\\/]/).pop();
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
                            value={file ? undefined : ""}
                        />
                        <button type="submit" disabled={!user || !file}>
                            Upload Material
                        </button>
                    </form>
                    {uploadMessage && (
                        <p
                            className={
                                uploadMessage.includes("failed") || uploadMessage.includes("error")
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
                                        href={`http://localhost:5000/uploads/${getFileName(material.filePath)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {getFileName(material.filePath)}
                                    </a>
                                    <p>
                                        Uploaded on:{" "}
                                        {material.uploadedAt
                                            ? new Date(material.uploadedAt).toLocaleDateString()
                                            : "Unknown"}
                                    </p>
                                    <p>Type: {material.fileType || "Unknown"}</p>
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