import React, { useRef, useState, useEffect } from "react";
import { FaMicrophone, FaVideo, FaVideoSlash, FaPhoneSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { getToken, signalOffer } from "../services/api"; // Updated import
import ErrorBoundary from "../components/ErrorBoundary";
import "../css/VideoCallPage.css";

const VideoCallPage = ({ roomId = 1 }) => {
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const [localStream, setLocalStream] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [hasPermission, setHasPermission] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    // src/components/VideoCallPage.jsx
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
            localVideoRef.current.play().catch(err => console.error("Error playing video:", err));
        }
        setHasPermission(true);
        setError(null);
        initiateCall(roomId);
    } catch (err) {
        setError("Permission denied or error accessing camera/microphone. Please allow access and try again or check browser settings.");
        console.error('Error accessing media devices:', err);
        setLocalStream(null); // Ensure localStream is null on failure
    }
};

    const initiateCall = async (roomId) => {
        if (!user || !localStream) return;

        const token = getToken();
        if (!token) {
            setError("Please log in to join the video call.");
            return;
        }

        const peerConnection = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        });

        localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

        peerConnection.ontrack = (event) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
                remoteVideoRef.current.play().catch(err => console.error("Error playing remote video:", err));
            }
        };

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                signalOffer(roomId, { candidate: event.candidate });
            }
        };

        try {
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);

            const signalingResponse = await signalOffer(roomId, { offer });
            await peerConnection.setRemoteDescription(new RTCSessionDescription(signalingResponse.answer));
        } catch (err) {
            console.error("WebRTC signaling error:", err);
            setError("Failed to initiate call. Try again later.");
        }

        return () => peerConnection.close();
    };

    useEffect(() => {
        console.log("Local stream state:", localStream);
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
        setHasPermission(false);
        setLocalStream(null);
        setError(null);
    };

    return (
        <ErrorBoundary>
            <div className="video-call-container">
                <h2 className="video-call-title">Video Call - Room {roomId}</h2>
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
                                playsInline
                            />
                            <video
                                ref={remoteVideoRef}
                                autoPlay
                                className="remote-video"
                                playsInline
                            />
                        </div>
                        <div className="controls">
                            <button onClick={toggleMute} className={`control-button ${isMuted ? "muted" : ""}`}>
                                {isMuted ? <FaMicrophone /> : <FaMicrophone />} {isMuted ? "Unmute" : "Mute"}
                            </button>
                            <button onClick={toggleVideo} className={`control-button ${isVideoOff ? "video-off" : ""}`}>
                                {isVideoOff ? <FaVideoSlash /> : <FaVideo />} {isVideoOff ? "Video On" : "Video Off"}
                            </button>
                            <button onClick={endCall} className="end-call-button">
                                <FaPhoneSlash /> End Call
                            </button>
                        </div>
                    </>
                )}
            </div>
        </ErrorBoundary>
    );
};

export default VideoCallPage;