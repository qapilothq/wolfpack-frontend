"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusIcon, Layers, Save, Edit2Icon } from "lucide-react";
import { X } from "lucide-react";
import { redirect } from "next/navigation";
import AuthGuard from "../custom-components/Authguard";

interface Role {
  name: string;
  desc: string;
}

const CreateRoles: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [currentRole, setCurrentRole] = useState<Role>({ name: "", desc: "" });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const addOrUpdateRole = (): void => {
    if (!currentRole.name.trim() || !currentRole.desc.trim()) {
      return;
    }

    if (roles.length >= 5) {
      alert("You can only add up to 5 roles.");
      return;
    }

    if (editingIndex !== null) {
      const updatedRoles = [...roles];
      updatedRoles[editingIndex] = currentRole;
      setRoles(updatedRoles);
      setEditingIndex(null);
    } else {
      setRoles([...roles, currentRole]);
    }

    setCurrentRole({ name: "", desc: "" });
  };

  const removeRole = (indexToRemove: number): void => {
    setRoles(roles.filter((_, index) => index !== indexToRemove));
  };

  const editRole = (index: number): void => {
    setCurrentRole(roles[index]);
    setEditingIndex(index);
  };

  const submitHandler = async (): Promise<void> => {
    setIsLoading(true);
    console.log("Roles submitted:", roles);
    for (const value of roles) {
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
              requestType: "createRole",
              role: {
                name: value.name,
                job_description: value.desc,
              },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log(data);
        } else {
          console.log("Error");
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }

    setRoles([]);
    setIsLoading(false);
    redirect("/dashboard");
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="bg-gray-100 p-6 border-b border-gray-200 flex items-center">
          <Layers className="mr-3 h-6 w-6 text-gray-700" />
          <h1 className="font-bold text-3xl text-gray-800">Create Role</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6 p-6">
          <div className="space-y-6">
            <AddRoleForm
              role={currentRole}
              setRole={setCurrentRole}
              onSubmit={addOrUpdateRole}
              isEditing={editingIndex !== null}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-2xl text-gray-800">Added Roles</h2>
              <h2 className="text-sm text-gray-400">
                (add upto 5 roles at a time)
              </h2>
            </div>
            {roles.length === 0 ? (
              <div className="text-gray-500 italic text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                No roles created yet
              </div>
            ) : (
              <div className="space-y-4">
                {roles.map((role, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {role.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {role.desc}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => editRole(index)}
                      >
                        <Edit2Icon className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRole(index)}
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-100 p-6 border-t border-gray-200 flex justify-end">
          <Button
            onClick={submitHandler}
            disabled={roles.length === 0 || isLoading}
          >
            {isLoading ? (
              "Submitting..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Submit Roles
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

interface AddRoleFormProps {
  role: Role;
  setRole: React.Dispatch<React.SetStateAction<Role>>;
  onSubmit: () => void;
  isEditing: boolean;
}

const AddRoleForm: React.FC<AddRoleFormProps> = ({
  role,
  setRole,
  onSubmit,
  isEditing,
}) => {
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="roleTitle">Role Title</Label>
        <Input
          type="text"
          id="roleTitle"
          placeholder="Enter Role Title"
          value={role.name}
          onChange={(e) => setRole({ ...role, name: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="roleDescription">Job Description</Label>
        <Textarea
          className="h-[30vh]"
          placeholder="Paste your Role Description here"
          id="roleDescription"
          value={role.desc}
          onChange={(e) => setRole({ ...role, desc: e.target.value })}
          required
        />
      </div>
      <Button type="submit" className="w-full">
        <PlusIcon className="mr-2 h-4 w-4" />
        {isEditing ? "Update Role" : "Add Role"}
      </Button>
    </form>
  );
};

export default AuthGuard(CreateRoles);
