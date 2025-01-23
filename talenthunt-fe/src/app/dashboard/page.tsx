"use client";
import React, { useState } from "react";
import Combobox from "./dropdown";
import { FileUp } from "lucide-react";
import DataTable from "./table";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import AuthGuard from "../custom-components/Authguard";
import { useRouter } from "next/navigation";
import useStore from "../stores/store";
import axios from "axios";

const Index = () => {
  const { toast } = useToast();
  const [dropdownValue, setDropdownValue] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [refreshTable, setRefreshTable] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { authtoken, apiUrl } = useStore();

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

  // const uploadFile = async (file: File) => {
  //   setIsUploading(true);
  //   setIsLoading(true);
  //   try {
  //     const response = await axios.post(
  //       `${apiUrl}/profiles/getSignedUrl`,
  //       {
  //         role_id: dropdownValue,
  //         fileType: file.type,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${authtoken}`,
  //         },
  //       }
  //     );

  //     if (response.status === 200) {
  //       const { signedUrl, path, token } = response.data;
  //       console.log("Response:", response.data);
  //       console.log("URL:", signedUrl);

  //       if (signedUrl) {
  //         const fileuploadAPI = await fetch(signedUrl, {
  //           method: "PUT",
  //           headers: { "Content-Type": "application/octet-stream" },
  //           body: file,
  //         });

  //         if (fileuploadAPI.ok) {
  //           const resumematch = await axios.post(
  //             `${apiUrl}/profiles/createProfile`,
  //             {
  //               profile: {
  //                 role_id: dropdownValue,
  //                 profile_url: path,
  //               },
  //             },
  //             {
  //               headers: {
  //                 Authorization: `Bearer ${authtoken}`,
  //               },
  //             }
  //           );

  //           if (resumematch.status === 200) {
  //             console.log("Profile created successfully");

  //             setRefreshTable((prev) => prev + 1);
  //             setIsLoading(false);
  //           }
  //           setIsUploading(false);

  //           setDropdownValue(dropdownValue);

  //           toast({
  //             title: "File uploaded successfully!",
  //           });
  //         } else {
  //           toast({
  //             variant: "destructive",
  //             title: "Failed to upload the file.",
  //           });
  //         }
  //       }
  //     } else {
  //       toast({
  //         variant: "destructive",
  //         title: "Failed to upload the file.",
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error uploading file:", error);
  //     toast({
  //       variant: "destructive",
  //       title: "An error occurred while uploading the file.",
  //     });
  //     setIsLoading(false);
  //   }
  // };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setIsLoading(true);
    try {
      if (file.type === "application/pdf") {
        // Existing PDF upload logic
        const response = await axios.post(
          `${apiUrl}/profiles/getSignedUrl`,
          {
            role_id: dropdownValue,
            fileType: file.type,
          },
          {
            headers: {
              Authorization: `Bearer ${authtoken}`,
            },
          }
        );

        if (response.status === 200) {
          const { signedUrl, path } = response.data;
          console.log("Response:", response.data);
          console.log("URL:", signedUrl);

          if (signedUrl) {
            const fileuploadAPI = await fetch(signedUrl, {
              method: "PUT",
              headers: { "Content-Type": "application/octet-stream" },
              body: file,
            });

            if (fileuploadAPI.ok) {
              const resumematch = await axios.post(
                `${apiUrl}/profiles/createProfile`,
                {
                  profile: {
                    role_id: dropdownValue,
                    profile_url: path,
                  },
                },
                {
                  headers: {
                    Authorization: `Bearer ${authtoken}`,
                  },
                }
              );

              if (resumematch.status === 200) {
                console.log("Profile created successfully");

                setRefreshTable((prev) => prev + 1);
                setIsLoading(false);
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
      } else if (file.type === "application/zip") {
        console.log("Starting ZIP file upload...");

        // Step 1: Get the upload URL and process ID
        const bulkResponse = await axios.post(
          `${apiUrl}/profiles/createBulkProfiles`,
          {
            role_id: dropdownValue,
          },
          {
            headers: {
              Authorization: `Bearer ${authtoken}`,
            },
          }
        );

        if (bulkResponse.status === 202) {
          const { message, process_id, upload_url } = bulkResponse.data;
          console.log("Received upload URL:", upload_url);
          console.log("Process ID:", process_id);
          console.log("Message:", message);

          // Step 2: Upload the ZIP file
          const fileuploadAPI = await fetch(upload_url, {
            method: "PUT",
            headers: { "Content-Type": "application/octet-stream" },
            body: file,
          });

          console.log("Upload response status:", fileuploadAPI.status);

          if (fileuploadAPI.ok) {
            console.log(
              "ZIP file uploaded successfully, checking processing status..."
            );

            // Step 3: Poll for completion status
            let status = "";
            let attempts = 0;
            const maxAttempts = 30; // Prevent infinite polling

            do {
              try {
                const statusResponse = await axios.get(
                  `${apiUrl}/profile/bulk-status/${process_id}`,
                  {
                    headers: {
                      Authorization: `Bearer ${authtoken}`,
                    },
                  }
                );

                status = statusResponse.data.status;
                console.log("Current status:", status);

                if (status !== "completed") {
                  await new Promise((resolve) => setTimeout(resolve, 2000));
                }

                attempts++;
                if (attempts >= maxAttempts) {
                  throw new Error("Processing timeout");
                }
              } catch (statusError) {
                console.error("Error checking status:", statusError);
                throw statusError;
              }
            } while (status !== "completed");

            console.log("Bulk profile creation completed");
            setRefreshTable((prev) => prev + 1);
            toast({
              title: "Bulk file uploaded and processed successfully!",
            });
          } else {
            console.error(
              "Failed to upload ZIP file:",
              await fileuploadAPI.text()
            );
            throw new Error("Failed to upload ZIP file");
          }
        } else {
          throw new Error("Failed to initiate bulk profile creation");
        }
      }
    } catch (error) {
      console.error("Error in upload process:", error);
      toast({
        variant: "destructive",
        title: "An error occurred while uploading the file.",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsLoading(false);
      setIsUploading(false);
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
        <div className="flex flex-col lg:flex-row gap-2 items-center justify-between p-4 md:p-6">
          <Combobox
            selectedValue={dropdownValue}
            onSelect={handleDropdownSelect}
          />
          <div className="flex flex-col md:flex-row gap-2">
            <Button
              variant="outline"
              className="hover:bg-gray-100"
              onClick={() =>
                router.push(`/configure-assessment?role_id=${dropdownValue}`)
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
                accept=".pdf, .zip"
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
            <p className="text-sm text-gray-500 mb-2">
              You can bulk upload resumes by selecting a ZIP file containing
              multiple PDF documents.
            </p>
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

export default AuthGuard(Index);
