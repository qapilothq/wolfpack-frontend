"use client";
import React, { useEffect, useState, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2Icon,
  XCircleIcon,
  TargetIcon,
  ClockIcon,
} from "lucide-react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useSearchParams } from "next/navigation";
import { LoaderIcon } from "lucide-react";
import axios from "axios";
import useStore from "../stores/store";
// interface Question {
//   question: string;
//   answer: string;
// }

interface CandidateEvaluation {
  [questionId: number]: {
    correct: boolean;
    explanation: string;
  };
}

interface Candidate {
  name: string;
  email: string;
  responses: Array<{
    question: string;
    answer: string;
  }>;
}

const AssessmentResults: React.FC = () => {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [evaluations, setEvaluations] = useState<CandidateEvaluation>({});
  const [assessmentScore, setAssessmentScore] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  const searchParams = useSearchParams();
  const role_id = searchParams.get("role_id");
  const profile_id = searchParams.get("profile_id");
  const { authtoken, apiUrl } = useStore();

  // First useEffect to check if we have the required data
  useEffect(() => {
    if (authtoken && apiUrl && role_id && profile_id) {
      setIsInitializing(false);
    }
  }, [authtoken, apiUrl, role_id, profile_id]);

  // Main data fetching useEffect
  useEffect(() => {
    const fetchData = async () => {
      if (isInitializing) return;

      try {
        const response = await fetch(
          `${apiUrl}/profiles/summary/${profile_id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authtoken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const profileData = await response.json();

        const assessmentResponse = await axios.get(
          `${apiUrl}/assessments/${profile_id}/${role_id}`,
          {
            headers: {
              Authorization: `Bearer ${authtoken}`,
            },
          }
        );

        const data = assessmentResponse.data;

        // Accessing the properties directly from the object
        const candidateName = profileData.pi?.Name ?? "Unknown";
        const candidateEmail = profileData.pi?.Email ?? "N/A";
        const candidateResponses = data?.assessment ?? [];

        setCandidate({
          name: candidateName,
          email: candidateEmail,
          responses: candidateResponses,
        });
      } catch (error) {
        console.log("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isInitializing, authtoken, apiUrl, profile_id, role_id]);

  const handleEvaluation = (questionId: number, isCorrect: boolean) => {
    const newEvaluations = {
      ...evaluations,
      [questionId]: {
        correct: isCorrect,
        explanation: isCorrect
          ? "Marked as correct by recruiter"
          : "Marked as incorrect by recruiter",
      },
    };
    setEvaluations(newEvaluations);

    const totalQuestions = candidate?.responses.length || 0;
    const correctAnswers = Object.values(newEvaluations).filter(
      (evaluation) => evaluation.correct
    ).length;
    const score =
      totalQuestions > 0
        ? Math.round((correctAnswers / totalQuestions) * 100)
        : 0;
    setAssessmentScore(score);
  };

  const handleSaveEvaluation = async () => {
    if (!authtoken) {
      alert("Authentication token not available. Please try again.");
      return;
    }
    try {
      const response = await axios.post(
        `${apiUrl}/profiles/score`,
        {
          profile_id: profile_id,
          assessment_score: assessmentScore,
        },
        {
          headers: {
            Authorization: `Bearer ${authtoken}`,
          },
        }
      );

      console.log(response.data);
      alert("Evaluation saved successfully");
    } catch (error) {
      console.error("Error saving evaluation:", error);
      alert("Failed to save evaluation");
    }
  };

  if (isInitializing || loading) {
    return (
      <div className="flex w-full items-center justify-center">
        <div className="flex items-center space-x-2">
          <LoaderIcon className="animate-spin" />
          <span>Loading</span>
        </div>
      </div>
    );
  }

  if (!candidate || candidate.responses.length === 0) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <Card className="w-full max-w-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-bold">
              <ClockIcon className="mr-2 text-gray-500" />
              Assessment Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Assessment is not completed by the candidate.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-gray-100 pt-12">
      <div className="flex flex-col gap-4 mx-4 sm:mx-10">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
            Assessment Evaluation
          </h1>
          <Card className="hover:shadow-lg transition-shadow duration-300 mt-4 sm:mt-0">
            <CardHeader>
              <div className="flex items-center">
                <TargetIcon className="mr-2 text-blue-500" />
                <CardTitle>Personal Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <strong>Name:</strong> {candidate?.name}
                </p>
                <p>
                  <strong>Email:</strong> {candidate?.email}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="shadow-lg">
          <CardContent>
            <div className="pt-5">
              {assessmentScore !== null && (
                <div className="flex flex-col sm:flex-row justify-between items-center py-2">
                  <div className="flex items-center mb-4 sm:mb-0">
                    <span className="text-lg font-semibold mr-2">
                      Assessment Score:
                    </span>
                    <span
                      className={`font-bold ${
                        assessmentScore >= 70
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {assessmentScore}%
                    </span>
                  </div>

                  <Button
                    onClick={handleSaveEvaluation}
                    className="mt-2 sm:mt-0"
                  >
                    Save Evaluation
                  </Button>
                </div>
              )}

              <Tabs defaultValue="responses">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="responses">
                    Candidate Responses
                  </TabsTrigger>
                  <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
                </TabsList>
                <ScrollArea className="h-[50vh] overflow-y-auto">
                  <TabsContent value="responses">
                    {candidate?.responses.map((response, index) => (
                      <Card key={index} className="mb-4 shadow-md">
                        <CardContent className="p-4">
                          <div className="mb-2 font-semibold text-gray-700">
                            {response.question}
                          </div>
                          <pre className="whitespace-pre-wrap text-gray-700">
                            {response.answer}
                          </pre>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="evaluation">
                    {candidate?.responses.map((response, index) => (
                      <Card key={response.question} className="mb-4 shadow-md">
                        <CardContent className="p-4">
                          <div className="mb-2 font-semibold text-gray-700">
                            {response.question}
                          </div>
                          <pre className="whitespace-pre-wrap text-gray-700 mb-4">
                            {response.answer}
                          </pre>
                          <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-4 space-y-2 sm:space-y-0">
                            <Button
                              variant={
                                evaluations[index]?.correct === true
                                  ? "default"
                                  : "outline"
                              }
                              onClick={() => handleEvaluation(index, true)}
                            >
                              <CheckCircle2Icon className="mr-2 text-green-500" />{" "}
                              Correct
                            </Button>
                            <Button
                              variant={
                                evaluations[index]?.correct === false
                                  ? "default"
                                  : "outline"
                              }
                              onClick={() => handleEvaluation(index, false)}
                            >
                              <XCircleIcon className="mr-2 text-red-500" />{" "}
                              Incorrect
                            </Button>
                          </div>
                          {evaluations[index] && (
                            <p
                              className={`mt-2 ${
                                evaluations[index].correct
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {evaluations[index].explanation}
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

const AssessmentResultsPage: React.FC = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <AssessmentResults />
  </Suspense>
);

export default AssessmentResultsPage;
