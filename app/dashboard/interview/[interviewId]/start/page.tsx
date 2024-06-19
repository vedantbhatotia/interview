"use client"
import { db } from "@/utils/db"; 
// import { MockInt} from "node:test";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { useEffect, useState } from "react";
import QuestionsSection from "./_components/QuestionsSection";
import RecordAnswer from "./_components/RecordAnswer";
 export default function StartInterview({params}:any){
    const [interviewData,setInterviewData] = useState<any>();
    const [mockInterviewQuestion,setMockInterviewQuestion] = useState();
    const [activeQuestionIndex,setActiveQuestionIndex] = useState<number>(0);
    useEffect(()=>{
        getInterviewDetails();
    },[])
    const getInterviewDetails = async () => {
        const result = await db
            .select()
            .from(MockInterview)
            .where(eq(MockInterview.mockId, params.interviewId));
        console.log(result);
        const jsonMockResponse = JSON.parse(result[0].jsonMockResp);
        console.log(jsonMockResponse);
        setMockInterviewQuestion(jsonMockResponse);
        setInterviewData(result[0]);
    };
    return(
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Start Interview
                 */}
                 <QuestionsSection mockInterviewQuestion={mockInterviewQuestion} activeQuestionIndex={activeQuestionIndex}>
                 </QuestionsSection>
                 <RecordAnswer mockInterviewQuestion={mockInterviewQuestion} activeQuestionIndex={activeQuestionIndex} interviewData={interviewData}></RecordAnswer>
            </div>
        </div>
    )
 }