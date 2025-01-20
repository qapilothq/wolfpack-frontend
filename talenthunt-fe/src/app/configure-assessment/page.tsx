"use client";
import React, { Suspense, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, TrashIcon, LoaderIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";
import useStore from "../stores/store";
import axios from "axios";

interface Role {
  name: string;
  id: number;
  job_description: string;
  suggested_questions?: string[];
}

const Assessment: React.FC = () => {
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [questionsAdded, setQuestionsAdded] = useState<string[]>([]);
  const [currentRoleDescription, setCurrentRoleDescription] =
    useState<string>("");
  const [currentAISuggestions, setCurrentAISuggestions] = useState<string[]>(
    []
  );
  const searchParams = useSearchParams();
  const role_id = searchParams?.get("role_id") || "";

  // New state for loading and error handling
  const [isLoadingRoles, setIsLoadingRoles] = useState(false); // Changed to false initially
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [rolesError, setRolesError] = useState<string | null>(null);
  const [questionsError, setQuestionsError] = useState<string | null>(null);
  const [role, setRole] = useState<Role>();

  const { authtoken, apiUrl } = useStore();

  // Add new state to track if auth is ready
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Check if auth is ready
  useEffect(() => {
    if (authtoken && apiUrl) {
      setIsAuthReady(true);
    }
  }, [authtoken, apiUrl]);

  const handleConfigureAssessment = async () => {
    if (!selectedRole || !authtoken) {
      toast({
        title: "Error",
        description: "Please select a role before configuring the assessment",
        variant: "destructive",
      });
      return;
    }

    setIsConfiguring(true);
    try {
      const response = await axios.post(
        `${apiUrl}/roles/${role_id}/custom-questions`,
        {
          questions: questionsAdded,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authtoken}`,
          },
        }
      );

      // Check if the response status is not in the 2xx range
      if (response.status < 200 || response.status >= 300) {
        throw new Error("Network response was not ok");
      }

      const responseData = response.data;
      console.log(responseData);

      toast({
        title: "Success",
        description: "Assessment configured successfully",
      });
      setQuestionsAdded([]);
    } catch (error) {
      console.error("Error configuring assessment:", error);
      toast({
        title: "Error",
        description: "Failed to configure assessment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConfiguring(false);
    }
  };

  useEffect(() => {
    setSelectedRole(role_id);
  }, [role_id]);

  useEffect(() => {
    console.log("selectedRole", selectedRole);
  }, [selectedRole]);

  // Modified useEffect to wait for auth
  useEffect(() => {
    const getRoles = async () => {
      if (!authtoken || !apiUrl) return; // Don't proceed if auth is not ready

      setIsLoadingRoles(true);
      setRolesError(null);
      try {
        if (!role_id) {
          throw new Error("Role ID is required");
        }

        const response = await axios.get(`${apiUrl}/roles`, {
          headers: {
            Authorization: `Bearer ${authtoken}`,
          },
        });

        const rolesData = response.data;
        if (!Array.isArray(rolesData)) {
          throw new Error("Unexpected response format");
        }

        const formattedRoles = rolesData.map((role) => ({
          name: role.name,
          id: role.id,
          job_description: role.job_description,
          suggested_questions: role.suggested_questions || [],
        }));

        console.log("formattedRoles", formattedRoles);

        const selectedRoleObj = formattedRoles.find(
          (role) => role.id === parseInt(role_id)
        );

        if (selectedRoleObj) {
          setRole(selectedRoleObj);
          setCurrentRoleDescription(selectedRoleObj.job_description);
        } else {
          setRolesError("Role not found");
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
        setRolesError("Failed to load roles. Please try again later.");
      } finally {
        setIsLoadingRoles(false);
      }
    };
    if (isAuthReady) {
      getRoles();
    }
  }, [role_id, isAuthReady]);

  // Modified useEffect to wait for auth
  useEffect(() => {
    const getAIQuestions = async () => {
      if (!authtoken || !apiUrl) return;

      setIsLoadingQuestions(true);
      setQuestionsError(null);
      try {
        const response = await axios.get(
          `${apiUrl}/roles/${role_id}/questions`,
          {
            headers: {
              Authorization: `Bearer ${authtoken}`,
            },
          }
        );

        console.log("AI Questions Response:", response.data);

        // Access the nested questions array
        if (
          response.data?.data?.questions &&
          Array.isArray(response.data.data.questions)
        ) {
          setCurrentAISuggestions(response.data.data.questions);
        } else {
          throw new Error("Unexpected response format for AI questions");
        }
      } catch (error) {
        console.error("Error fetching AI questions:", error);
        setQuestionsError(
          "Failed to load AI suggestions. Please try again later."
        );
        setCurrentAISuggestions([]);
      } finally {
        setIsLoadingQuestions(false);
      }
    };
    if (selectedRole && isAuthReady) {
      getAIQuestions();
      setQuestionsAdded([]);
    }
  }, [selectedRole, isAuthReady, apiUrl, authtoken]);

  const addOrRemoveQuestion = (question: string) => {
    setQuestionsAdded((prev) =>
      prev.includes(question)
        ? prev.filter((q) => q !== question)
        : [...prev, question]
    );
  };

  // Show loading state while waiting for auth
  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex w-full items-center justify-center">
        <div className="flex items-center space-x-2">
          <LoaderIcon className="animate-spin" />
          <span>Initializing...</span>
        </div>
      </div>
    );
  }

  if (isLoadingRoles) {
    return (
      <div className="min-h-screen flex w-full items-center justify-center">
        <div className="flex items-center space-x-2">
          <LoaderIcon className="animate-spin" />
          <span>Loading roles...</span>
        </div>
      </div>
    );
  }

  if (rolesError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500 space-y-4">
          <p>{rolesError}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-200 py-8">
      {/* Removed border, added py-8 for padding */}
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gray-100 p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="font-bold text-3xl text-gray-800">
              Configure Assessment
            </h1>
            <div className="mb-6 flex flex-col md:flex-row justify-between">
              <Button
                disabled={questionsAdded.length === 0 || isConfiguring}
                onClick={handleConfigureAssessment}
                className="mt-4 md:mt-0"
              >
                {isConfiguring ? (
                  <>
                    <LoaderIcon className="mr-2 animate-spin" />
                    Configuring....
                  </>
                ) : (
                  "Configure Assessment"
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div>
            {selectedRole && (
              <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                <h2 className="font-semibold text-md text-gray-800">
                  {role?.name}
                </h2>
                <p>{currentRoleDescription || "No description available"}</p>
              </div>
            )}
          </div>

          {selectedRole && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Leftpanel
                questionsAdded={questionsAdded}
                removeQuestion={addOrRemoveQuestion}
                addCustomQuestion={addOrRemoveQuestion}
              />
              <RightPanel
                questionsAdded={questionsAdded}
                addOrRemoveQuestion={addOrRemoveQuestion}
                aiSuggestions={currentAISuggestions}
                isLoadingQuestions={isLoadingQuestions}
                questionsError={questionsError}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface RightPanelProps {
  questionsAdded: string[];
  addOrRemoveQuestion: (question: string) => void;
  aiSuggestions: string[];
  isLoadingQuestions: boolean;
  questionsError: string | null;
}

const RightPanel: React.FC<RightPanelProps> = ({
  questionsAdded,
  addOrRemoveQuestion,
  aiSuggestions,
  isLoadingQuestions,
  questionsError,
}) => {
  if (isLoadingQuestions) {
    return (
      <div className="space-y-4 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <LoaderIcon className="animate-spin" />
          <span>Loading suggested questions...</span>
        </div>
      </div>
    );
  }

  if (questionsError) {
    return (
      <div className="space-y-4 text-center text-red-500">
        <p>{questionsError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-bold text-xl text-gray-800 mb-4">
          AI Suggested Questions
        </h2>
        <div className="space-y-4 pr-2">
          {aiSuggestions?.map((question) => (
            <QuestionCard
              key={question}
              question={question}
              onAddRemove={() => addOrRemoveQuestion(question)}
              isAdded={questionsAdded.includes(question)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Rest of the component remains the same (QuestionCard and Leftpanel)

interface RightPanelProps {
  questionsAdded: string[];
  addOrRemoveQuestion: (question: string) => void;
  aiSuggestions: string[];
}

// const RightPanel: React.FC<RightPanelProps> = ({
//   questionsAdded,
//   addOrRemoveQuestion,
//   aiSuggestions
// }) => {
//   return(
//     <div className='space-y-4'>
//       <div>
//         <h2 className='font-bold text-xl text-gray-800 mb-4'>AI Suggested Questions</h2>
//         <div className='space-y-4'>
//           {aiSuggestions.map((question) => (
//             <QuestionCard
//               key={question}
//               question={question}
//               onAddRemove={() => addOrRemoveQuestion(question)}
//               isAdded={questionsAdded.includes(question)}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }

interface QuestionCardProps {
  question: string;
  onAddRemove: () => void;
  isAdded: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAddRemove,
  isAdded,
}) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-all duration-300">
      <p className="mb-4 text-gray-700">{question}</p>
      <Button
        onClick={onAddRemove}
        variant={isAdded ? "destructive" : "default"}
        className="w-full"
      >
        {isAdded ? (
          <>
            <TrashIcon className="mr-2 h-4 w-4" />
            Remove from Assessment
          </>
        ) : (
          <>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add to Assessment
          </>
        )}
      </Button>
    </div>
  );
};

interface LeftpanelProps {
  questionsAdded: string[];
  removeQuestion: (question: string) => void;
  addCustomQuestion: (question: string) => void;
}

const Leftpanel: React.FC<LeftpanelProps> = ({
  questionsAdded,
  removeQuestion,
  addCustomQuestion,
}) => {
  const [newQuestion, setNewQuestion] = useState<string>("");

  const handleAddCustomQuestion = () => {
    if (newQuestion.trim()) {
      // Add the custom question instead of removing it
      addCustomQuestion(newQuestion);
      setNewQuestion("");
    }
  };

  return (
    <div className="bg-gray-100 h-full rounded-xl p-6 space-y-4">
      <div>
        <h2 className="font-bold text-xl text-gray-800 mb-4">
          Added Questions
        </h2>
        {questionsAdded.length === 0 ? (
          <div className="text-gray-500 italic text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            No questions added yet
          </div>
        ) : (
          <div className="space-y-2">
            {questionsAdded.map((question, index) => (
              <div
                key={index}
                className="bg-white p-3 rounded-lg shadow-sm flex justify-between items-center"
              >
                <span className="text-gray-700">{`${
                  index + 1
                }. ${question}`}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeQuestion(question)}
                >
                  <TrashIcon className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex space-x-2">
        <Input
          type="text"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Add a custom question"
          className="flex-grow"
        />
        <Button
          onClick={handleAddCustomQuestion}
          disabled={!newQuestion.trim()}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Add
        </Button>
      </div>
    </div>
  );
};

const AssessmentPage: React.FC = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Assessment />
  </Suspense>
);

export default AssessmentPage;
