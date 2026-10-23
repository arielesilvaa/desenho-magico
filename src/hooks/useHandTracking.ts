import { useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';

type HandTrackingResult = {
    x: number;
    y: number;
    visible: boolean;
    handCount: number;
};

export function useHandTracking(videoElement: HTMLVideoElement | null) {
    const [hand, setHand] = useState<HandTrackingResult>({
        x: 0,
        y: 0,
        visible: false,
        handCount: 0,
    });

    const handLandmarkerRef = useRef<HandLandmarker | null>(null);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        if (!videoElement) return;

        let cancelled = false;

        const initialize = async () => {
            const vision = await FilesetResolver.forVisionTasks(
                'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
            );

            const landmarker = await HandLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath:
                        'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
                    delegate: 'GPU',
                },
                runningMode: 'VIDEO',
                numHands: 2,
            });

            handLandmarkerRef.current = landmarker;

            const detect = () => {
                if (!cancelled && videoElement && handLandmarkerRef.current) {
                    const result = handLandmarkerRef.current.detectForVideo(
                        videoElement,
                        performance.now()
                    );

                    const firstHand = result.landmarks?.[0];
                    const handCount = result.landmarks?.length ?? 0;

                    if (firstHand) {
                        const indexTip = firstHand[8];
                        const x = indexTip.x * videoElement.videoWidth;
                        const y = indexTip.y * videoElement.videoHeight;

                        setHand({
                            x,
                            y,
                            visible: true,
                            handCount,
                        });
                    } else {
                        setHand({
                            x: 0,
                            y: 0,
                            visible: false,
                            handCount,
                        });
                    }
                }

                rafRef.current = requestAnimationFrame(detect);
            };

            detect();
        };

        initialize();

        return () => {
            cancelled = true;
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            handLandmarkerRef.current?.close();
        };
    }, [videoElement]);

    return hand;
}