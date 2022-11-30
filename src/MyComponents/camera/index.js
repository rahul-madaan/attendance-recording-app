import React, { useState, useRef } from "react";
import Measure from "react-measure";
import { useUserMedia } from "../hooks/use-user-media";
import { useCardRatio } from "../hooks/use-card-ratio";
import { useOffsets } from "../hooks/use-offsets";
import {
    Video,
    Canvas,
    Wrapper,
    Container,
    Flash,
    Overlay,
    Button
} from "./styles";

const CAPTURE_OPTIONS = {
    audio: false,
    video: { facingMode: "user" }
};

export function Camera({ onCapture, onClear }) {
    const canvasRef = useRef();
    const videoRef = useRef();

    const [container, setContainer] = useState({ width: 0, height: 0 });
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [isCanvasEmpty, setIsCanvasEmpty] = useState(true);
    const [isFlashing, setIsFlashing] = useState(false);

    const mediaStream = useUserMedia(CAPTURE_OPTIONS);
    const [aspectRatio, calculateRatio] = useCardRatio(1.586);
    const offsets = useOffsets(
        videoRef.current && videoRef.current.videoWidth,
        videoRef.current && videoRef.current.videoHeight,
        container.width,
        container.height
    );

    if (mediaStream && videoRef.current && !videoRef.current.srcObject) {
        videoRef.current.srcObject = mediaStream;
    }

    function handleResize(contentRect) {
        setContainer({
            width: contentRect.bounds.width,
            height: Math.round(contentRect.bounds.width / aspectRatio)
        });
    }

    function handleCanPlay() {
        calculateRatio(videoRef.current.videoHeight, videoRef.current.videoWidth);
        setIsVideoPlaying(true);
        videoRef.current.play();
    }

    function handleCapture() {
        const context = canvasRef.current.getContext("2d");

        context.drawImage(
            videoRef.current,
            offsets.x,
            offsets.y,
            container.width,
            container.height,
            0,
            0,
            container.width,
            container.height
        );

        canvasRef.current.toBlob(blob => onCapture(blob), "image/jpeg", 1);
        canvasRef.current.toBlob(
            blob => {
                const anchor = document.createElement('a');
                anchor.download = 'my-file-name.jpg'; // optional, but you can give the file a name
                anchor.href = URL.createObjectURL(blob);

                // anchor.click(); // ✨ magic!

                URL.revokeObjectURL(anchor.href); // remove it from memory and save on memory! 😎
            },
            'image/jpeg',
            1,
        );
        setIsCanvasEmpty(false);
        setIsFlashing(true);
    }

    function handleClear() {
        const context = canvasRef.current.getContext("2d");
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        setIsCanvasEmpty(true);
        onClear();
    }

    if (!mediaStream) {
        return null;
    }

    return (
        <Measure bounds onResize={handleResize}>
            {({ measureRef }) => (
                <Wrapper>
                    <Container
                        ref={measureRef}
                        maxHeight={videoRef.current && videoRef.current.videoHeight}
                        maxWidth={videoRef.current && videoRef.current.videoWidth}
                        style={{
                            height: `${container.height}px`
                        }}
                    >
                        <Video
                            ref={videoRef}
                            hidden={!isVideoPlaying}
                            onCanPlay={handleCanPlay}
                            autoPlay
                            playsInline
                            muted
                            style={{
                                top: `-${offsets.y}px`,
                                left: `-${offsets.x}px`
                            }}
                        />

                        <Overlay hidden={!isVideoPlaying} />

                        <Canvas
                            id='image-canvas'
                            ref={canvasRef}
                            width={container.width}
                            height={container.height}
                        />

                        <Flash
                            flash={isFlashing}
                            onAnimationEnd={() => setIsFlashing(false)}
                        />
                    </Container>

                    {isVideoPlaying && (
                        <Button onClick={isCanvasEmpty ? handleCapture : handleClear}>
                            {isCanvasEmpty ? "Take a picture" : "Take another picture"}
                        </Button>
                    )}
                </Wrapper>
            )}
        </Measure>
    );
}
