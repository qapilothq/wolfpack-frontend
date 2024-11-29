'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2Icon, AlertCircleIcon } from 'lucide-react';
import { ScrollArea } from '@radix-ui/react-scroll-area';

interface AssessmentQuestion {
  question: string;
}

const CandidateAssessment: React.FC = () => {
  const searchParams = useSearchParams();
  const role_id = searchParams?.get("role_id") || '';
  const profile_id = searchParams?.get("profile_id") || '';

  console.log('roleid', role_id);

  const [assessmentQuestions, setAssessmentQuestions] = useState<AssessmentQuestion[]>([]);
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [wordCounts, setWordCounts] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const maxWords = 250;
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!role_id || !profile_id) {
        setError('Missing role or profile ID');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        const createResponse = await fetch("https://tbtataojvhqyvlnzckwe.supabase.co/functions/v1/talenthunt-apis", {
          method: "POST",
          headers: {
            "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRidGF0YW9qdmhxeXZsbnpja3dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4NjEwMjIsImV4cCI6MjA0ODQzNzAyMn0.WpMB4UUuGiyT2COwoHdfNNS9AB3ad-rkctxJSVgDp7I`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            "requestType": "createProfileQuestions",
            "role_id": role_id,
            "profile_id": profile_id
          }),
        });

        if (!createResponse.ok) {
          throw new Error('Failed to create profile questions');
        }

        const questionsResponse = await fetch("https://tbtataojvhqyvlnzckwe.supabase.co/functions/v1/talenthunt-apis", {
          method: "POST",
          headers: {
            "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRidGF0YW9qdmhxeXZsbnpja3dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4NjEwMjIsImV4cCI6MjA0ODQzNzAyMn0.WpMB4UUuGiyT2COwoHdfNNS9AB3ad-rkctxJSVgDp7I`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            "requestType": "getAllQuestions",
            "role_id": role_id,
            "profile_id": profile_id
          }),
        });

        if (!questionsResponse.ok) {
          throw new Error('Failed to fetch questions');
        }

        const data = await questionsResponse.json();
        console.log(data);
        setAssessmentQuestions(data.roleQuestions.map((question: string) => ({ question })));
      } catch (error) {
        console.error('Error fetching questions:', error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [role_id, profile_id]);

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

  const handleSubmit = async () => {
    const allQuestionsAnswered = assessmentQuestions.every((q, index) => 
      responses[index] && 
      responses[index].trim().length > 0 && 
      (wordCounts[index] || 0) <= maxWords
    );

    if (allQuestionsAnswered) {
      try {
        const submitResponse = await fetch("https://tbtataojvhqyvlnzckwe.supabase.co/functions/v1/talenthunt-apis", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            "requestType": "submitAssessment",
            "role_id": role_id,
            "profile_id": profile_id,
            "responses": responses
          }),
        });

        if (submitResponse.ok) {
          setSubmitted(true);
        } else {
          throw new Error('Failed to submit assessment');
        }
      } catch (error) {
        console.error('Submission error:', error);
        alert('Failed to submit assessment. Please try again.');
      }
    } else {
      alert('Please complete all questions within the word limit');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <Card className="w-full max-w-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Loading Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Fetching assessment questions...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <Card className="w-full max-w-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-bold text-red-500">
              <AlertCircleIcon className="mr-2" />
              Error Loading Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
        {assessmentQuestions.length === 0 ? (
          <Card className="w-full shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-800">No Questions Available</CardTitle>
            </CardHeader>
            <CardContent>
              <p>There are currently no questions for this assessment.</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="w-full shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-800">Professional Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[60vh] overflow-y-auto">
                {assessmentQuestions.map((question, index) => (
                  <div key={index} className="mb-8">
                    <Label className="text-lg font-semibold mb-4 text-gray-700">{question.question}</Label>
                    <Textarea 
                      placeholder={`Your response (Max ${maxWords} words)`}
                      className={`mt-2 min-h-[200px] border ${
                        (wordCounts[index] || 0) > maxWords 
                        ? 'border-red-500' 
                        : 'border-gray-300'
                      }`}
                      onChange={(e) => handleResponseChange(index, e.target.value)}
                    />
                    <div className="flex items-center mt-2">
                      {(wordCounts[index] || 0) > maxWords && (
                        <AlertCircleIcon className="mr-2 text-red-500" />
                      )}
                      <span className={`text-sm ${
                        (wordCounts[index] || 0) > maxWords 
                        ? 'text-red-500' 
                        : 'text-gray-500'
                      }`}>
                        Word Count: {wordCounts[index] || 0}/{maxWords}
                      </span>
                    </div>
                  </div>
                ))}
              </ScrollArea>
              <div className="flex justify-end mt-4">
                <Button 
                  className="text-white font-medium py-2 px-4 rounded"
                  onClick={handleSubmit}
                >
                  Submit Assessment
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CandidateAssessment;