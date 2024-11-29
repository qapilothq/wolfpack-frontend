"use client"
import React, {useState} from 'react'
import Combobox  from './dropdown'
import { FileUp } from 'lucide-react'
import DataTable from './table'
import { Label } from '@/components/ui/label'
import { useToast } from "@/hooks/use-toast"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"


const index = () => {

  const { toast } = useToast()
  const [dropdownValue, setDropdownValue] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const newfile  = event.target.files[0];
      setFile(newfile); // Get the file name
      console.log("Selected File:", event.target.files[0]);
      if(dropdownValue){
        await uploadFile(newfile);
      }else{
        alert("Please select a job title before uploading the file.");
      }
    }
  };

  const uploadFile = async (file : File) => {
    
    try {
      const response = await fetch("https://tbtataojvhqyvlnzckwe.supabase.co/functions/v1/talenthunt-apis", {
        method: "POST",
        headers: {
          "Authorization" : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRidGF0YW9qdmhxeXZsbnpja3dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4NjEwMjIsImV4cCI6MjA0ODQzNzAyMn0.WpMB4UUuGiyT2COwoHdfNNS9AB3ad-rkctxJSVgDp7I"
        },
        body: JSON.stringify({
          "requestType" : "getSignedUrl",
          "role_id": 1
        }),
      });
      
      if (response.ok) {
        const resp = await response.json()
        console.log("Response:", resp);
        const {signedUrl} = resp
        const {path} = resp
        console.log("URL:", signedUrl);
        if(signedUrl){
          const {token} = resp
          const fileuploadAPI = await fetch(signedUrl, {
            method: "PUT",
            headers: {
              "Authorization" : token,
              "Content-Type": "application/octet-stream"
            },
            body: file,
          });
          if (fileuploadAPI.ok) {
            const resumematch = await fetch("https://tbtataojvhqyvlnzckwe.supabase.co/functions/v1/talenthunt-apis", {
              method: "POST",
              headers: {
                "Authorization" : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRidGF0YW9qdmhxeXZsbnpja3dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4NjEwMjIsImV4cCI6MjA0ODQzNzAyMn0.WpMB4UUuGiyT2COwoHdfNNS9AB3ad-rkctxJSVgDp7I"
              },
              body: JSON.stringify({
                "requestType" : "createProfile",
                "profile": {
                  "role_id": 1,
                  "profile_url": "https://tbtataojvhqyvlnzckwe.supabase.co/storage/v1/object/hackathon/"+path
                }
                }), 
            });
            if(resumematch.ok){
              console.log("Profile created successfully");
            }
            toast({
              title: "File uploaded successfully!",
            })
          } else {
            toast({
              variant: "destructive",
              title: "Failed to upload the file.",
            })
          }
        }
      } else {
        toast({
          variant: "destructive",
          title: "Failed to upload the file.",
        })
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        variant: "destructive",
        title: "An error occurred while uploading the file.",
      })
    }
  };


  return (
    <div className='min-h-screen w-full bg-gray-50 p-8 flex flex-col items-center'>
      <div className='max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden'>
        <div className='bg-gray-100 p-6 border-b border-gray-200'>
          <CardHeader>
            <CardTitle className='font-bold text-3xl text-gray-800'>Select Job Description</CardTitle>
          </CardHeader>
        </div>
        <CardContent className='p-6'>
          <ResizablePanelGroup
            direction="horizontal"
            className={`rounded-lg ${dropdownValue ? 'md:min-w-[700px]' : 'md:min-w-[350px]'}`}
          >
            <ResizablePanel defaultSize={50}>
              <Combobox
                selectedValue={dropdownValue}
                onSelect={setDropdownValue}
              />
            </ResizablePanel>
            {
              dropdownValue && <ResizablePanel defaultSize={50}>
                <input 
                  id="resume" 
                  type="file" 
                  style={{display: 'none'}}
                  onChange={handleFileChange}
                />
                <Button className='w-full mt-4'
                  onClick={() => document.getElementById("resume")?.click()}
                > 
                  <FileUp/> Upload Resume
                </Button>
                {file && <Label className='mt-2'>{file.name}</Label>}
              </ResizablePanel>
            }
          </ResizablePanelGroup>
        </CardContent>
        <CardFooter className="bg-gray-100 p-6 border-t border-gray-200 flex justify-between">
          {/* Add any footer content if needed */}
        </CardFooter>
      </div>
      <div className='h-[10px]'></div>
      {
        dropdownValue && <div className='max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden'>
          <div className='bg-gray-100 p-6 border-b border-gray-200'>
            <CardHeader>
              <CardTitle className='font-bold text-3xl text-gray-800'>Summary of Uploaded Resumes</CardTitle>
            </CardHeader>
          </div>
          <CardContent className='p-6'>
            <DataTable roleid={dropdownValue} />
          </CardContent>
        </div>
      }
    </div>
  )
}

export default index