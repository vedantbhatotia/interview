"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"; // Adjust the path based on your project structure
import { Button } from "@/components/ui/button"; // Adjust the path based on your project structure
import { Input } from "@/components/ui/input"; // Adjust the path based on your project structure
import { Textarea } from "@/components/ui/textarea"; // Adjust the path based on your project structure
import { chatSession } from "@/utils/geminiai"; // Adjust the path based on your project structure
import { Loader } from "lucide-react"; // Assuming you have lucide-react for loader animation
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";

interface QuestionAnswer {
  question: string;
  answer: string;
}

export default function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState<string>("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobExperience, setJobExperience] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [jsonResponse, setJsonResponse] = useState<any>([]);
  const { user } = useUser();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const inputPrompt = `Job Position: ${jobPosition}, Job Description: ${jobDescription}, Years Of Experience: ${jobExperience}. Depending on the job description, job position, and years of experience, give 5 advanced, modern, tricky interview questions that can be used to assess the candidate for the job profile and give a reference answer for each question in JSON format. Give the question and answer field in a single JSON object.`;
      const result = await chatSession.sendMessage(inputPrompt);
      const responseText = await result.response.text();
      console.log('Raw Response:', responseText);

      // Clean the response text
      const MockJsonResp = responseText.replace('```json', '').replace('```', '').trim();
      console.log('Cleaned JSON Response:', MockJsonResp);
      setJsonResponse(MockJsonResp);
      // Parse the JSON response
      // const parsedResponse = JSON.parse(MockJsonResp);
      // setJsonResponse(parsedResponse);

      // Insert into database
      const resp = await db.insert(MockInterview).values({
        mockId: uuidv4(),
        jsonMockResp: MockJsonResp,
        jobPosition: jobPosition,
        jobDesc: jobDescription,
        jobExperience: jobExperience.toString(),
        createdBy: user?.primaryEmailAddress?.emailAddress ?? "",
        createdAt: moment().format("DD-MM-yyyy"),
      }).returning({ mockId: MockInterview.mockId });

      console.log(resp);

      // Navigate to the interview page
      if (resp && resp[0]?.mockId) {
        router.push('/dashboard/interview/' + resp[0]?.mockId);
      } else {
        console.error("Failed to get mockId from response:", resp);
      }

      // Reset state
      setJobPosition("");
      setJobDescription("");
      setJobExperience(0);
      setJsonResponse([]);
      setOpenDialog(false);
    } catch (error) {
      console.error("Error parsing JSON response:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="font-bold text-lg text-center">+ Add New</h2>
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell Us More About Your Interview
            </DialogTitle>
            <DialogDescription>
              <div>
                <h2>Add Details about Your Role, Description, Years Of Experience</h2>
                <div className="mt-6 my-3">
                  <label>Job Role/Job Position</label>
                  <Input
                    placeholder="EX: Full Stack Developer"
                    value={jobPosition}
                    onChange={(e) => setJobPosition(e.target.value)}
                  />
                </div>
                <div className="mt-4 my-3">
                  <label>Job Description/Tech Stack</label>
                  <Textarea
                    placeholder="EX: Full Stack Developer"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </div>
                <div className="mt-4 my-3">
                  <label>Years Of Experience</label>
                  <Input
                    placeholder="5"
                    type="number"
                    value={jobExperience}
                    onChange={(e) => setJobExperience(parseInt(e.target.value, 10))}
                  />
                </div>
              </div>
              <div className="flex gap-5 justify-end">
                <Button
                  variant="ghost"
                  onClick={() => setOpenDialog(false)}
                  type="button"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader className="animate-spin" />
                      Curating Interview Questions
                    </div>
                  ) : (
                    "Start Interview"
                  )}
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
