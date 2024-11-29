"use client"
import React, { useState } from 'react'
import Combobox from './dropdown'
import { FileUp } from 'lucide-react'
import DataTable from './table'
import { Label } from '@/components/ui/label'
import { useToast } from "@/hooks/use-toast"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'

const index = () => {
  const { toast } = useToast()
  const [dropdownValue, setDropdownValue] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const newfile = event.target.files[0];
      setFile(newfile);
      console.log("Selected File:", newfile);
      if (dropdownValue) {
        await uploadFile(newfile);
      } else {
        alert("Please select a job title before uploading the file.");
      }
    }
  };

  const uploadFile = async (file: File) => {
    try {
      const response = await fetch("https://tbtataojvhqyvlnzckwe.supabase.co/functions/v1/talenthunt-apis", {
        method: "POST",
        headers: {
          "Authorization": "Bearer YOUR_TOKEN_HERE"
        },
        body: JSON.stringify({
          "requestType": "getSignedUrl",
          "role_id": dropdownValue
        }),
      });

      if (response.ok) {
        const resp = await response.json();
        console.log("Response:", resp);
        const { signedUrl, path, token } = resp;
        console.log("URL:", signedUrl);

        if (signedUrl) {
          const fileuploadAPI = await fetch(signedUrl, {
            method: "PUT",
            headers: {
              "Authorization": token,
              "Content-Type": "application/octet-stream"
            },
            body: file,
          });

          if (fileuploadAPI.ok) {
            const resumematch = await fetch("https://tbtataojvhqyvlnzckwe.supabase.co/functions/v1/talenthunt-apis", {
              method: "POST",
              headers: {
                "Authorization": "Bearer YOUR_TOKEN_HERE"
              },
              body: JSON.stringify({
                "requestType": "createProfile",
                "profile": {
                  "role_id": dropdownValue,
                  "profile_url": `https://tbtataojvhqyvlnzckwe.supabase.co/storage/v1/object/hackathon/${path}`
                }
              }),
            });

            if (resumematch.ok) {
              console.log("Profile created successfully");
            }
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
    }
  };

  const handleDropdownSelect = (value: string) => {
    setDropdownValue(value);
    console.log("Selected Dropdown Value:", value);
  };

  return (
    <div className='min-h-screen w-full bg-gray-50 p-8 flex flex-col items-center'>
      <div className='w-[60vw] mx-auto bg-white shadow-xl rounded-2xl overflow-hidden'>
        <div className='bg-gray-100 p-6 border-b border-gray-200 flex items-center'>
          <h1 className='font-bold text-3xl text-gray-800'>
            Candidates Dashboard
          </h1>
        </div>
        <div className='flex gap-2 items-center justify-between p-6'>
          <Combobox
            selectedValue={dropdownValue}
            onSelect={handleDropdownSelect}
          />

          <input
            id="resume"
            type="file"
            style={{ display: 'none' }}
            onChange={handleFileChange}
            disabled={!dropdownValue}
          />
          <Button className=''
            onClick={() => document.getElementById("resume")?.click()}
          >
            <FileUp /> Upload Resume
          </Button>
          {/* {file && <Label className='mt-2'>{file.name}</Label>} */}
        </div>
        {dropdownValue && (
            <div className='max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden'>
              <DataTable roleid={dropdownValue} />
            </div>
          )}
      </div>
    </div>
  )
}

export default index