import { useState, useEffect } from "react";
import Webcam from "react-webcam";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import useSpeechToText, { ResultType } from 'react-hook-speech-to-text';
import { Mic } from "lucide-react";

export default function RecordAnswer() {
    const [webCamEnabled, setWebCamEnabled] = useState<boolean>(false);
    const [userResponse, setUserResponse] = useState<string>('');
    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
    });

    useEffect(() => {
        results.map((result:any) => {
            setUserResponse(prevResp => prevResp + result?.transcript);
        });
    }, [results]);

    useEffect(() => {
        console.log(userResponse);
    }, [userResponse]);

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
            <Button variant="outline" className="my-10" onClick={isRecording ? stopSpeechToText : startSpeechToText}>
                {isRecording ? (
                    <h2 className="flex gap-2">
                        <Mic />
                        {'Stop Recording'}
                    </h2>
                ) : (
                    'Record Answer'
                )}
            </Button>
            <Button onClick={() => console.log(userResponse)}>
                Show User Answer
            </Button>
            {/* console.log({userResponse}) */}
        </div>
    );
}
