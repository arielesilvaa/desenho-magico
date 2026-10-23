import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export type CameraViewHandle = {
    video: HTMLVideoElement | null;
};

const CameraView = forwardRef<CameraViewHandle>((_, ref) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useImperativeHandle(ref, () => ({
        video: videoRef.current,
    }));

    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: 'user',
                        width: { ideal: 1280 },
                        height: { ideal: 720 },
                    },
                    audio: false,
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error('Erro ao acessar a câmera:', error);
            }
        };

        startCamera();

        return () => {
            const stream = videoRef.current?.srcObject as MediaStream | null;
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    return (
        <div className="camera-layer">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="camera-video"
            />
        </div>
    );
});

export default CameraView;