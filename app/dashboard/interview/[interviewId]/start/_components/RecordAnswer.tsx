import { useState, useEffect } from "react";
import Webcam from "react-webcam";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import useSpeechToText, { ResultType } from 'react-hook-speech-to-text';
import { Mic } from "lucide-react";
import { toast } from "sonner";
import { chatSession } from "@/utils/geminiai";
import { db } from "@/utils/db";
import { userAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";

export default function RecordAnswer({ mockInterviewQuestion, activeQuestionIndex,interviewData}:any) {
    const [webCamEnabled, setWebCamEnabled] = useState<boolean>(false);
    const [userResponse, setUserResponse] = useState<string>('');
    const [responseProcessed, setResponseProcessed] = useState<boolean>(false);
    const activeQuestion = mockInterviewQuestion && JSON.parse(mockInterviewQuestion[activeQuestionIndex]);
    const { user } = useUser();
    const [loading, setLoading] = useState<boolean>(false);
    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
        setResults
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
    });

    useEffect(() => {
        if (results.length > 0) {
            const newResponse = results.map((result: any) => result.transcript).join(' ');
            setUserResponse(newResponse);
        }
    }, [results]);

    useEffect(() => {
        if (!isRecording && userResponse && !responseProcessed) {
            UpdateUserRespState();
        }
    }, [isRecording, userResponse]);

    async function SaveUserAnswer() {
        if (isRecording) {
            stopSpeechToText();
        } else {
            startSpeechToText();
        }
    }

    async function UpdateUserRespState() {
        setLoading(true);
        setResponseProcessed(true);

        const feedbackPrompt = `question:${activeQuestion?.question}, user answer:${userResponse}, depending on the question and the user response please give back a rating in numbers and feedback as area of improvement if any in 3-5 lines in JSON format with rating field and feedback field`;
        const result = await chatSession.sendMessage(feedbackPrompt);
        const responseText = await result.response.text();
        const jsonMatch = responseText.match(/```json([\s\S]*?)```/);

        if (jsonMatch && jsonMatch[1]) {
            try {
                let extractedJson = JSON.parse(jsonMatch[1]);
                const resp = await db.insert(userAnswer).values({
                    mockIdRef: interviewData?.mockId,
                    question: activeQuestion?.question,
                    correctAns: activeQuestion?.answer,
                    userAns: userResponse,
                    feedback: extractedJson?.feedback,
                    rating: extractedJson?.rating,
                    userEmail: user?.primaryEmailAddress?.emailAddress,
                    createdAt: moment().format('DD-MM-yyyy')
                });
                if (resp) {
                    toast('User Answer Recorded Successfully');
                }
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        }

        setLoading(false);
        setUserResponse('');
        setResponseProcessed(false);
        setResults([]);
    }

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
            <Button variant="outline" className="my-10" onClick={SaveUserAnswer} disabled={loading}>
                {loading ? (
                    'Processing...'
                ) : isRecording ? (
                    <h2 className="flex gap-2">
                        <Mic />
                        {'Stop Recording'}
                    </h2>
                ) : (
                    'Record Answer'
                )}
            </Button>
        </div>
    );
}
