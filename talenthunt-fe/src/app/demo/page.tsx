"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUp, Search, ShieldCheck, RotateCcw, Loader2 } from "lucide-react";

// Types and Interfaces
type Step = 1 | 2 | 3;
type LoadingState = {
  createRole: boolean;
  uploadResume: boolean;
  fetchProfile: boolean;
};

interface MatchResults {
  profileScore: number;
  name: string;
  matchReasons: string;
  flagReasons: string;
}

interface StepProps {
  currentStep: number;
  totalSteps: number;
}

const API_URL =
  "https://tbtataojvhqyvlnzckwe.supabase.co/functions/v1/talenthunt-apis";
const AUTH_TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRidGF0YW9qdmhxeXZsbnpja3dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4NjEwMjIsImV4cCI6MjA0ODQzNzAyMn0.WpMB4UUuGiyT2COwoHdfNNS9AB3ad-rkctxJSVgDp7I";
const MIN_JD_LENGTH = 100;

const LoadingSpinner: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <Loader2 className={`w-${size} h-${size} animate-spin`} />
);

// Helper Components
const StepNumber = ({
  step,
  currentStep,
}: {
  step: number;
  currentStep: number;
}) => (
  <div
    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
      currentStep === step
        ? "bg-blue-500 text-white"
        : currentStep > step
        ? "bg-blue-300 text-white"
        : "bg-gray-200 text-gray-600"
    }`}
  >
    {step}
  </div>
);

const StepIndicator: React.FC<StepProps> = ({ currentStep, totalSteps }) => (
  <div className="w-full flex items-center justify-between mb-8">
    {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
      <div key={step} className="flex items-center flex-1 relative">
        <StepNumber step={step} currentStep={currentStep} />
        {step < totalSteps && (
          <div className="h-[2px] flex-1 mx-2 relative">
            <div className="absolute inset-0 bg-gray-200" />
            <div
              className={`absolute inset-0 bg-blue-500 transition-all duration-300
                ${currentStep > step ? "w-full" : "w-0"}`}
            />
          </div>
        )}
      </div>
    ))}
  </div>
);

const ResumeMatchDemo: React.FC = () => {
  // State Management
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [formData, setFormData] = useState({
    jobDescription: "",
    roleName: "",
    roleId: undefined as number | undefined,
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [matchResults, setMatchResults] = useState<MatchResults | null>(null);
  const [loadingStates, setLoadingStates] = useState<LoadingState>({
    createRole: false,
    uploadResume: false,
    fetchProfile: false,
  });

  const setLoading = (key: keyof LoadingState, value: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [key]: value }));
  };

  const isAnyLoading = Object.values(loadingStates).some((state) => state);

  // API Handlers
  const createRole = async () => {
    setLoading("createRole", true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { Authorization: AUTH_TOKEN },
        body: JSON.stringify({
          requestType: "createRole",
          role: {
            name: `demo_${formData.roleName}`,
            job_description: formData.jobDescription,
          },
        }),
      });

      if (!response.ok) throw new Error("Failed to create role");

      const data = await response.json();
      setFormData((prev) => ({ ...prev, roleId: data.id }));
      return data;
    } catch (error) {
      console.error("Error creating role:", error);
      throw error;
    } finally {
      setLoading("createRole", false);
    }
  };

  const uploadResume = async (file: File) => {
    setLoading("uploadResume", true);
    try {
      // Get signed URL
      const urlResponse = await fetch(API_URL, {
        method: "POST",
        headers: { Authorization: AUTH_TOKEN },
        body: JSON.stringify({
          requestType: "getSignedUrl",
          role_id: formData.roleId,
        }),
      });

      if (!urlResponse.ok) throw new Error("Failed to get signed URL");

      const { signedUrl, path, token } = await urlResponse.json();

      // Upload file
      const uploadResponse = await fetch(signedUrl, {
        method: "PUT",
        headers: {
          Authorization: token,
          "Content-Type": "application/octet-stream",
        },
        body: file,
      });

      if (!uploadResponse.ok) throw new Error("Failed to upload file");

      // Create profile
      const profileResponse = await fetch(API_URL, {
        method: "POST",
        headers: { Authorization: AUTH_TOKEN },
        body: JSON.stringify({
          requestType: "createProfile",
          profile: {
            role_id: formData.roleId,
            profile_url: `https://tbtataojvhqyvlnzckwe.supabase.co/storage/v1/object/hackathon/${path}`,
          },
        }),
      });

      if (!profileResponse.ok) throw new Error("Failed to create profile");

      const profileData = await profileResponse.json();
      return profileData;
    } catch (error) {
      console.error("Error in upload process:", error);
      throw error;
    } finally {
      setLoading("uploadResume", false);
    }
  };

  const fetchProfileData = async (profileId: number) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { Authorization: AUTH_TOKEN },
        body: JSON.stringify({
          requestType: "getProfile",
          profile_id: profileId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    } finally {
    }
  };

  // Event Handlers
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setResumeFile(file);
    }
  };

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload({
        target: { files: [file] },
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const validateAndProceed = async () => {
    if (
      formData.jobDescription.length < MIN_JD_LENGTH ||
      !formData.roleName.trim()
    )
      return;

    try {
      await createRole();
      setCurrentStep(2);
    } catch (error) {
      console.error("Error in validateAndProceed:", error);
      alert("Failed to create role. Please try again.");
    }
  };

  const handleMatch = async () => {
    if (!resumeFile) return;

    try {
      const profileData = await uploadResume(resumeFile);

      let fetchedProfileData;
      let attempts = 0;
      const maxAttempts = 10;
      const delay = 2000; // 2 seconds between attempts
      setLoading("fetchProfile", true);

      do {
        fetchedProfileData = await fetchProfileData(profileData.newProfile.id);
        if (fetchedProfileData.score === null && attempts < maxAttempts - 1) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
        attempts++;
      } while (fetchedProfileData.score === null);

      if (fetchedProfileData.score !== null) {
        setLoading("fetchProfile", false);
        setMatchResults({
          profileScore: fetchedProfileData.score,
          name: fetchedProfileData.name,
          matchReasons: fetchedProfileData.match_reasons.join(", "),
          flagReasons: [
            ...fetchedProfileData.red_flags.low,
            ...fetchedProfileData.red_flags.medium,
            ...fetchedProfileData.red_flags.high,
          ].join(", "),
        });
        setCurrentStep(3);
      } else {
        throw new Error(
          "Failed to retrieve valid profile data after multiple attempts"
        );
      }
    } catch (error) {
      console.error("Error during handleMatch:", error);
      alert("Failed to process resume. Please try again.");
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setFormData({ jobDescription: "", roleName: "", roleId: undefined });
    setResumeFile(null);
    setMatchResults(null);
    setLoadingStates({
      createRole: false,
      uploadResume: false,
      fetchProfile: false,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6 h-full">
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-2xl md:text-4xl text-gray-900 font-extrabold font-mono">
              Resume Matching Demo
            </h2>
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={resetForm}
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            )}
          </div>

          {/* Step Indicator */}
          <StepIndicator currentStep={currentStep} totalSteps={3} />

          {/* Main Content Card */}
          <Card className="w-full shadow-lg relative">
            {isAnyLoading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                <div className="flex flex-col items-center gap-4">
                  <LoadingSpinner size={32} />
                  <p className="text-gray-600">
                    {loadingStates.createRole && "Creating role..."}
                    {loadingStates.uploadResume && "Uploading resume..."}
                    {loadingStates.fetchProfile && "Analyzing profile..."}
                  </p>
                </div>
              </div>
            )}

            <CardHeader>
              <CardTitle className="flex items-center text-xl md:text-2xl">
                {currentStep === 1 && (
                  <>
                    <Search className="mr-2 text-blue-500" />
                    Enter Job Description
                  </>
                )}
                {currentStep === 2 && (
                  <>
                    <FileUp className="mr-2 text-blue-500" />
                    Upload Resume
                  </>
                )}
                {currentStep === 3 && (
                  <>
                    <ShieldCheck className="mr-2 text-blue-500" />
                    Match Results
                  </>
                )}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {currentStep === 1 && (
                <div className="flex flex-col space-y-4">
                  <div>
                    <Label
                      htmlFor="roleName"
                      className="flex items-center gap-3"
                    >
                      Role Name
                    </Label>
                    <Input
                      id="roleName"
                      className="mt-2"
                      placeholder="Enter the role name"
                      value={formData.roleName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          roleName: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="jobDescription"
                      className="flex items-center gap-3"
                    >
                      Job Description
                      <span className="text-sm text-gray-500">
                        (minimum {MIN_JD_LENGTH} characters required)
                      </span>
                    </Label>
                    <div className="mt-2 relative h-64 md:h-80">
                      <textarea
                        id="jobDescription"
                        className="w-full h-full p-3 resize-none border rounded-md focus:ring-2 focus:ring-blue-500"
                        placeholder={`Paste the full job description here (minimum ${MIN_JD_LENGTH} characters)...`}
                        value={formData.jobDescription}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            jobDescription: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={validateAndProceed}
                      disabled={
                        formData.jobDescription.length < MIN_JD_LENGTH ||
                        !formData.roleName.trim() ||
                        isAnyLoading
                      }
                      className="flex items-center gap-2"
                    >
                      {loadingStates.createRole ? (
                        <LoadingSpinner />
                      ) : (
                        "Next Step"
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="flex flex-col space-y-4">
                  <div
                    className="w-full h-64 border-2 border-dashed rounded-md"
                    onDrop={handleFileDrop}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      id="resumeUpload"
                      onChange={handleFileUpload}
                    />
                    <label
                      htmlFor="resumeUpload"
                      className="cursor-pointer flex flex-col items-center justify-center h-full"
                    >
                      <FileUp className="w-12 h-12 text-gray-400 mb-4" />
                      <p className="text-gray-600 text-center px-4">
                        {resumeFile
                          ? `Selected: ${resumeFile.name}`
                          : "Drag & drop or click to upload resume"}
                      </p>
                    </label>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={handleMatch}
                      disabled={!resumeFile || isAnyLoading}
                      className="flex items-center gap-2"
                    >
                      {loadingStates.uploadResume ||
                      loadingStates.fetchProfile ? (
                        <>
                          <LoadingSpinner />
                          Analyzing
                        </>
                      ) : (
                        "Analyze Match"
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === 3 && matchResults && (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <p className="text-lg font-semibold break-words">
                      {matchResults.name}
                    </p>
                    <p className="text-lg font-semibold whitespace-nowrap">
                      Profile Score:{" "}
                      <span
                        className={
                          matchResults.profileScore > 40
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {matchResults.profileScore}%
                      </span>
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-green-50 border-green-200 border">
                      <div className="flex flex-col space-y-2">
                        <span className="font-semibold">Match Reasons</span>
                        <span className="text-green-600 break-words">
                          {matchResults.matchReasons}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-red-50 border-red-200 border">
                      <div className="flex flex-col space-y-2">
                        <span className="font-semibold">Flag Reasons</span>
                        <span className="text-red-600 break-words">
                          {matchResults.flagReasons}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResumeMatchDemo;
