import React from 'react'
import { Combobox } from './dropdown'
import { Separator } from '@/components/ui/separator'
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
  return (
    <div>
      <Card className="w-[550px]">
        <CardHeader>
          <CardTitle>Select Job Description</CardTitle>
        </CardHeader>
        <CardContent>
          <ResizablePanelGroup
            direction="horizontal"
            className="max-w-md rounded-lg md:min-w-[500px]"
          >
            <ResizablePanel defaultSize={50}>
              {/* <div className="flex h-[100px] items-center justify-center p-6"> */}
                <Combobox />
              {/* </div> */}
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50}>
                <Button> Upload Resume </Button>
            </ResizablePanel>
          </ResizablePanelGroup>
        </CardContent>
        <CardFooter className="flex justify-between">

        </CardFooter>
      </Card>
    </div>
  )
}

export default index
