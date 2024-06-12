"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // Adjust the path based on your project structure
import { Button } from "@/components/ui/button"; // Adjust the path based on your project structure
import { Input } from "@/components/ui/input"; // Adjust the path based on your project structure
import { Textarea } from "@/components/ui/textarea"; // Adjust the path based on your project structure
import { chatSession } from "@/utils/geminiai"; // Adjust the path based on your project structure
import { Loader } from "lucide-react"; // Assuming you have lucide-react for loader animation

interface Answer {
  approach: string | string[];
  [key: string]: any;
}

interface QuestionAnswer {
  question: string;
  answer: Answer;
}

export default function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState<string>("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobExperience, setJobExperience] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const inputPrompt = `Job Position: ${jobPosition}, Job Description: ${jobDescription}, Years Of Experience: ${jobExperience}. Depending on the job description, job position, and years of experience, give 5 advanced, modern, tricky interview questions that can be used to assess the candidate for the job profile and give a reference answer for each question in JSON format. Give the question and answer field in JSON format.`;

    try {
      const result = await chatSession.sendMessage(inputPrompt);
      const responseText = await result.response.text();
      const jsonMatches = responseText.match(/```json([\s\S]*?)```/g);
      console.log(jsonMatches);
      if (jsonMatches) {
        const jsonResponses: string[] = jsonMatches.map((match:string) =>
          match.replace(/```json|```/g, "").trim()
        );
        const finalResults: QuestionAnswer[] = jsonResponses.map((jsonStr) =>
          JSON.parse(jsonStr)
        );
        console.log("Final results:", finalResults);
      } else {
        console.error("No JSON parts found in the response.");
      }
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
                    onChange={(e) => setJobPosition(e.target.value)}
                  />
                </div>
                <div className="mt-4 my-3">
                  <label>Job Description/Tech Stack</label>
                  <Textarea
                    placeholder="EX: Full Stack Developer"
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </div>
                <div className="mt-4 my-3">
                  <label>Years Of Experience</label>
                  <Input
                    placeholder="5"
                    type="number"
                    onChange={(e) =>
                      setJobExperience(parseInt(e.target.value, 10))
                    }
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
