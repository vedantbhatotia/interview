import { useState, useEffect } from "react";
import Webcam from "react-webcam";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import useSpeechToText, { ResultType } from 'react-hook-speech-to-text';
import { Mic } from "lucide-react";
import { toast } from "sonner";
import { chatSession } from "@/utils/geminiai";

export default function RecordAnswer({ mockInterviewQuestion, activeQuestionIndex }: any) {
    const [webCamEnabled, setWebCamEnabled] = useState<boolean>(false);
    const [userResponse, setUserResponse] = useState<string>('');
    const activeQuestion = mockInterviewQuestion && JSON.parse(mockInterviewQuestion[activeQuestionIndex]);
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
        results.map((result: any) => {
            setUserResponse(prevResp => prevResp + result?.transcript);
        });
    }, [results]);

    async function SaveUserAnswer() {
        if (isRecording) {
            stopSpeechToText();
            const feedbackPrompt = `question:${activeQuestion?.question}, user answer:${userResponse}, depending on the question and the user response please give back a rating in numbers and feedback as area of improvement if any in 3-5 lines in JSON format with rating field and feedback field`;
            const result = await chatSession.sendMessage(feedbackPrompt);
            const responseText = await result.response.text();
            const jsonMatch = responseText.match(/```json([\s\S]*?)```/);
            if (jsonMatch && jsonMatch[1]) {
                try {
                    console.log(jsonMatch[1]);
                    let extractedJson = JSON.parse(jsonMatch[1]);
                    console.log(extractedJson);
                    console.log(extractedJson.rating);
                    console.log(extractedJson.feedback);
                }
                catch (error) {
                    console.error('Error parsing JSON:', error);
                    toast('Error parsing feedback response');
                }
            }
            else {
                toast('No valid JSON found in feedback response');
            }
        } 
        else {
            startSpeechToText();
        }
    }
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
            <Button variant="outline" className="my-10" onClick={SaveUserAnswer}>
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
        </div>
    );
}
