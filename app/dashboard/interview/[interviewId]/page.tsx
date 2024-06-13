"use client"
import { useEffect } from "react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";

export default function Interview({ params }: any) {
    const getInterviewDetails = async () => {
        const result = await db
            .select()
            .from(MockInterview)
            .where(eq(MockInterview.mockId, params.interviewId));
        console.log(result);
    };

    useEffect(() => {
        console.log(params.interviewId);
        getInterviewDetails();
    }, [params.interviewId]);

    return (
        <>Interview</>
    );
}
