"use client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { tree } from "next/dist/build/templates/app-page"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ConsoleLogWriter } from "drizzle-orm"
  
export default function AddNewInterview(){
    const [openDialog,setOpenDialog] = useState<boolean>(false);
    const [jobPosition,setJobPosition] = useState<string>("");
    const [jobDescription,setJobDescription] = useState<string>("");
    const [jobExperience,setJobExperience] = useState<number>(0);
    function handleSubmit(){
        setOpenDialog(false)
        console.log(jobPosition,jobDescription,jobExperience);
    }
    return(
        <div>
            <div className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer
            " onClick={()=>{
                setOpenDialog(true)
            }}>
                <h2 className="font-bold text-lg text-center">+ Add New</h2>
            </div>
            <Dialog open={openDialog}>
            {/* <DialogTrigger>Open</DialogTrigger> */}
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                <DialogTitle className="text-2xl">Tell Us More About Your Interview</DialogTitle>
                <DialogDescription>
                    <div>
                        {/* <h2 className="font-bold text-2xl">
                            
                        </h2> */}
                        <h2>Add Details about Your Role,Description,Years Of Experience</h2>
                        <div className="mt-6 my-3">
                            <label>Job Role/Job Position</label>
                            <Input placeholder="EX:Full Stack Developer" onChange={(e)=>{
                                setJobPosition(e.target.value)
                            }}></Input>
                        </div>
                        <div className="mt-4 my-3">
                            <label>Job Description/Tech Stack</label>
                            <Textarea placeholder="EX:Full Stack Developer"  onChange={(e)=>{
                                setJobDescription(e.target.value)
                            }}></Textarea>
                        </div>
                        <div className="mt-4 my-3">
                            <label>Years Of Experience</label>
                            <Input placeholder="5" type = "number"  onChange={(e)=>{
                                setJobExperience(parseInt(e.target.value))
                            }}></Input>
                        </div>
                    </div>
                    <div className="flex gap-5 justify-end">
                        <Button variant = "ghost" onClick={()=>{
                            setOpenDialog(false);
                        }} type = "button">Cancel</Button>
                        <Button type="submit" onClick={handleSubmit}>Start Interview</Button>
                    </div>
                </DialogDescription>

                </DialogHeader>
            </DialogContent>
            </Dialog>
        </div>
    )
}
