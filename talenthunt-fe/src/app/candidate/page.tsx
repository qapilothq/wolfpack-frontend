import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CodeIcon, 
  BookIcon, 
  BriefcaseIcon, 
  TargetIcon 
} from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area"


const CandidateProfile: React.FC = () => {
  // Candidate data (would typically come from props or API)
  const candidateData = {
    personalInfo: {
      name: "Vinod G",
      phone: 7036186014,
      email: "vinodgullipalli16@gmail.com"
    },
    workExperience: [
      {
        company: "Envision Infotech Pvt Ltd",
        role: "Software Engineer (UI)",
        duration: "Apr 2022 - Present"
      },
      {
        company: "Envision Infotech Pvt Ltd",
        role: "Software Engineer (UI)",
        duration: "Apr 2022 - Present"
      },
      {
        company: "Envision Infotech Pvt Ltd",
        role: "Software Engineer (UI)",
        duration: "Apr 2022 - Present"
      }
    ],
    projects: [
      {
        name: "AgroTech",
        description: "Agricultural product providing innovative solutions for agricultural problems."
      },
      {
        name: "Integrated HealthCare Information System (IHIS)",
        description: "Enterprise-wide solution for comprehensive patient information across care points."
      }
    ],
    education: "Bachelor of Technology (B.Tech) from JNTUK University",
    skills: [
      "React.js", "Redux", "JavaScript", "ES6", 
      "Material UI", "Bootstrap", "HTML5", "CSS3", 
      "Git", "Babel", "Webpack", "Jest", "Cypress"
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 w-full flex flex-col p-8">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Personal Information Card */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center">
                <TargetIcon className="mr-2 text-blue-500" />
                <CardTitle>Personal Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Name:</strong> {candidateData.personalInfo.name}</p>
                <p><strong>Phone:</strong> {candidateData.personalInfo.phone}</p>
                <p><strong>Email:</strong> {candidateData.personalInfo.email}</p>
              </div>
            </CardContent>
          </Card>

          {/* Work Experience Card */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
              <div className="flex items-center">
                <BriefcaseIcon className="mr-2 text-green-500" />
                <CardTitle>Work Experience</CardTitle>
              </div>
            </CardHeader>
          <ScrollArea className="h-[200px]">
            <CardContent>
              {candidateData.workExperience.map((job, index) => (
                <div key={index} className="mb-4">
                  <p className="font-semibold">{job.role}</p>
                  <p className="text-gray-600">{job.company}</p>
                  <p className="text-sm text-gray-500">{job.duration}</p>
                </div>
              ))}
            </CardContent>
          </ScrollArea>
          </Card>

          {/* Education Card */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center">
                <BookIcon className="mr-2 text-purple-500" />
                <CardTitle>Education</CardTitle>
              </div>
            </CardHeader>
            <ScrollArea className="h-[200px]">
            <CardContent>
              <p>{candidateData.education}</p>
            </CardContent>
            </ScrollArea>
            
          </Card>

          {/* Projects Card */}
          <Card className="md:col-span-2 hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center">
                <CodeIcon className="mr-2 text-red-500" />
                <CardTitle>Projects</CardTitle>
              </div>
            </CardHeader>
            <ScrollArea className="h-[200px]">
            <CardContent>
              {candidateData.projects.map((project, index) => (
                <div key={index} className="mb-4">
                  <p className="font-semibold">{project.name}</p>
                  <p className="text-gray-600">{project.description}</p>
                </div>
              ))}
            </CardContent>
            </ScrollArea>

          </Card>

          {/* Skills Card */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center">
                <TargetIcon className="mr-2 text-orange-500" />
                <CardTitle>Skills</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {candidateData.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center mt-8 space-x-4">
          <Button 
            variant="outline" 
            className="hover:bg-gray-100"
          >
            Download Resume
          </Button>
          <Button 
            className="bg-primary hover:bg-primary-dark"
          >
            Schedule Interview
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;