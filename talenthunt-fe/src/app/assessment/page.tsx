'use client'
import React from 'react'
import { useState } from 'react';
import {
 Select,
 SelectContent,
 SelectGroup,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from "@/components/ui/select"

// Define the Role interface correctly
interface Role {
  name: string;
  desc: string;
}

const roles: Role[] = [
 {'name':'Front-end Dev', 'desc' : "Responsible for implementing visual elements that users see and interact within a web application."},
 {'name':'Back-end Dev', 'desc' : "Responsible for server-side web application logic and integration of the work front-end developers do."},
 {'name':'Product Manager', 'desc' : "Responsible for guiding the success of a product and leading the cross-functional team that is responsible for improving it."},
 {'name':'Project Manager', 'desc' : "Responsible for planning, executing, and overseeing the completion of projects to ensure that it is completed in line with the company's goals."}
]


const suggestedQuestions = [
  'Q1','Q2','Q3'
]

const Assessment: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  return (
    <div>
      <div className='font-bold text-3xl'>
        Configure Assessment
      </div>
      <div>
        <Select 
          onValueChange={(value) => setSelectedRole(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Choose the Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {roles.map((role, index) => (
                <SelectItem 
                  key={index} 
                  value={role.name}
                >
                  {role.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export default Assessment