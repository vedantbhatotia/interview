import { UserButton } from "@clerk/nextjs"
import AddNewInterview from "./_components/AddNewInterview"
import InterviewList from "./_components/InterviewList"
export default function Page(){
    return(
        <div className="p-10">
        <h2 className="font-bold text-2xl">Dashboard</h2>
        <h2 className="text-gray 500">Create And Start Your Own Customized Interview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 my-5">
            <AddNewInterview>
            </AddNewInterview>
        </div>
        <InterviewList></InterviewList>
        </div>
    )
}
