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
    <div className='flex flex-col items-center'>
      <Card className={`${dropdownValue ? 'md:min-w-[700px]' : 'md:min-w-[350px]'}`}>
        <CardHeader>
          <CardTitle>Select Job Description</CardTitle>
        </CardHeader>
        <CardContent>
          <ResizablePanelGroup
            direction="horizontal"
            className={`max-w-md rounded-lg ${dropdownValue ? 'md:min-w-[700px]' : 'md:min-w-[350px]'}`}
          >
            <ResizablePanel defaultSize={50}>
              {/* <div className="flex h-[100px] items-center justify-center p-6"> */}
                <Combobox
                selectedValue = {dropdownValue}
                onSelect = {setDropdownValue} />
              {/* </div> */}
            </ResizablePanel>
            {/* <ResizableHandle /> */}
            {
              dropdownValue && <ResizablePanel defaultSize={50}>
              <input 
                 id="resume" 
                 type="file" 
                 style={{display: 'none'}}
                 onChange={handleFileChange}
              />
               <Button className='w-[300px]'
                 onClick={() => document.getElementById("resume")?.click()}
               > 
                 <FileUp/> Upload Resume
               </Button>
               {file && <Label>{file.name}</Label> }
           </ResizablePanel>
            }
            
          </ResizablePanelGroup>
        </CardContent>
        <CardFooter className="flex justify-between">
        </CardFooter>
      </Card>
      <div className='h-[10px]'></div>
      {
        dropdownValue && <Card className="w-[750px]">
        <CardHeader>
          <CardTitle>Summary of Uploaded Resumes</CardTitle>
        </CardHeader>
        <CardContent>
            <DataTable roleid={dropdownValue} />
        </CardContent>
      </Card>
      }
      
    </div>
  )
}

export default index
