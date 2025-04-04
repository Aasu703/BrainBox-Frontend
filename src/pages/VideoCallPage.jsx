import React, { useRef, useState, useEffect } from "react";
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhoneSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { getToken, signalOffer } from "../services/api";
import ErrorBoundary from "../components/ErrorBoundary";
import "../css/VideoCallPage.css";

const VideoCallPage = ({ roomId = 1 }) => {
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const [localStream, setLocalStream] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [hasPermission, setHasPermission] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth();

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
                localVideoRef.current.srcObject = stream;
                localVideoRef.current.play().catch(err => console.error("Error playing local video:", err));
            }
            setHasPermission(true);
            setError(null);
            await initiateCall(roomId, stream);
        } catch (err) {
            setError("Permission denied or error accessing camera/microphone. Please allow access and try again.");
            console.error("Error accessing media devices:", err);
            setLocalStream(null);
        }
    };

    const initiateCall = async (roomId, stream) => {
        if (!user || !stream) {
            setError("User or stream not available.");
            return;
        }

        const token = getToken();
        if (!token) {
            setError("Please log in to join the video call.");
            return;
        }

        const peerConnection = new RTCPeerConnection({
            iceServers: [
                { urls: "stun:stun.l.google.com:19302" },
                { urls: "stun:stun1.l.google.com:19302" }, // Add more STUN servers
                // Optionally add a TURN server for better NAT traversal
                // {
                //     urls: "turn:your.turn.server:3478",
                //     username: "username",
                //     credential: "password",
                // },
            ],
        });
        peerConnectionRef.current = peerConnection;

        // Add local stream tracks to peer connection
        stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

        // Handle incoming remote stream
        peerConnection.ontrack = (event) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
                remoteVideoRef.current.play().catch(err => console.error("Error playing remote video:", err));
            }
        };

        // Send ICE candidates to the remote peer via signaling
        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                signalOffer(roomId, { candidate: event.candidate }).catch(err =>
                    console.error("Error signaling ICE candidate:", err)
                );
            }
        };

        try {
            // Create and set local offer
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);

            // Signal the offer to the remote peer
            const signalingResponse = await signalOffer(roomId, { offer });
            if (signalingResponse.answer) {
                await peerConnection.setRemoteDescription(new RTCSessionDescription(signalingResponse.answer));
            }
        } catch (err) {
            console.error("WebRTC signaling error:", err);
            setError("You are alone on the call.");
        }
    };

    // Cleanup on component unmount or call end
    const cleanup = () => {
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
        }
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }
        setLocalStream(null);
        setHasPermission(false);
        setError(null);
    };

    useEffect(() => {
        return () => cleanup(); // Cleanup on unmount
    }, []);

    const toggleMute = () => {
        if (localStream) {
            localStream.getAudioTracks().forEach(track => (track.enabled = !track.enabled));
            setIsMuted(prev => !prev);
        }
    };

    const toggleVideo = () => {
        if (localStream) {
            localStream.getVideoTracks().forEach(track => (track.enabled = !track.enabled));
            setIsVideoOff(prev => !prev);
        }
    };

    const endCall = () => {
        cleanup();
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
                            Refresh
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
                                {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
                                {isMuted ? "Unmute" : "Mute"}
                            </button>
                            <button onClick={toggleVideo} className={`control-button ${isVideoOff ? "video-off" : ""}`}>
                                {isVideoOff ? <FaVideoSlash /> : <FaVideo />}
                                {isVideoOff ? "Video On" : "Video Off"}
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