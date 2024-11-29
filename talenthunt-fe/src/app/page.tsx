import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

// Custom SVG Icons
const GitHubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-gray-700">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-blue-600">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.784 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const MicrophoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-green-600">
    <path d="M12 2c1.103 0 2 .897 2 2v7c0 1.103-.897 2-2 2s-2-.897-2-2v-7c0-1.103.897-2 2-2zm0-2c-2.209 0-4 1.791-4 4v7c0 2.209 1.791 4 4 4s4-1.791 4-4v-7c0-2.209-1.791-4-4-4zm0 18v3h-3v2h8v-2h-3v-3c3.311 0 6-2.688 6-6h-2c0 2.209-1.791 4-4 4s-4-1.791-4-4h-2c0 3.312 2.689 6 6 6z"/>
  </svg>
);

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-purple-600">
    <path d="M12 1l-12 11h9v11h6v-11h9z"/>
  </svg>
);

const MagnifyingGlassIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 w-full flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
            Revolutionize Your Hiring Process
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Leverage AI-powered, unbiased candidate assessment with seamless integrations across GitHub, LinkedIn, and advanced voice evaluation.
          </p>
          <div className="flex space-x-4">
            <Button size="lg" className="bg-primary hover:bg-primary-dark">
              <Link href='/login'>Get Started</Link>
            </Button>
            {/* <Button variant="outline" size="lg">
              Learn More
            </Button> */}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <div className="mb-2"><GitHubIcon /></div>
              <CardTitle>GitHub Integration</CardTitle>
            </CardHeader>
            <CardContent>
            <p>Analyze candidates&apos; coding skills directly from their repositories</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="mb-2"><LinkedInIcon /></div>
              <CardTitle>LinkedIn Sync</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Automatic profile data retrieval and professional background assessment</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="mb-2"><MicrophoneIcon /></div>
              <CardTitle>AI Voice Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Advanced voice analysis for communication and soft skills</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="mb-2"><ShieldIcon /></div>
              <CardTitle>Unbiased Evaluation</CardTitle>
            </CardHeader>
            <CardContent>
              <p>AI-driven assessments that minimize human bias</p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold mb-12">Why Wolf-Pack?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <MagnifyingGlassIcon />
              <h4 className="text-xl font-semibold mb-4 mt-4">Comprehensive Screening</h4>
              <p>Evaluate technical and soft skills through multiple touchpoints</p>
            </div>
            <div>
              <ShieldIcon />
              <h4 className="text-xl font-semibold mb-4 mt-4">Bias Reduction</h4>
              <p>Standardized AI-driven assessments ensure fair candidate evaluation</p>
            </div>
            <div>
              <MicrophoneIcon />
              <h4 className="text-xl font-semibold mb-4 mt-4">Advanced Voice Analysis</h4>
              <p>Evaluate communication skills beyond traditional resume screening</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto text-center">
          <p className="text-gray-600">© 2024 Wolf-Pack. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;