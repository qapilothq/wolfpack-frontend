'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from "@/components/ui/textarea"
import { Input } from '@/components/ui/input'
import { Label } from "@/components/ui/label"
import { useState } from 'react'
import { X } from 'lucide-react'



const submithandler = () => {
  console.log('role created')
}

interface Role {
  name:string;
  desc:string
}

const CreateRoles = () => {
  const [roles,setRoles] = useState<Role[]>([])
  const [currentRole,setCurrentRole] = useState<Role>({ name: '', desc: '' })

  const submitHandler = () => {
    console.log('Roles submitted:', roles)
    // Here you would typically send the roles to your backend
  }

  return (
    <div className='h-full flex flex-col gap-10 items-center justify-center'>
      <div className='font-bold text-3xl'>
        Create Role
      </div>
      <div className='w-[40vw]'>
      <AddRoleForm
          role={currentRole}
          setRole={setCurrentRole}
        />
              </div>
              <Button onClick={submithandler}>Create Role</Button>
    </div>
  )
}

export default CreateRoles

interface AddRoleFormProps {
  role: Role;
  setRole: React.Dispatch<React.SetStateAction<Role>>;
}

const AddRoleForm: React.FC<AddRoleFormProps> = ({ role, setRole }) => {
  return (
    <div className='flex  flex-col gap-10'>
      <div className='flex flex-col gap-2'>
      <Label htmlFor="Role">Role</Label>
      <Input
            type="text"
            id="roleTitle"
            placeholder="Enter Role Title"
            value={role.name}
            onChange={(e) => setRole({ ...role, name: e.target.value })}
          />
      </div>
      <div className='flex flex-col gap-2'>
      <Label htmlFor="JD">Job Description</Label>
      <Textarea
      className='h-[30vh]'
            placeholder="Paste your Role Description here"
            id="roleDescription"
            value={role.desc}
            onChange={(e) => setRole({ ...role, desc: e.target.value })}
          />
      </div>
    </div>
  )
}

interface RoleListProps {
  roles: Role[];
  removeRole: (index: number) => void;
}