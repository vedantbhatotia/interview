import { useState, useEffect } from "react";
import Webcam from "react-webcam";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

export default function RecordAnswer() {
    const [webCamEnabled, setWebCamEnabled] = useState<boolean>(false);
    const { transcript, browserSupportsSpeechRecognition } = useSpeechRecognition();
    useEffect(() => {
        if (!browserSupportsSpeechRecognition) {
        }
    }, [browserSupportsSpeechRecognition]);

    const startListening = () => SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
    const stopListening = () => SpeechRecognition.stopListening();

    return (
        <div className="flex items-center justify-center flex-col text-white">
            <div className="flex flex-col mt-20 justify-center items-center bg-black rounded-lg p-5">
                {!webCamEnabled && (
                    <Image 
                        src="https://img.freepik.com/premium-vector/vector-cartoon-web-camera-illustration_574806-2826.jpg" 
                        width={200} 
                        height={200} 
                        className="abs" 
                        alt="web-cam image" 
                    />
                )}
                {webCamEnabled && (
                    <Webcam 
                        style={{
                            height: 300,
                            width: '100%',
                            zIndex: 10,
                        }} 
                        mirrored={true}
                    />
                )}
                <button 
                    onClick={() => setWebCamEnabled(prevState => !prevState)} 
                    className="mt-5 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    {webCamEnabled ? 'Disable' : 'Enable'} Webcam
                </button>
            </div>
            <Button variant="outline" className="my-10" onClick={startListening}>
                Record Answer
            </Button>
            {/* <button 
                onClick={stopListening} 
                className="mt-5 px-4 py-2 bg-red-500 text-white rounded"
            >
                Stop Listening
            </button> */}
            console.log({transcript});
            <div className="main-content">
                {transcript}
            </div>
        </div>
    );
}
