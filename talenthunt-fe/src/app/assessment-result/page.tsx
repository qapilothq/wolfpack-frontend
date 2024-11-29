'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CheckCircle2Icon, XCircleIcon } from 'lucide-react';
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
      <div className="container mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">Assessment Evaluation</CardTitle>
          </CardHeader>
     
            <CardContent>
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">{candidate.name}</h2>
                <p className="text-gray-600 mb-4">{candidate.email}</p>
                
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