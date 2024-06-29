"use client"
import { db } from "@/utils/db";
import { userAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FeedBack({ params }: any) {
    const [feedbackList, setFeedbackList] = useState<any>([]);
    const router = useRouter();

    async function getDataFromDB() {
        const result = await db.select().from(userAnswer).where(eq(userAnswer.mockIdRef, params.interviewId)).orderBy(userAnswer.id);
        console.log(result);
        setFeedbackList(result);
    }

    useEffect(() => {
        getDataFromDB();
    }, []);

    return (
        <div className="p-10">
            {feedbackList.length === 0 ? (
                <h2 className="font-bold text-xl text-gray-500 mt-4">
                    No Interview Feedback Found
                </h2>
            ) : (
                <>
                    <h2 className="text-3xl font-bold text-green-500">
                        Congratulations!!
                    </h2>
                    <h2 className="font-bold text-2xl">
                        Here is Your Interview Feedback
                    </h2>
                    <h2 className="text-primary text-lg my-3">
                        Your Collective Interview Rating: <strong>8/10</strong>
                    </h2>
                    <h2 className="text-sm text-gray-500">
                        Find below the list of the interview questions with model answers, your responses, and feedback for improvement.
                    </h2>
                    {feedbackList.map((item: any, index: number) => (
                        <Collapsible key={index} className="mt-7">
                            <CollapsibleTrigger className="p-2 gap-7 bg-secondary rounded-large my-2 text-left flex justify-between w-full">
                                {item.question}
                                <ChevronsUpDown className="h-5 w-5" />
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <div className="flex flex-col gap-2">
                                    <h2 className="text-red-500 p-2 border rounded-lg">
                                        <strong>Rating:</strong> {item.rating}
                                    </h2>
                                    <h2 className="p-2 border rounded-lg bg-red-50 text-sm text-red-900">
                                        <strong>Your Answer:</strong> {item.userAns}
                                    </h2>
                                    <h2 className="p-2 border rounded-lg bg-green-50 text-sm text-green-900">
                                        <strong>Model Answer:</strong> {item.correctAns}
                                    </h2>
                                    <h2 className="p-2 border rounded-lg bg-blue-50 text-sm text-primary-900">
                                        <strong>Feedback:</strong> {item.feedback}
                                    </h2>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    ))}
                </>
            )}
            <Button onClick={() => router.replace('/dashboard')} className="mt-4">
                Home
            </Button>
        </div>
    );
}
