'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2Icon, AlertCircleIcon } from 'lucide-react';
import { ScrollArea } from '@radix-ui/react-scroll-area';

interface AssessmentQuestion {
  id: number;
  category: string;
  question: string;
  maxWords: number;
}

const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: 1,
    category: 'Technical Skill',
    question: "Describe a challenging technical problem you've solved and explain your approach to solving it.",
    maxWords: 300
  },
  {
    id: 2,
    category: 'Project Experience',
    question: "Tell us about a project where you demonstrated leadership or collaboration skills. What was your role, and what was the outcome?",
    maxWords: 250
  },
  {
    id: 3,
    category: 'Problem-Solving',
    question: "Reflect on a situation where you had to learn a new technology or skill quickly. How did you approach the learning process?",
    maxWords: 200
  },
  {
    id: 4,
    category: 'Career Goals',
    question: "Where do you see yourself professionally in the next three years, and how does this role align with your career aspirations?",
    maxWords: 250
  }
];

const CandidateAssessment: React.FC = () => {
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [wordCounts, setWordCounts] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleResponseChange = (questionId: number, response: string) => {
    const wordCount = response.trim().split(/\s+/).filter(word => word.length > 0).length;
    
    setResponses(prev => ({
      ...prev,
      [questionId]: response
    }));

    setWordCounts(prev => ({
      ...prev,
      [questionId]: wordCount
    }));
  };

  const handleSubmit = () => {
    const allQuestionsAnswered = assessmentQuestions.every(q => 
      responses[q.id] && 
      responses[q.id].trim().length > 0 && 
      (wordCounts[q.id] || 0) <= q.maxWords
    );

    if (allQuestionsAnswered) {
      setSubmitted(true);
      console.log('Candidate Responses:', responses);
    } else {
      alert('Please complete all questions within the word limit');
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <Card className="w-full max-w-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-bold">
              <CheckCircle2Icon className="mr-2 text-green-500" />
              Assessment Submitted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">Your assessment has been successfully submitted. Our team will review your responses shortly.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-gray-100 pt-12">
    <div className="container mx-auto">
      <div className="">
        <Card className="w-full shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800">Professional Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[60vh] overflow-y-auto">
              {assessmentQuestions.map((question) => (
                <div key={question.id} className="mb-8">
                  <Label className="text-lg font-semibold mb-4 text-gray-700">{question.question}</Label>
                  <Textarea 
                    placeholder={`Your response (Max ${question.maxWords} words)`}
                    className={`mt-2 min-h-[200px] border ${
                      (wordCounts[question.id] || 0) > question.maxWords 
                      ? 'border-red-500' 
                      : 'border-gray-300'
                    }`}
                    onChange={(e) => handleResponseChange(question.id, e.target.value)}
                  />
                  <div className="flex items-center mt-2">
                    {(wordCounts[question.id] || 0) > question.maxWords && (
                      <AlertCircleIcon className="mr-2 text-red-500" />
                    )}
                    <span className={`text-sm ${
                      (wordCounts[question.id] || 0) > question.maxWords 
                      ? 'text-red-500' 
                      : 'text-gray-500'
                    }`}>
                      Word Count: {wordCounts[question.id] || 0}/{question.maxWords}
                    </span>
                  </div>
                </div>
              ))}
            </ScrollArea>
            <div className="flex justify-end mt-4">
              <Button 
                className=" text-white font-medium py-2 px-4 rounded"
                onClick={handleSubmit}
              >
                Submit Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
};

export default CandidateAssessment;