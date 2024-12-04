"use client";
import React, { useState } from "react";
import Combobox from "./dropdown";
import { FileUp } from "lucide-react";
import DataTable from "./table";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

const Index = () => {
  const { toast } = useToast();
  const [dropdownValue, setDropdownValue] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [refreshTable, setRefreshTable] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const newfile: File = event.target.files[0];
      console.log("Selected File:", newfile);
      if (dropdownValue) {
        await uploadFile(newfile);
      } else {
        alert("Please select a job title before uploading the file.");
      }
    }
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setIsLoading(true);
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
            requestType: "getSignedUrl",
            role_id: dropdownValue,
          }),
        }
      );

      if (response.ok) {
        const resp: { signedUrl: string; path: string; token: string } =
          await response.json();
        console.log("Response:", resp);
        const { signedUrl, path, token } = resp;
        console.log("URL:", signedUrl);

        if (signedUrl) {
          const fileuploadAPI = await fetch(signedUrl, {
            method: "PUT",
            headers: {
              Authorization: token,
              "Content-Type": "application/octet-stream",
            },
            body: file,
          });

          if (fileuploadAPI.ok) {
            const resumematch = await fetch(
              "https://tbtataojvhqyvlnzckwe.supabase.co/functions/v1/talenthunt-apis",
              {
                method: "POST",
                headers: {
                  Authorization:
                    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRidGF0YW9qdmhxeXZsbnpja3dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4NjEwMjIsImV4cCI6MjA0ODQzNzAyMn0.WpMB4UUuGiyT2COwoHdfNNS9AB3ad-rkctxJSVgDp7I",
                },
                body: JSON.stringify({
                  requestType: "createProfile",
                  profile: {
                    role_id: dropdownValue,
                    profile_url: `https://tbtataojvhqyvlnzckwe.supabase.co/storage/v1/object/hackathon/${path}`,
                  },
                }),
              }
            );

            if (resumematch.ok) {
              console.log("Profile created successfully");

              setRefreshTable((prev) => prev + 1);
              setIsLoading(false); // Set loading to false after refresh
            }
            setIsUploading(false);

            setDropdownValue(dropdownValue);

            toast({
              title: "File uploaded successfully!",
            });
          } else {
            toast({
              variant: "destructive",
              title: "Failed to upload the file.",
            });
          }
        }
      } else {
        toast({
          variant: "destructive",
          title: "Failed to upload the file.",
        });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        variant: "destructive",
        title: "An error occurred while uploading the file.",
      });
      setIsLoading(false);
    }
  };

  const handleDropdownSelect = (value: string) => {
    setDropdownValue(value);
    setIsLoading(true);
    console.log("Selected Dropdown Value:", value);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 md:p-8 flex flex-col items-center">
      <div className="w-full md:w-[60vw] mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="bg-gray-100 p-4 md:p-6 border-b border-gray-200 flex items-center">
          <h1 className="font-bold text-2xl md:text-3xl text-gray-800">
            Candidates Dashboard
          </h1>
        </div>
        <div className="flex flex-col md:flex-row gap-2 items-center justify-between p-4 md:p-6">
          <Combobox
            selectedValue={dropdownValue}
            onSelect={handleDropdownSelect}
          />
          <div className="flex flex-col md:flex-row gap-2">
            <Button
              variant="outline"
              className="hover:bg-gray-100"
              onClick={() =>
                redirect(`/configure-assessment?role_id=${dropdownValue}`)
              }
              disabled={!dropdownValue}
            >
              ConFigure Assessment
            </Button>
            <div>
              <input
                id="resume"
                type="file"
                style={{ display: "none" }}
                onChange={handleFileChange}
                disabled={!dropdownValue}
              />
              <Button
                onClick={() => document.getElementById("resume")?.click()}
                disabled={!dropdownValue || isLoading}
                className="mt-2 md:mt-0"
              >
                <FileUp /> {isUploading ? "Uploading..." : "Upload Resume"}
              </Button>
            </div>
          </div>
        </div>
        {dropdownValue && (
          <div className="max-w-full md:max-w-4xl mx-auto bg-white shadow-xl rounded-2xl">
            <DataTable
              roleid={dropdownValue}
              refreshTrigger={refreshTable}
              loading={isLoading}
              setLoading={setIsLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
