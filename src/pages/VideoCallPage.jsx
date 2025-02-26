import React, { useRef, useState, useEffect } from "react";
import "../css/VideoCallPage.css";

const VideoCallPage = () => {
    const localVideoRef = useRef(null);
    const [localStream, setLocalStream] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);

    useEffect(() => {
        const startCall = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });
                setLocalStream(stream);
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error("Error accessing media devices:", error);
                alert("Permission denied. Unable to access camera and microphone.");
            }
        };
        startCall();

        return () => {
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

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
        window.close(); // Close the call window
    };

    return (
        <div className="video-call-container">
            <h2>Video Call</h2>
            <div className="video-grid">
                <video
                    ref={localVideoRef}
                    autoPlay
                    muted={true}
                    className={`local-video ${isVideoOff ? "video-off" : ""}`}
                />
                {/* Add remote video if needed */}
                <video
                    ref={remoteVideoRef} // Ensure remoteVideoRef is defined
                    autoPlay
                    className="remote-video"
                />
            </div>
            <div className="controls">
                <button onClick={toggleMute} className="control-button">
                    {isMuted ? "🔇 Unmute" : "🎤 Mute"}
                </button>
                <button onClick={toggleVideo} className="control-button">
                    {isVideoOff ? "📹 Turn Video On" : "📷 Turn Video Off"}
                </button>
                <button onClick={endCall} className="end-call-button">
                    ❌ End Call
                </button>
            </div>
        </div>
    );
};

export default VideoCallPage;