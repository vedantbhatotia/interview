"use client"
import { db } from "@/utils/db"; 
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import QuestionsSection from "./_components/QuestionsSection";
import RecordAnswer from "./_components/RecordAnswer";
import Link from "next/link";
export default function StartInterview({ params}:any) {
    const [interviewData, setInterviewData] = useState<any>(null);
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState<any>([]);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState<any>(0);

    useEffect(() => {
        getInterviewDetails();
    }, []);

    const getInterviewDetails = async () => {
        const result = await db
            .select()
            .from(MockInterview)
            .where(eq(MockInterview.mockId, params.interviewId));
        const val = result[0].jsonMockResp;
        console.log(val);

        try {
            const mockInterviewQuestions = extractQuestions(val);
            console.log(mockInterviewQuestions);
            setMockInterviewQuestion(mockInterviewQuestions);
            setInterviewData(result[0]);
        } catch (error) {
            console.error("Failed to extract questions:", error);
        }
    };
    const extractQuestions = (rawString:any) => {
        const questionRegex = /"question":\s*"(.*?)",/g;
        const answerRegex = /"answer":\s*"(.*?)"/g;
        
        let questions = [];
        let matchQuestion;
        let matchAnswer;
        
        while ((matchQuestion = questionRegex.exec(rawString)) !== null && (matchAnswer = answerRegex.exec(rawString)) !== null) {
            questions.push({
                question: matchQuestion[1],
                answer: matchAnswer[1]
            });
        }
        return questions;
    };

    return (
        <>
            <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <QuestionsSection
                        mockInterviewQuestion={mockInterviewQuestion}
                        activeQuestionIndex={activeQuestionIndex}
                    />
                    <RecordAnswer
                        mockInterviewQuestion={mockInterviewQuestion}
                        activeQuestionIndex={activeQuestionIndex}
                        interviewData={interviewData}
                    />
                </div>
            </div>
            <div className="flex justify-start gap-4 mt-4 ml-5">
                {activeQuestionIndex > 0 && <Button onClick={() => {
                    setActiveQuestionIndex(activeQuestionIndex - 1)
                }}>Prev Question</Button>}
                {activeQuestionIndex != mockInterviewQuestion?.length - 1 && <Button onClick={() => {
                    setActiveQuestionIndex(activeQuestionIndex + 1)
                }}>Next  Question</Button>}
                <Button>End Interview</Button>
                <Link href={`/dashboard/interview/${interviewData?.mockId}/feedback`}>
                    {activeQuestionIndex === mockInterviewQuestion?.length - 1 && <Button onClick={() => {
                        Link
                    }}>End Interview</Button>}
                </Link>
            </div>
        </>
    );
}
