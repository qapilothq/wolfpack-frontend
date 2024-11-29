'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CheckCircle2Icon, XCircleIcon, TargetIcon } from 'lucide-react';
import { ScrollArea } from '@radix-ui/react-scroll-area';

interface Question {
  id: number;
  text: string;
}

interface CandidateResponse {
  [questionId: number]: string;
}

interface CandidateEvaluation {
  [questionId: number]: {
    correct: boolean;
    explanation: string;
  };
}

interface Candidate {
  name: string;
  email: string;
  responses: CandidateResponse;
}

const questions: Question[] = [
  { id: 1, text: 'How do you create a state variable in React?' },
  { id: 2, text: 'Write a function to reverse a string in JavaScript.' },
  { id: 3, text: 'What is a Collection in programming?' },
  { id: 4, text: 'Write a function to check if a number is prime.' }
];

const candidate: Candidate = {
  name: 'Vinod G',
  email: 'vinodgullipalli16@gmail.com',
  responses: {
    1: 'Create a new state variable',
    2: 'function reverseString(str) {\n  return str.split("").reverse().join("");\n}',
    3: 'Collection',
    4: 'function isPrime(num) {\n  if (num <= 1) return false;\n  for (let i = 2; i <= Math.sqrt(num); i++) {\n    if (num % i === 0) return false;\n  }\n  return true;\n}'
  }
};

const CandidateCard: React.FC = () => (
  <Card className="hover:shadow-lg transition-shadow duration-300">
    <CardHeader>
      <div className="flex items-center">
        <TargetIcon className="mr-2 text-blue-500" />
        <CardTitle>Personal Information</CardTitle>
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <p><strong>Name:</strong> {candidate.name}</p>
        <p><strong>Email:</strong> {candidate.email}</p>
      </div>
    </CardContent>
  </Card>
);

const AssessmentResults: React.FC = () => {
  const [evaluations, setEvaluations] = useState<CandidateEvaluation>({});
  const [assessmentScore, setAssessmentScore] = useState<number | null>(null);

  const handleEvaluation = (questionId: number, isCorrect: boolean) => {
    const newEvaluations = {
      ...evaluations,
      [questionId]: { 
        correct: isCorrect, 
        explanation: isCorrect 
          ? 'Marked as correct by recruiter' 
          : 'Marked as incorrect by recruiter' 
      }
    };
    setEvaluations(newEvaluations);

    // Calculate score
    const totalQuestions = questions.length;
    const correctAnswers = Object.values(newEvaluations).filter(evaluation => evaluation.correct).length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    setAssessmentScore(score);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-gray-100 pt-12">

      <div className="flex flex-col gap-4 mx-10">
        <div className='flex justify-between items-center'>
        <h1 className="text-xl font-semibold text-gray-800">Assessment Evaluation
      </h1>
      <CandidateCard />
        </div>
        <Card className="shadow-lg">
          <CardContent>
            <div className='pt-5'>
              
              {assessmentScore !== null && (
                <div className="flex items-center mb-4">
                  <span className="text-lg font-semibold mr-2">Assessment Score:</span>
                  <span className={`font-bold ${assessmentScore >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                    {assessmentScore}%
                  </span>
                </div>
              )}

              <Tabs defaultValue="responses">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="responses">Candidate Responses</TabsTrigger>
                  <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
                </TabsList>
                <ScrollArea className="h-[50vh] overflow-y-auto">
                  <TabsContent value="responses">
                    {questions.map((question) => (
                      <Card key={question.id} className="mb-4 shadow-md">
                        <CardContent className="p-4">
                          <div className="mb-2 font-semibold text-gray-700">{question.text}</div>
                          <pre className="whitespace-pre-wrap text-gray-700">
                            {candidate.responses[question.id]}
                          </pre>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="evaluation">
                    {questions.map((question) => (
                      <Card key={question.id} className="mb-4 shadow-md">
                        <CardContent className="p-4">
                          <div className="mb-2 font-semibold text-gray-700">{question.text}</div>
                          <pre className="whitespace-pre-wrap text-gray-700 mb-4">
                            {candidate.responses[question.id]}
                          </pre>
                          <div className="flex items-center space-x-4">
                            <Button 
                              variant={evaluations[question.id]?.correct === true ? 'default' : 'outline'}
                              onClick={() => handleEvaluation(question.id, true)}
                            >
                              <CheckCircle2Icon className="mr-2 text-green-500" /> Correct
                            </Button>
                            <Button 
                              variant={evaluations[question.id]?.correct === false ? 'default' : 'outline'}
                              onClick={() => handleEvaluation(question.id, false)}
                            >
                              <XCircleIcon className="mr-2 text-red-500" /> Incorrect
                            </Button>
                          </div>
                          {evaluations[question.id] && (
                            <p className={`mt-2 ${evaluations[question.id].correct ? 'text-green-600' : 'text-red-600'}`}>
                              {evaluations[question.id].explanation}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>
                </ScrollArea>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AssessmentResults;