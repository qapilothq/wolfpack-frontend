"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Image from "next/image";

// Custom SVG Icons (unchanged)
const GitHubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="text-gray-700"
  >
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="text-blue-600"
  >
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.784 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const MicrophoneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="text-green-600"
  >
    <path d="M12 2c1.103 0 2 .897 2 2v7c0 1.103-.897 2-2 2s-2-.897-2-2v-7c0-1.103.897-2 2-2zm0-2c-2.209 0-4 1.791-4 4v7c0 2.209 1.791 4 4 4s4-1.791 4-4v-7c0-2.209-1.791-4-4-4zm0 18v3h-3v2h8v-2h-3v-3c3.311 0 6-2.688 6-6h-2c0 2.209-1.791 4-4 4s-4-1.791-4-4h-2c0 3.312 2.689 6 6 6z" />
  </svg>
);

const ShieldIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="text-purple-600"
  >
    <path d="M12 1l-12 11h9v11h6v-11h9z" />
  </svg>
);

const MagnifyingGlassIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="text-blue-500"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const Home: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  useEffect(() => {
    setIsDialogOpen(true);
  }, []);
  return (
    <div className="min-h-screen bg-gray-100 w-full flex flex-col">
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-mono">
              Wolf-Pack: Trial Version
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-gray-700">
              Welcome to Wolf-Pack! We&apos;re in active development, with
              features still evolving. Your valuable feedback will help us
              improve.
              <br />
              <br />
              For login credentials or feedback, please contact:{" "}
              <a
                href="mailto:aditya@qapilot.com"
                className="font-bold text-black hover:underline"
              >
                aditya@qapilot.com
              </a>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsDialogOpen(false)}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <main className="flex-grow container  py-16 grid  gap-12 items-center">
        <div className="flex lg:px-10 w-[100vw] flex-col lg:flex-row items-center lg:space-y-6 md:space-y-0 md:space-x-6">
          <div className="mb-3 flex flex-col items-center justify-center w-full max-w-[400px] h-auto rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 overflow-hidden">
            <Image
              src="/finalhero.svg"
              alt="Logo"
              width={400}
              height={400}
              className="w-full h-auto object-cover"
            />
          </div>

          <div className="text-center md:text-left">
            <h2 className=" text-4xl lg:text-6xl text-gray-900 font-extrabold font-mono">
              Find Your Pack
            </h2>
            <div className="mt-10">
              <h3 className="text-xl font-extrabold text-gray-900">
                Revolutionize Your Hiring Process
              </h3>
              <p className="text-lg text-gray-600 mb-8">
                Leverage AI-powered, unbiased candidate assessment with seamless
                integrations across GitHub, LinkedIn, and advanced voice
                evaluation.
              </p>
            </div>
            <div className="flex mt-10 justify-center md:justify-start space-x-4">
              <Button
                size="lg"
                className="bg-[#003399] hover:bg-primary-dark transition-colors duration-300 shadow-md"
                onClick={() => (window.location.href = "/login")}
              >
                Get Started
              </Button>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary-dark transition-colors duration-300 shadow-md"
                onClick={() => (window.location.href = "/demo")}
              >
                Try Free Demo
              </Button>
            </div>
          </div>
        </div>
      </main>

      <section className="bg-white py-16 shadow-sm">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: <GitHubIcon />,
                title: "GitHub Integration",
                description:
                  "Analyze candidates' coding skills directly from their repositories",
              },
              {
                icon: <LinkedInIcon />,
                title: "LinkedIn Sync",
                description:
                  "Automatic profile data retrieval and professional background assessment",
              },
              {
                icon: <MicrophoneIcon />,
                title: "AI Voice Assessment",
                description:
                  "Advanced voice analysis for communication and soft skills",
              },
              {
                icon: <ShieldIcon />,
                title: "Unbiased Evaluation",
                description: "AI-driven assessments that minimize human bias",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-2"
              >
                <CardHeader>
                  <div className="mb-2">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold mb-12 text-gray-900">
            Why Wolf-Pack?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <MagnifyingGlassIcon />,
                title: "Comprehensive Screening",
                description:
                  "Evaluate technical and soft skills through multiple touchpoints",
              },
              {
                icon: <ShieldIcon />,
                title: "Eliminate Bias",
                description:
                  "Standardized AI-driven assessments ensure fair candidate evaluation",
              },
              {
                icon: <MicrophoneIcon />,
                title: "Advanced Voice Analysis",
                description: "Coming Soon",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-2"
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h4 className="text-xl font-semibold mb-4 text-gray-900">
                  {feature.title}
                </h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-gray-200 py-8">
        <div className="container mx-auto text-center">
          <p className="text-gray-700 font-medium">
            © 2024 Wolf-Pack. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
