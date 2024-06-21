"use client"
import { useEffect, useState } from "react";
import { MockInterview } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/db";
import { eq } from "drizzle-orm";
import InterviewItemCard from "./InterviewItemCard";

export default function InterviewList() {
    const { user } = useUser();
    const [interviews, setInterviews] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function getInterviewList() {
            try {
                if (user?.primaryEmailAddress?.emailAddress) {
                    const result = await db
                        .select()
                        .from(MockInterview)
                        .where(eq(MockInterview.createdBy, user.primaryEmailAddress.emailAddress));
                    console.log(result);
                    setInterviews(result);
                }
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false);
            }
        }

        getInterviewList();
    }, [user]);

    if (loading) {
        return <div>Loading...</div>;
    }
    return (
        <div>
            <h2 className="font-medium text-xl">Previous Interview Experiences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3">
                {interviews.length>0 && interviews.map((interview:any, index:number) => (
                    <InterviewItemCard key={index} interview={interview}></InterviewItemCard>
                ))}
            </div>
        </div>
    );
}
