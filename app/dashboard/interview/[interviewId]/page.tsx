"use client"
import { useEffect } from "react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { useState } from "react";
import { Lightbulb, WebcamIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Webcam from "react-webcam";

export default function Interview({ params }: any) {
    const [interviewData, setInterviewData] = useState<any>();
    const [webCamEnabled, setWebCamEnabled] = useState<boolean>(false);
    
    const getInterviewDetails = async () => {
        const result = await db
            .select()
            .from(MockInterview)
            .where(eq(MockInterview.mockId, params.interviewId));
        console.log(result);
        setInterviewData(result[0]);
    };
    
    useEffect(() => {
        console.log(params.interviewId);
        getInterviewDetails();
    }, [params.interviewId]);

    return (
        <div className="my-10">
            <h2 className="font-bold text-2xl">
                Let's Get Started
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="flex flex-col my-5 gap-5">
                    <div className="flex flex-col gap-5 p-5 rounded-lg border">
                        <h2 className="text-lg">
                            <strong>
                                Job Role/Job Position:
                            </strong>
                            {interviewData?.jobPosition}
                        </h2>
                        <h2 className="text-lg">
                            <strong>
                                Job Description/Tech Stack:
                            </strong>
                            {interviewData?.jobDesc}
                        </h2>
                        <h2 className="text-lg">
                            <strong>
                                Years Of Experience:
                            </strong>
                            {interviewData?.jobExperience}
                        </h2>
                    </div>
                    <div className="p-5 border rounded-lg border-yellow-300">
                        <h2 className="flex gap-2 items-center">
                            <Lightbulb className="text-yellow-500" />
                            <strong className="text-white">Information</strong>
                        </h2>
                        <h2>Enable Web Cam and Microphone To Start Your Mock Interview</h2>
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    {webCamEnabled ? (
                        <Webcam
                            style={{ height: 300, width: 300 }}
                            onUserMedia={() => setWebCamEnabled(true)}
                            onUserMediaError={() => setWebCamEnabled(false)}
                            mirrored={true}
                        />
                    ) : (
                        <>
                            <WebcamIcon className="h-72 my-7 w-full p-10 text-white bg-gray-800 rounded-lg border" />
                            <Button
                                className="w-full"
                                variant="ghost"
                                onClick={() => setWebCamEnabled(true)}
                            >
                                Enable Web Cam and Microphone
                            </Button>
                        </>
                    )}
                </div>
            </div>
            <div className="flex justify-end items-end mt-5">
                <Button>Start</Button>
            </div>
        </div>
    );
}
