import React from 'react'
import { Combobox } from './dropdown'
import { FileUp } from 'lucide-react'
import { DataTable } from './table'
import {
  Card,
  CardContent,
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
  return (
    <div className='flex items-center justify-center h-full w-full'>
          <div className='flex flex-col items-center'>
      <Card className="w-[750px]">
        <CardHeader>
          <CardTitle>Select Job Description</CardTitle>
        </CardHeader>
        <CardContent>
          <ResizablePanelGroup
            direction="horizontal"
            className="max-w-md rounded-lg md:min-w-[700px]"
          >
            <ResizablePanel defaultSize={50}>
              {/* <div className="flex h-[100px] items-center justify-center p-6"> */}
                <Combobox />
              {/* </div> */}
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50}>
                <Button className='w-[300px]'> <FileUp/> Upload Resume </Button>
            </ResizablePanel>
          </ResizablePanelGroup>
        </CardContent>
        <CardFooter className="flex justify-between">
        </CardFooter>
      </Card>
      <div className='h-[10px]'></div>
      <Card className="w-[750px]">
        <CardHeader>
          <CardTitle>Summary of Uploaded Resumes</CardTitle>
        </CardHeader>
        <CardContent>
            <DataTable />
        </CardContent>
      </Card>
    </div>
    </div>
  )
}

export default index
