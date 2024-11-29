"use client"
import React, {use, useEffect} from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CodeIcon, 
  BookIcon, 
  BriefcaseIcon, 
  TargetIcon 
} from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area"
import { usePathname, useSearchParams } from 'next/navigation';

const CandidateProfile: React.FC = () => {
  const [userData, setUserData] = React.useState<any>(null);

  // const pathname = usePathname();
// console.log(pathname)
  const searchParams = useSearchParams(); // Parses query parameters
  const id = searchParams.get("id");

  const getuserdata = async () => {
    const dataapi: any = await fetch("https://tbtataojvhqyvlnzckwe.supabase.co/functions/v1/talenthunt-apis", {
      method: "POST",
      headers: {
        "Authorization" : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRidGF0YW9qdmhxeXZsbnpja3dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4NjEwMjIsImV4cCI6MjA0ODQzNzAyMn0.WpMB4UUuGiyT2COwoHdfNNS9AB3ad-rkctxJSVgDp7I"
      },
      body: JSON.stringify({
        "requestType" : "getProfileSummary",
        "profile_id": id
        }), 
    });
    if(dataapi.ok){
      const finaluserdata = await dataapi.json();
      setUserData(finaluserdata[0]);
      console.log(finaluserdata); 
    }
  }
  React.useEffect(() => {
    getuserdata();
  }, []); 

  // Candidate data (would typically come from props or API)
  const candidateData = {
    personalInfo: {
      name: userData?.pi?.Name,
      phone: userData?.pi['Phone Number'],
      email: userData?.pi?.Email,
    },
    workExperience: [
      {
        company: "Envision Infotech Pvt Ltd",
        role: "Software Engineer (UI)",
        duration: "Apr 2022 - Present"
      },
      {
        company: "Envision Infotech Pvt Ltd",
        role: "Software Engineer (UI)",
        duration: "Apr 2022 - Present"
      },
      {
        company: "Envision Infotech Pvt Ltd",
        role: "Software Engineer (UI)",
        duration: "Apr 2022 - Present"
      }
    ],
    projects: [
      {
        name: "AgroTech",
        description: "Agricultural product providing innovative solutions for agricultural problems."
      },
      {
        name: "Integrated HealthCare Information System (IHIS)",
        description: "Enterprise-wide solution for comprehensive patient information across care points."
      }
    ],
    education: userData?.education,
    skills: userData?.skills?.split(',')
  };

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
                <p><strong>Name:</strong> {candidateData.personalInfo.name}</p>
                <p><strong>Phone:</strong> {candidateData.personalInfo.phone}</p>
                <p><strong>Email:</strong> {candidateData.personalInfo.email}</p>
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
              {userData?.work_history['Work Experience']?.map((value: any, index: any) => (
                <div key={index} className="mb-4">
                  <p className="font-semibold">{value['Role']}</p>
                  <p className="text-gray-600">{value['Company Name']}</p>
                  <p className="text-sm text-gray-500">{value['Duration']}</p>
                </div>
              ))
            }
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
              <p>{candidateData.education}</p>
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
              {userData?.projects['Project details'].map((value:any, index:any) => (
                <div key={index} className="mb-4">
                  <p className="font-semibold">{value['Project Name']}</p>
                  <p className="text-gray-600">{value['Project Description']}</p>
                </div>
              ))}
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
                {candidateData?.skills?.map((skill: any, index: any) => (
                  <span 
                    key={index} 
                    className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded"
                  >
                    {skill}
                  </span>
                ))}
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