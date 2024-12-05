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
// interface CanidateCardProps  {
//   candidate: Candidate;
// }

// const CandidateCard: React.FC<CanidateCardProps> = ({ candidate }) => (
//   <Card className="hover:shadow-lg transition-shadow duration-300">
//     <CardHeader>
//       <div className="flex items-center">
//         <TargetIcon className="mr-2 text-blue-500" />
//         <CardTitle>Personal Information</CardTitle>
//       </div>
//     </CardHeader>
//     <CardContent>
//       <div className="space-y-2">
//         <p><strong>Name:</strong> {candidate.name}</p>
//         <p><strong>Email:</strong> {candidate.email}</p>
//       </div>
//     </CardContent>
//   </Card>
// );

const AssessmentResults: React.FC = () => {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [evaluations, setEvaluations] = useState<CandidateEvaluation>({});
  const [assessmentScore, setAssessmentScore] = useState<number | null>(null);
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<boolean>(true); // Add loading state

  const role_id = searchParams.get("role_id");
  const profile_id = searchParams.get("profile_id");
  console.log("role_id", role_id);
  console.log("profile_id", profile_id);

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

    // Calculate score
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

  useEffect(() => {
    const user = sessionStorage.getItem("USER_PROF");
    console.log(user);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Role ID:", role_id);
        console.log("Profile ID:", profile_id);

        const assessmentResponse = await fetch(
          "https://tbtataojvhqyvlnzckwe.supabase.co/functions/v1/talenthunt-apis",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRidGF0YW9qdmhxeXZsbnpja3dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4NjEwMjIsImV4cCI6MjA0ODQzNzAyMn0.WpMB4UUuGiyT2COwoHdfNNS9AB3ad-rkctxJSVgDp7I`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              requestType: "getAssessment",
              role_id: role_id,
              profile_id: profile_id,
            }),
          }
        );

        const data = await assessmentResponse.json();
        console.log("Raw Assessment Data:", data);
        console.log("Assessment Data Type:", typeof data);
        console.log("Assessment Data Length:", data.length);
        console.log("First Assessment Item:", data[0]);

        const profileResponse = await fetch(
          "https://tbtataojvhqyvlnzckwe.supabase.co/functions/v1/talenthunt-apis",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRidGF0YW9qdmhxeXZsbnpja3dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4NjEwMjIsImV4cCI6MjA0ODQzNzAyMn0.WpMB4UUuGiyT2COwoHdfNNS9AB3ad-rkctxJSVgDp7I`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              requestType: "getProfileSummary",
              profile_id: profile_id,
            }),
          }
        );

        const profileData = await profileResponse.json();
        console.log("Raw Profile Data:", profileData);
        console.log("Profile Data Type:", typeof profileData);
        console.log("Profile Data Length:", profileData.length);
        console.log("First Profile Item:", profileData[0]);

        // Safe data extraction with optional chaining and nullish coalescing
        const candidateName = profileData[0]?.pi?.Name ?? "Unknown";
        const candidateEmail = profileData[0]?.pi?.Email ?? "N/A";
        const candidateResponses = data.data[0]?.assessment ?? [];

        setCandidate({
          name: candidateName,
          email: candidateEmail,
          responses: candidateResponses,
        });

        setLoading(false);
      } catch (error) {
        console.error("Detailed Error:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [role_id, profile_id]);

  useEffect(() => {
    console.log("candidate from useffect", candidate);
  }, [candidate]);

  const handleSaveEvaluation = async () => {
    console.log(evaluations);
    const response = await fetch(
      "https://tbtataojvhqyvlnzckwe.supabase.co/functions/v1/talenthunt-apis",
      {
        method: "POST",
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRidGF0YW9qdmhxeXZsbnpja3dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4NjEwMjIsImV4cCI6MjA0ODQzNzAyMn0.WpMB4UUuGiyT2COwoHdfNNS9AB3ad-rkctxJSVgDp7I",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestType: "updateScore",
          profile_id: profile_id,
          assessment_score: assessmentScore,
        }),
      }
    );
    const data = await response.json();
    console.log(data);
    alert("Evaluation saved succussfully");
  };
  if (loading) {
    return (
      <div className="flex w-full items-center justify-center">
        <div className="flex items-center space-x-2">
          <LoaderIcon className="animate-spin" />
          <span>Loading</span>
        </div>
      </div>
    );
  }

  if (candidate?.responses.length === 0) {
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
              Asessment is not completed by the candidate.
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
