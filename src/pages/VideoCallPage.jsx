import React, { useRef, useState, useEffect } from "react";
import { FaMicrophone, FaVideo, FaVideoSlash, FaPhoneSlash } from "react-icons/fa"; // Using react-icons for better visuals
import ErrorBoundary from "../components/ErrorBoundary"; // Add error boundary (create if not exists)
import "../css/VideoCallPage.css";

const VideoCallPage = () => {
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const [localStream, setLocalStream] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [hasPermission, setHasPermission] = useState(false);
    const [error, setError] = useState(null);

    // Request permission and start call
    const requestMediaPermissions = async () => {
        try {
            console.log("Requesting media permissions...");
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });
            console.log("Media stream acquired:", stream);
            setLocalStream(stream);
            if (localVideoRef.current) {
                console.log("Setting local video stream...");
                localVideoRef.current.srcObject = stream;
                localVideoRef.current.play().catch(err => console.error("Error playing video:", err)); // Ensure video plays
            }
            setHasPermission(true);
            setError(null);
        } catch (err) {
            setError("Permission denied or error accessing camera/microphone. Please allow access and try again.");
            console.error('Error accessing media devices:', err);
        }
    };

    useEffect(() => {
        console.log("Local stream state:", localStream);
        // Clean up streams on unmount
        return () => {
            if (localStream) {
                console.log("Cleaning up local stream...");
                localStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [localStream]);

    const toggleMute = () => {
        if (localStream) {
            localStream.getAudioTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsMuted(!isMuted);
        }
    };

    const toggleVideo = () => {
        if (localStream) {
            localStream.getVideoTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsVideoOff(!isVideoOff);
        }
    };

    const endCall = () => {
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
        }
        window.close();
    };

    // Placeholder for remote stream (to be implemented with WebRTC)
    useEffect(() => {
        if (!hasPermission) return;

        const peerConnection = new RTCPeerConnection();
        
        if (localStream) {
            localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
        }

        peerConnection.ontrack = (event) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
                remoteVideoRef.current.play().catch(err => console.error("Error playing remote video:", err)); // Ensure remote video plays
            }
        };

        return () => {
            if (peerConnection) {
                peerConnection.close();
            }
        };
    }, [hasPermission, localStream]);

    return (
        <div className="video-call-container">
            <h2 className="video-call-title">Video Call</h2>
            {!hasPermission && !error && (
                <div className="permission-prompt">
                    <p>Please grant camera and microphone permissions to start the video call.</p>
                    <button onClick={requestMediaPermissions} className="permission-button">
                        Allow Camera & Mic
                    </button>
                </div>
            )}
            {error && (
                <div className="error-message">
                    <p>{error}</p>
                    <button onClick={requestMediaPermissions} className="permission-button">
                        Try Again
                    </button>
                </div>
            )}
            {hasPermission && (
                <>
                    <div className="video-grid">
                        <video
                            ref={localVideoRef}
                            autoPlay
                            muted={true}
                            className={`local-video ${isVideoOff ? "video-off" : ""}`}
                            playsInline // Ensure inline playback on mobile
                        />
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            className="remote-video"
                            playsInline // Ensure inline playback on mobile
                        />
                    </div>
                    <div className="controls">
                        <button onClick={toggleMute} className={`control-button ${isMuted ? "muted" : ""}`}>
                            {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />} Mute
                        </button>
                        <button onClick={toggleVideo} className={`control-button ${isVideoOff ? "video-off" : ""}`}>
                            {isVideoOff ? <FaVideoSlash /> : <FaVideo />} Video
                        </button>
                        <button onClick={endCall} className="end-call-button">
                            <FaPhoneSlash /> End Call
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default VideoCallPage;