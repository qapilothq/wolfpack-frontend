"use client"
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CodeIcon, 
  BookIcon, 
  BriefcaseIcon, 
  TargetIcon 
} from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area"

// Define a type for user data
interface UserData {
  pi?: {
    Name?: string;
    'Phone Number'?: string;
    Email?: string;
  };
  work_history?: {
    'Work Experience'?: Array<{
      Role: string;
      'Company Name': string;
      Duration: string;
    }>;
  };
  education?: string;
  skills?: string;
  projects?: {
    'Project details': Array<{
      'Project Name': string;
      'Project Description': string;
    }>;
  };
}

interface CandidateProfileProps {
  searchParams: Promise<{ id?: string }>;
}

const CandidateProfile: React.FC<CandidateProfileProps> = ({ searchParams }) => {
  const [userData, setUserData] = React.useState<UserData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [resolvedSearchParams, setResolvedSearchParams] = React.useState<{ id?: string }>({});

  React.useEffect(() => {
    searchParams.then(params => {
      setResolvedSearchParams(params);
    }).catch(error => {
      console.error("Failed to resolve searchParams:", error);
    });
  }, [searchParams]);

  const getuserdata = React.useCallback(async () => {
    if (!resolvedSearchParams.id) {
      setIsLoading(false);
      return;
    }

    try {
      const dataapi = await fetch("https://tbtataojvhqyvlnzckwe.supabase.co/functions/v1/talenthunt-apis", {
        method: "POST",
        headers: {
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRidGF0YW9qdmhxeXZsbnpja3dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4NjEwMjIsImV4cCI6MjA0ODQzNzAyMn0.WpMB4UUuGiyT2COwoHdfNNS9AB3ad-rkctxJSVgDp7I"
        },
        body: JSON.stringify({
          "requestType": "getProfileSummary",
          "profile_id": resolvedSearchParams.id
        }),
      });
      
      if (dataapi.ok) {
        const finaluserdata = await dataapi.json();
        setUserData(finaluserdata[0]);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [resolvedSearchParams.id]);

  React.useEffect(() => {
    if (resolvedSearchParams.id) {
      getuserdata();
    }
  }, [resolvedSearchParams.id, getuserdata]);

  // Candidate data (would typically come from props or API)
  const candidateData = {
    personalInfo: {
      name: userData?.pi?.Name,
      phone: userData?.pi?.['Phone Number'], // Use optional chaining here
      email: userData?.pi?.Email,
    },
    workExperience: userData?.work_history?.['Work Experience'] || [],
    projects: userData?.projects?.['Project details'] || [],
    education: userData?.education,
    skills: userData?.skills?.split(',')
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Loading candidate profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 w-full flex flex-col p-8">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Personal Information Card */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center">
                <TargetIcon className="mr-2 text-blue-500" />
                <CardTitle>Personal Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Name:</strong> {candidateData.personalInfo.name || 'N/A'}</p>
                <p><strong>Phone:</strong> {candidateData.personalInfo.phone || 'N/A'}</p>
                <p><strong>Email:</strong> {candidateData.personalInfo.email || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Work Experience Card */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center">
                <BriefcaseIcon className="mr-2 text-green-500" />
                <CardTitle>Work Experience</CardTitle>
              </div>
            </CardHeader>
            <ScrollArea className="h-[200px]">
              <CardContent>
                {candidateData.workExperience.length > 0 ? (
                  candidateData.workExperience.map((value, index) => (
                    <div key={index} className="mb-4">
                      <p className="font-semibold">{value['Role']}</p>
                      <p className="text-gray-600">{value['Company Name']}</p>
                      <p className="text-sm text-gray-500">{value['Duration']}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No work experience found</p>
                )}
              </CardContent>
            </ScrollArea>
          </Card>

          {/* Education Card */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center">
                <BookIcon className="mr-2 text-purple-500" />
                <CardTitle>Education</CardTitle>
              </div>
            </CardHeader>
            <ScrollArea className="h-[200px]">
              <CardContent>
                <p>{candidateData.education || 'No education details found'}</p>
              </CardContent>
            </ScrollArea>
          </Card>

          {/* Projects Card */}
          <Card className="md:col-span-2 hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center">
                <CodeIcon className="mr-2 text-red-500" />
                <CardTitle>Projects</CardTitle>
              </div>
            </CardHeader>
            <ScrollArea className="h-[200px]">
              <CardContent>
                {candidateData.projects.length > 0 ? (
                  candidateData.projects.map((value, index) => (
                    <div key={index} className="mb-4">
                      <p className="font-semibold">{value['Project Name']}</p>
                      <p className="text-gray-600">{value['Project Description']}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No projects found</p>
                )}
              </CardContent>
            </ScrollArea>
          </Card>

          {/* Skills Card */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center">
                <TargetIcon className="mr-2 text-orange-500" />
                <CardTitle>Skills</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {candidateData.skills?.length ? (
                  candidateData.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded"
                    >
                      {skill.trim()}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">No skills found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center mt-8 space-x-4">
          <Button 
            variant="outline" 
            className="hover:bg-gray-100"
          >
            Download Resume
          </Button>
          <Button 
            className="bg-primary hover:bg-primary-dark"
          >
            Schedule Interview
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;