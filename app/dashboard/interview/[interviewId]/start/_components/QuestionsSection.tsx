import { Lightbulb, Volume2 } from "lucide-react";
import { useEffect } from "react";

export default function QuestionsSection({ mockInterviewQuestion, activeQuestionIndex }: any) {
    // Parse the string to a JSON object
    const activeQuestion = mockInterviewQuestion && JSON.parse(mockInterviewQuestion[activeQuestionIndex]);

    function textToSpeech(text:string){
        if('speechSynthesis' in window){
            const speech = new SpeechSynthesisUtterance(text)
            window.speechSynthesis.speak(speech)
        }else{
            alert("Something went wrong")
        }
    }

    return mockInterviewQuestion && (
        <div className="p-5 border rounded-lg my-10">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {mockInterviewQuestion.map((question: any, index: number) => (
                    <h2
                        key={index} // Added key prop for unique identification
                        className={`p-2 rounded-full text-xs md:text-sm text-center cursor-pointer
                        ${activeQuestionIndex === index ? 'bg-red-500 text-white' : 'bg-white text-black'}`}
                    >
                        Question #{index + 1}
                    </h2>
                ))}
            </div>
            <h2 className="my-5 text-md md:text-large p-3 bg-white text-black rounded-lg">
                {activeQuestion?.question}
            </h2>
            <Volume2 onClick={()=>textToSpeech(activeQuestion?.question)} className="cursor-pointer" />
            <div className="border rounded-lg p-5 bg-blue-100 mt-20">
                <h2 className="flex gap-2 items-center text-blue-900">
                    <Lightbulb className="mr-2" />
                    <strong>Note:</strong>
                </h2>
                <h2 className="text-sm my-2 text-blue-900">
                    Click On Record Answer Button to Record Your Responses and At the End of the Interview You will be provided With a Model Answers With which you can Compare your Responses
                </h2>
            </div>
        </div>
    );
}
