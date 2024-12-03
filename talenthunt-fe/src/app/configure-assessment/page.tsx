'use client'
import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusIcon, TrashIcon, LoaderIcon } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"
import { useMemo } from 'react';


interface Role {
  name: string;
  id: string;
  job_description: string;
  suggested_questions?: string[];
}

const Assessment: React.FC = () => {
  const { toast } = useToast()
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [questionsAdded, setQuestionsAdded] = useState<string[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [currentRoleDescription, setCurrentRoleDescription] = useState<string>('');
  const [currentAISuggestions, setCurrentAISuggestions] = useState<string[]>([]);
  
  // New state for loading and error handling
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [rolesError, setRolesError] = useState<string | null>(null);
  const [questionsError, setQuestionsError] = useState<string | null>(null);


  const handleConfigureAssessment = async () => {
    if (!selectedRole) {
      toast({
        title: "Error",
        description: "Please select a role before configuring the assessment",
        variant: "destructive"
      });
      return;
    }

    setIsConfiguring(true);
    try {
      const response = await fetch("https://tbtataojvhqyvlnzckwe.supabase.co/functions/v1/talenthunt-apis", {
        method: "POST",
        headers: {
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRidGF0YW9qdmhxeXZsbnpja3dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4NjEwMjIsImV4cCI6MjA0ODQzNzAyMn0.WpMB4UUuGiyT2COwoHdfNNS9AB3ad-rkctxJSVgDp7I"
        },
        body: JSON.stringify({
          "requestType": "createCustomQuestions",
          "role_id": selectedRole,
          "questions": questionsAdded
        })
      });
      console.log(response)

      alert('Assessment configured successfully');
      setQuestionsAdded([]);
      // const data = await response.json();
      // console.log('Response:', data);
      // if (!response.ok) {
      //   throw new Error('Failed to configure assessment');
      // }

      toast({
        title: "Success",
        description: "Assessment configured successfully",
      });
    } catch (error) {
      console.error('Error configuring assessment:', error);
      toast({
        title: "Error",
        description: "Failed to configure assessment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsConfiguring(false);
    }
  };

  useEffect(() => {
    const getRoles = async () => {
      setIsLoadingRoles(true);
      setRolesError(null);
      try {
        const response = await fetch("https://tbtataojvhqyvlnzckwe.supabase.co/functions/v1/talenthunt-apis", {
          method: "POST",
          headers: {
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRidGF0YW9qdmhxeXZsbnpja3dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4NjEwMjIsImV4cCI6MjA0ODQzNzAyMn0.WpMB4UUuGiyT2COwoHdfNNS9AB3ad-rkctxJSVgDp7I"
          },
          body: JSON.stringify({
            "requestType": "getRoles",
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch roles');
        }

        const data = await response.json();
        const formattedRoles = data.map((role: Role) => ({
          name: role.name,
          id: role.id,
          job_description: role.job_description,
          suggested_questions: role.suggested_questions || []
        }));
        setRoles(formattedRoles);
      } catch (error) {
        console.error('Error fetching roles:', error);
        setRolesError('Failed to load roles. Please try again later.');
      } finally {
        setIsLoadingRoles(false);
      }
    };

    getRoles();
  }, []);

  const dummyQuestions = useMemo(() => [
    'What are the key responsibilities of a Front-end Developer?',
    'Explain the concept of RESTful APIs and their importance in web development.',
    'How do you prioritize tasks when managing a project with tight deadlines?',
    'Describe a challenging situation you faced in a team project and how you handled it.',
    'What strategies do you use to ensure effective communication within a cross-functional team?'
  ], []);

  useEffect(() => {
    const getAIQuestions = async () => {
      if (selectedRole) {
        setIsLoadingQuestions(true);
        setQuestionsError(null);
        try {
          const response = await fetch("https://tbtataojvhqyvlnzckwe.supabase.co/functions/v1/talenthunt-apis", {
            method: "POST",
            headers: {
              "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRidGF0YW9qdmhxeXZsbnpja3dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4NjEwMjIsImV4cCI6MjA0ODQzNzAyMn0.WpMB4UUuGiyT2COwoHdfNNS9AB3ad-rkctxJSVgDp7I"
            },
            body: JSON.stringify({
              "requestType": "getRoleQuestions",
              "role_id": selectedRole,
            }),
          });
          const data = await response.json();
          console.log(data)

          setCurrentAISuggestions(data.questions);
        } catch (error) {
          console.error('Error fetching AI questions:', error);

        } finally {
          setIsLoadingQuestions(false);
        }
      }
    };

    if (selectedRole) {
      const currentRole = roles.find(role => role.id === selectedRole);
      
      // Update role description
      setCurrentRoleDescription(currentRole?.job_description || '');
      
      // Fetch AI suggested questions
      getAIQuestions();
      
      // Clear previously added questions
      setQuestionsAdded([]);
    }
  }, [selectedRole, roles, dummyQuestions]);

  const addOrRemoveQuestion = (question: string) => {
    setQuestionsAdded(prev => 
      prev.includes(question) 
        ? prev.filter(q => q !== question)
        : [...prev, question]
    );
  };

  // Render loading state for roles
  if (isLoadingRoles) {
    return (
      <div className='min-h-screen flex w-full items-center justify-center'>
        <div className='flex items-center jusspace-x-2'>
          <LoaderIcon className='animate-spin' />
          <span>Loading roles...</span>
        </div>
      </div>
    );
  }

  // Render error state for roles
  if (rolesError) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center text-red-500 space-y-4'>
          <p>{rolesError}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen w-full bg-gray-50 p-8'>
      <div className='max-w-6xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden'>
        <div className='bg-gray-100 p-6 border-b border-gray-200'>
          <h1 className='font-bold text-3xl text-gray-800'>
            Configure Assessment
          </h1>
        </div>
  
        <div className='p-6'>
          <div>
            <div className='mb-6 flex flex-col md:flex-row justify-between'>
              <Select onValueChange={(value: string) => setSelectedRole(value)}>
                <SelectTrigger className="w-full max-w-md">
                  <SelectValue placeholder="Choose the Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button 
                disabled={questionsAdded.length === 0 || isConfiguring} 
                onClick={handleConfigureAssessment}
                className='mt-4 md:mt-0'
              >
                {isConfiguring ? (
                  <>
                    <LoaderIcon className='mr-2 animate-spin' />
                    Configuring...
                  </>
                ) : (
                  'Configure Assessment'
                )}
              </Button>
            </div>
            
            {selectedRole && (
              <div className='mt-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg'>
                <span className='font-semibold text-gray-800'>Role Description: </span>
                {currentRoleDescription}
              </div>
            )}
          </div>
  
          {selectedRole && (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
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
  )
}

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
  questionsError
}) => {
  if (isLoadingQuestions) {
    return (
      <div className='space-y-4 flex items-center justify-center'>
        <div className='flex items-center space-x-2'>
          <LoaderIcon className='animate-spin' />
          <span>Loading suggested questions...</span>
        </div>
      </div>
    );
  }

  if (questionsError) {
    return (
      <div className='space-y-4 text-center text-red-500'>
        <p>{questionsError}</p>
      </div>
    );
  }

  return(
    <div className='space-y-4'>
      <div>
        <h2 className='font-bold text-xl text-gray-800 mb-4'>AI Suggested Questions</h2>
        <div className='space-y-4'>
          {aiSuggestions.map((question) => (
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
  )
}

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
  isAdded 
}) => {
  return (
    <div className='border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-all duration-300'>
      <p className='mb-4 text-gray-700'>{question}</p>
      <Button 
        onClick={onAddRemove}
        variant={isAdded ? 'destructive' : 'default'}
        className='w-full'
      >
        {isAdded ? (
          <>
            <TrashIcon className='mr-2 h-4 w-4' />
            Remove from Assessment
          </>
        ) : (
          <>
            <PlusIcon className='mr-2 h-4 w-4' />
            Add to Assessment
          </>
        )}
      </Button>
    </div>
  );
}

interface LeftpanelProps {
  questionsAdded: string[];
  removeQuestion: (question: string) => void;
  addCustomQuestion: (question: string) => void;
}

const Leftpanel: React.FC<LeftpanelProps> = ({ 
  questionsAdded, 
  removeQuestion,
  addCustomQuestion
}) => {
  const [newQuestion, setNewQuestion] = useState<string>('');

  const handleAddCustomQuestion = () => {
    if (newQuestion.trim()) {
      // Add the custom question instead of removing it
      addCustomQuestion(newQuestion);
      setNewQuestion('');
    }
  };

  return (
    <div className='bg-gray-100 h-full rounded-xl p-6 space-y-4'>
      <div>
        <h2 className='font-bold text-xl text-gray-800 mb-4'>Added Questions</h2>
        {questionsAdded.length === 0 ? (
          <div className='text-gray-500 italic text-center py-8 border-2 border-dashed border-gray-300 rounded-lg'>
            No questions added yet
          </div>
        ) : (
          <div className='space-y-2'>
            {questionsAdded.map((question, index) => (
              <div 
                key={index} 
                className='bg-white p-3 rounded-lg shadow-sm flex justify-between items-center'
              >
                <span className='text-gray-700'>{`${index + 1}. ${question}`}</span>
                <Button 
                  variant='ghost' 
                  size='icon'
                  onClick={() => removeQuestion(question)}
                >
                  <TrashIcon className='h-4 w-4 text-red-500' />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className='flex space-x-2'>
        <Input 
          type='text' 
          value={newQuestion} 
          onChange={(e) => setNewQuestion(e.target.value)} 
          placeholder='Add a custom question' 
          className='flex-grow'
        />
        <Button 
          onClick={handleAddCustomQuestion} 
          disabled={!newQuestion.trim()}
        >
          <PlusIcon className='mr-2 h-4 w-4' />
          Add
        </Button>
      </div>
    </div>
  )
}

export default Assessment;