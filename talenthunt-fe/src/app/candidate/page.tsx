"use client";
import React, { Suspense, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookIcon,
  BriefcaseIcon,
  TargetIcon,
  FlagIcon,
  SparkleIcon,
  KanbanIcon,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { redirect, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LoaderIcon } from "lucide-react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import axios from "axios";
import useStore from "../stores/store";

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
      "Project Name"?: string;
      "Project Description"?: string;
    }>;
  };
  education?: string;
  skills?: string;
}

interface UserProfile {
  match_reasons?: string[];
  assessment_score?: number;
  created_at?: string;
  deleted?: boolean;
  email?: string;
  id?: number;
  name?: string;
  profile_url?: string;
  red_flags?: {
    high?: string[];
    low?: string[];
    medium?: string[];
  };
  role_id?: number;
  score?: number;
  status?: string;
  updated_at?: string;
}

interface Role {
  id: number;
  name: string;
}

const profileScoreChartConfig = {
  score: {
    label: "Profile Score",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const CandidateProfile: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [getProf, setgetProf] = useState<UserProfile>();
  const [roleName, setRoleName] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const profile_id = searchParams.get("profile_id");
  const role_id = searchParams.get("role_id");

  const { authtoken, apiUrl } = useStore();

  // Handle roles and user profile from session storage
  useEffect(() => {
    const rolejson: Role[] = JSON.parse(
      sessionStorage.getItem("ROLES") || "[]"
    );
    const profjson: UserProfile = JSON.parse(
      sessionStorage.getItem("USER_PROF") || "{}"
    );
    const role = rolejson.find((x) => x.id.toString() === role_id);
    if (role) {
      setRoleName(role.name);
    }
    setgetProf(profjson);
  }, [role_id]);

  const scaleScoreTo5 = (score: number | undefined): number => {
    if (!score) return 0;

    // If score is already between 0-5, return as is
    if (score <= 5) return Math.round(score);

    // Scale down scores that are out of 100
    if (score <= 20) return 1;
    if (score <= 40) return 2;
    if (score <= 60) return 3;
    if (score <= 80) return 4;
    return 5;
  };

  const getScoreColor = (score: number): string => {
    return score < 3 ? "#ef4444" : "#22c55e"; // red-500 for low scores, green-500 for high scores
  };

  const scaledProfileScore = scaleScoreTo5(getProf?.score);
  const scorePercentage = (scaledProfileScore / 5) * 100;

  useEffect(() => {
    const getUserData = async () => {
      if (!authtoken || !profile_id || !apiUrl) {
        return;
      }

      setIsLoading(true);
      try {
        console.log("Fetching data for profile:", profile_id);

        const response = await axios.get(
          `${apiUrl}/profiles/summary/${profile_id}`,
          {
            headers: {
              Authorization: `Bearer ${authtoken}`,
            },
          }
        );

        console.log("API Response:", response.data);
        const finalUserData: UserData = response.data;
        setUserData(finalUserData);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const message = error.response?.data?.error || error.message;
          console.error("Error details:", {
            status: error.response?.status,
            data: error.response?.data,
            message,
          });
          setError(message);
        } else {
          console.error("Unexpected error:", error);
          setError("An unexpected error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    getUserData();
  }, [authtoken, profile_id, apiUrl]);
  if (error) {
    return (
      <div className="min-h-screen flex w-full items-center justify-center">
        <Card className="w-full max-w-md p-6">
          <CardHeader>
            <CardTitle className="text-center text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">User profle not available</p>
            <div className="mt-4 flex justify-center">
              <Button onClick={() => window.history.back()} variant="outline">
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex w-full items-center justify-center">
        <Card className="w-full max-w-md p-6">
          <CardContent className="flex flex-col items-center space-y-4">
            <LoaderIcon className="animate-spin h-8 w-8 text-primary" />
            <p>Loading profile data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  // Modify the loading state to be consistent with the error display
  if (!userData) {
    return (
      <div className="min-h-screen flex w-full items-center justify-center">
        <Card className="w-full max-w-md p-6">
          <CardContent className="flex flex-col items-center space-y-4">
            <LoaderIcon className="animate-spin h-8 w-8 text-primary" />
            <p>Loading profile data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  const candidateData = {
    personalInfo: {
      name: userData?.pi?.Name || "Not Found",
      phone: userData?.pi?.["Phone Number"] || "Not Found",
      email: userData?.pi?.Email || "Not Found",
    },
    workExperience: Array.isArray(userData?.work_history?.["Work Experience"])
      ? userData.work_history["Work Experience"]
      : [],
    projects: Array.isArray(userData?.projects?.["Project details"])
      ? userData.projects["Project details"]
      : [],
    education: userData?.education || "Not Found",
    skills: userData?.skills?.split(",") || ["Not Found"],
  };

  return (
    <div className=" max-h-[90vh] w-full bg-gray-100 py-8 overflow-y-auto">
      <div className="w-full flex flex-col  md:p-8">
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

            {/* Profile Score Card*/}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent>
                <ChartContainer
                  config={profileScoreChartConfig}
                  className="mx-auto aspect-square max-h-[250px]"
                >
                  <RadialBarChart
                    data={[
                      {
                        score: scorePercentage, // Use the calculated percentage
                        fill: getScoreColor(scaledProfileScore),
                      },
                    ]}
                    startAngle={0}
                    endAngle={360} // Full circle
                    innerRadius={80}
                    outerRadius={110}
                  >
                    <PolarGrid
                      gridType="circle"
                      radialLines={false}
                      stroke="none"
                      className="first:fill-muted last:fill-background"
                      polarRadius={[86, 74]}
                    />
                    <RadialBar
                      dataKey="score"
                      background={{ fill: "#f3f4f6" }} // Light gray background
                      cornerRadius={10}
                    />
                    <PolarRadiusAxis
                      tick={false}
                      tickLine={false}
                      axisLine={false}
                    >
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                            return (
                              <text
                                x={viewBox.cx}
                                y={viewBox.cy}
                                textAnchor="middle"
                                dominantBaseline="middle"
                              >
                                <tspan
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  className="text-4xl font-bold"
                                  style={{
                                    fill: getScoreColor(scaledProfileScore),
                                  }}
                                >
                                  {scaledProfileScore} / 5
                                </tspan>
                                <tspan
                                  x={viewBox.cx}
                                  y={(viewBox.cy || 0) + 24}
                                  className="fill-muted-foreground"
                                >
                                  Profile Score
                                </tspan>
                              </text>
                            );
                          }
                        }}
                      />
                    </PolarRadiusAxis>
                  </RadialBarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Assessment Score Card */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent>
                <ChartContainer
                  config={profileScoreChartConfig}
                  className="mx-auto aspect-square max-h-[250px]"
                >
                  <RadialBarChart
                    data={[
                      {
                        score: getProf?.assessment_score ?? 0,
                        fill: "var(--color-score)",
                      },
                    ]}
                    startAngle={0}
                    endAngle={100}
                    innerRadius={80}
                    outerRadius={110}
                  >
                    <PolarGrid
                      gridType="circle"
                      radialLines={false}
                      stroke="none"
                      className="first:fill-muted last:fill-background"
                      polarRadius={[86, 74]}
                    />
                    <RadialBar dataKey="score" background cornerRadius={10} />
                    <PolarRadiusAxis
                      tick={false}
                      tickLine={false}
                      axisLine={false}
                    >
                      <Label
                        className="flex item-center justify-center"
                        content={({ viewBox }) => {
                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                            return (
                              <text
                                x={viewBox.cx}
                                y={viewBox.cy}
                                textAnchor="middle"
                                dominantBaseline="middle"
                              >
                                <tspan
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  className="fill-foreground text-4xl font-bold "
                                >
                                  {getProf?.assessment_score?.toLocaleString() ??
                                    "0"}
                                </tspan>

                                <tspan
                                  x={viewBox.cx}
                                  y={(viewBox.cy || 0) + 24}
                                  className="fill-muted-foreground"
                                >
                                  {getProf?.assessment_score
                                    ? "Assessment Score"
                                    : "Assessment is pending"}
                                </tspan>
                              </text>
                            );
                          }
                        }}
                      />
                    </PolarRadiusAxis>
                  </RadialBarChart>
                </ChartContainer>
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
                        <p className="font-semibold">{value.Role}</p>
                        <p className="text-gray-600">{value["Company Name"]}</p>
                        <p className="text-sm text-gray-500">
                          {value.Duration}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p>Not Found</p>
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
                  <p>{candidateData.education}</p>
                </CardContent>
              </ScrollArea>
            </Card>

            {/* Projects Card */}
            <Card className="md:col-span-2 lg:col-span-1 hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center">
                  <KanbanIcon className="mr-2 text-red-500" />
                  <CardTitle>Projects</CardTitle>
                </div>
              </CardHeader>
              <ScrollArea className="h-[200px]">
                <CardContent>
                  {candidateData.projects.length > 0 ? (
                    candidateData.projects.map((value, index) => (
                      <div key={index} className="mb-4">
                        <p className="font-semibold">{value["Project Name"]}</p>
                        <p className="text-gray-600">
                          {value["Project Description"]}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p>Not Found</p>
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
                  {candidateData.skills.length > 0 ? (
                    candidateData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span>Not Found</span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Match Results Card */}
            <Card className="md:col-span-2 lg:col-span-1 hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center">
                  <SparkleIcon className="mr-2 text-red-500" />
                  <CardTitle>Match Results for role - {roleName} </CardTitle>
                </div>
              </CardHeader>
              <ScrollArea className="h-[200px]">
                <CardContent>
                  {getProf?.match_reasons?.map((value, index) => (
                    <div key={index} className="mb-4">
                      <p className="text-gray-600">{value}</p>
                    </div>
                  ))}
                </CardContent>
              </ScrollArea>
            </Card>
            {/* Red Flags */}
            <Card className="md:col-span-2 lg:col-span-1 hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center">
                  <FlagIcon className="mr-2 text-red-500" />
                  <CardTitle>Red Flags for the Candidate</CardTitle>
                </div>
              </CardHeader>
              <ScrollArea className="h-[200px]">
                <CardContent>
                  {getProf?.red_flags?.high &&
                    getProf?.red_flags?.high?.length > 1 && (
                      <div key="1" className="mb-4">
                        <p className="font-semibold">High</p>
                        {getProf?.red_flags.high.map((value, index) => (
                          <p key={index} className="text-gray-600">
                            {value}
                          </p>
                        ))}
                      </div>
                    )}
                  {getProf?.red_flags?.medium &&
                    getProf?.red_flags?.medium?.length > 1 && (
                      <div key="2" className="mb-4">
                        <p className="font-semibold">Medium</p>
                        {getProf?.red_flags?.medium.map((value, index) => (
                          <p key={index} className="text-gray-600">
                            {value}
                          </p>
                        ))}
                      </div>
                    )}
                  {getProf?.red_flags?.low &&
                    getProf?.red_flags?.low?.length > 1 && (
                      <div key="3" className="mb-4">
                        <p className="font-semibold">Low</p>
                        {getProf?.red_flags?.low.map((value, index) => (
                          <p key={index} className="text-gray-600">
                            {value}
                          </p>
                        ))}
                      </div>
                    )}
                </CardContent>
              </ScrollArea>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center mt-8 space-x-4">
            <Button
              variant="outline"
              className="hover:bg-gray-100"
              onClick={() => {
                const baseUrl = window.location.origin;
                const assessmentLink = `${baseUrl}/assessment?role_id=${role_id}&profile_id=${profile_id}`;
                navigator.clipboard
                  .writeText(assessmentLink)
                  .then(() => {
                    alert("Assessment link copied to clipboard");
                  })
                  .catch((err) => {
                    console.error("Failed to copy text: ", err);
                  });
              }}
            >
              Copy Assessment Link
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
    </div>
  );
};

const CandidateProfilePage: React.FC = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <CandidateProfile />
  </Suspense>
);

export default CandidateProfilePage;
