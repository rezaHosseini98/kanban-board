"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckSquare, FolderKanban, Zap, Shield, Share2 } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  const features = [
    {
      icon: CheckSquare,
      title: "Task Management",
      description: "Organize your tasks with intuitive drag-and-drop boards",
    },
    {
      icon: FolderKanban,
      title: "Board Management",
      description: "Organize your Boards  in real-time",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Built with Next.js 15 for optimal performance",
    },
    {
      icon: Shield,
      title: "Secure",
      description: "Enterprise-grade security with Clerk authentication",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Organize work and life,{" "}
            <span className="text-green-600">finally.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            <span className="font-bold">RH</span>KanBan helps you move your work
            forward. Organize tasks, manage projects, and reach new productivity
            peaks. From high rises to the home office, the way you work is
            unique—accomplish it all with <span className="font-bold">RH</span>
            KanBan.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything you need to stay organized
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful features to helps you move your work forward, and get more
            done.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg hover:shadow-xl transition-shadow"
            >
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-700 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Share2 className="h-6 w-6 sm:h-8 sm:w-8" />
              <span className="text-xl sm:text-2xl  ">
                <span className="font-bold">RH</span>KanBan
              </span>
            </div>
            <div className="flex items-center space-x-6 text-sm ">
              <span>
                © 2026 <span className="font-bold">RH</span>KanBan. All rights
                reserved.
              </span>
              <span>Built with Next.js & Clerk</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
