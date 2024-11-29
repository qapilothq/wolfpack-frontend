'use client'
import React, { useState } from 'react';
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
import { PlusIcon, TrashIcon } from 'lucide-react';

// Define the roles as a JSON object with type annotations
const roles: Record<string, string> = {
  'Front-end Dev': "Responsible for implementing visual elements that users see and interact within a web application.",
  'Back-end Dev': "Responsible for server-side web application logic and integration of the work front-end developers do.",
  'Product Manager': "Responsible for guiding the success of a product and leading the cross-functional team that is responsible for improving it.",
  'Project Manager': "Responsible for planning, executing, and overseeing the completion of projects to ensure that it is completed in line with the company's goals."
};

const AIsuggested: string[] = [
  'What are the key responsibilities of a Front-end Developer?',
  'Explain the concept of RESTful APIs and their importance in web development.',
  'How do you prioritize tasks when managing a project with tight deadlines?',
  'Describe a challenging situation you faced in a team project and how you handled it.',
  'What strategies do you use to ensure effective communication within a cross-functional team?'
];

const Assessment: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [questionsAdded, setQuestionsAdded] = useState<string[]>([]);

  const addOrRemoveQuestion = (question: string) => {
    setQuestionsAdded(prev => 
      prev.includes(question) 
        ? prev.filter(q => q !== question)
        : [...prev, question]
    );
  };

  return (
    <div className='min-h-screen w-full bg-gray-50 p-8'>
      <div className='max-w-6xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden'>
        <div className='bg-gray-100 p-6 border-b border-gray-200'>
          <h1 className='font-bold text-3xl text-gray-800'>
            Configure Assessment
          </h1>
        </div>

        <div className='p-6'>
          <div className='mb-6'>
            <Select onValueChange={(value: string) => setSelectedRole(value)}>
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="Choose the Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.keys(roles).map((roleName, index) => (
                    <SelectItem
                      key={index}
                      value={roleName}
                    >
                      {roleName}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {selectedRole && (
              <div className='mt-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg'>
                <span className='font-semibold text-gray-800'>Role Description: </span>
                {roles[selectedRole]}
              </div>
            )}
          </div>

          {selectedRole && (
            <div className='grid md:grid-cols-2 gap-6'>
              <Leftpanel 
                questionsAdded={questionsAdded} 
                removeQuestion={addOrRemoveQuestion} 
              />
              <RightPanel 
                selectedRole={selectedRole}
                questionsAdded={questionsAdded}
                addOrRemoveQuestion={addOrRemoveQuestion}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface RightPanelProps {
  selectedRole: string;
  questionsAdded: string[];
  addOrRemoveQuestion: (question: string) => void;
}

const RightPanel: React.FC<RightPanelProps> = ({ 
  selectedRole, 
  questionsAdded,
  addOrRemoveQuestion 
}) => {
  return(
    <div className='space-y-4'>
      <div>
        <h2 className='font-bold text-xl text-gray-800 mb-4'>AI Suggested Questions</h2>
        <div className='space-y-4'>
          {AIsuggested.map((question) => (
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
}

const Leftpanel: React.FC<LeftpanelProps> = ({ 
  questionsAdded, 
  removeQuestion 
}) => {
  const [newQuestion, setNewQuestion] = useState<string>('');

  const handleAddCustomQuestion = () => {
    if (newQuestion.trim()) {
      removeQuestion(newQuestion);
      setNewQuestion('');
    }
  };

  return (
    <div className='bg-gray-100 rounded-xl p-6 space-y-4'>
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