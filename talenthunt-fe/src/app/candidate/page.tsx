"use client";
import React, { Suspense, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeIcon, BookIcon, BriefcaseIcon, TargetIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { redirect, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LoaderIcon } from "lucide-react";

interface UserData {
  pi?: {
    Name?: string;
    "Phone Number"?: string;
    Email?: string;
  };
  work_history?: {
    "Work Experience"?: Array<{
      Role: string;
      "Company Name": string;
      Duration: string;
    }>;
  };
  projects?: {
    "Project details"?: Array<{
      "Project Name": string;
      "Project Description": string;
    }>;
  };
  education?: string;
  skills?: string;
}

const CandidateProfile: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const profile_id = searchParams.get("profile_id");
  const role_id = searchParams.get("role_id");

  useEffect(() => {
    const getuserdata = async () => {
      try {
        const response = await fetch(
          "https://tbtataojvhqyvlnzckwe.supabase.co/functions/v1/talenthunt-apis",
          {
            method: "POST",
            headers: {
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRidGF0YW9qdmhxeXZsbnpja3dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4NjEwMjIsImV4cCI6MjA0ODQzNzAyMn0.WpMB4UUuGiyT2COwoHdfNNS9AB3ad-rkctxJSVgDp7I",
            },
            body: JSON.stringify({
              requestType: "getProfileSummary",
              profile_id: profile_id,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const finaluserdata = await response.json();
        setUserData(finaluserdata[0]);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error fetching data:", error.message);
          setError(error.message);
        } else {
          console.error("Unexpected error:", error);
        }
      }
    };
    getuserdata();
  }, [profile_id]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex w-full items-center justify-center">
        <div className="flex items-center jusspace-x-2">
          <LoaderIcon className="animate-spin" />
          <span>Loading</span>
        </div>
      </div>
    );
  }

  const candidateData = {
    personalInfo: {
      name: userData.pi?.Name,
      phone: userData.pi?.["Phone Number"],
      email: userData.pi?.Email,
    },
    workExperience: userData.work_history?.["Work Experience"] || [],
    projects: userData.projects?.["Project details"] || [],
    education: userData.education,
    skills: userData.skills?.split(",") || [],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 w-full flex flex-col p-4 md:p-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
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
                <p>
                  <strong>Name:</strong> {candidateData.personalInfo.name}
                </p>
                <p>
                  <strong>Phone:</strong> {candidateData.personalInfo.phone}
                </p>
                <p>
                  <strong>Email:</strong> {candidateData.personalInfo.email}
                </p>
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
                {candidateData.workExperience.map((value, index) => (
                  <div key={index} className="mb-4">
                    <p className="font-semibold">{value.Role}</p>
                    <p className="text-gray-600">{value["Company Name"]}</p>
                    <p className="text-sm text-gray-500">{value.Duration}</p>
                  </div>
                ))}
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
          <Card className="md:col-span-2 lg:col-span-1 hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center">
                <CodeIcon className="mr-2 text-red-500" />
                <CardTitle>Projects</CardTitle>
              </div>
            </CardHeader>
            <ScrollArea className="h-[200px]">
              <CardContent>
                {candidateData.projects.map((value, index) => (
                  <div key={index} className="mb-4">
                    <p className="font-semibold">{value["Project Name"]}</p>
                    <p className="text-gray-600">
                      {value["Project Description"]}
                    </p>
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
                {candidateData.skills.map((skill, index) => (
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
            onClick={() => alert("Assessment Link Sent to the candidate!")}
          >
            Send Assessment Link
          </Button>
          <Button
            className="bg-primary hover:bg-primary-dark"
            onClick={() => {
              redirect(
                `assessment-result?role_id=${role_id}&profile_id=${profile_id}`
              );
            }}
          >
            Evaluate Assessment
          </Button>
        </div>
      </div>
    </div>
  );
};

const CandidateProfilePage: React.FC = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <CandidateProfile />
  </Suspense>
);

export default CandidateProfilePage;
