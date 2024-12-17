import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { Button } from "./ui/button";
import { ArrowRight, BookOpen, HandMetal } from "lucide-react";
import Link from "next/link";

export default function HeroCards() {
  return (
    <>
      <div className="grid md:grid-cols-2 gap-6 md:gap-12 xl:px-40">
        <Card
          className="animate-in w-full h-full flex flex-col justify-between"
          style={{ "--index": 4 } as React.CSSProperties}
        >
          <CardHeader>
            <BookOpen className="h-12 w-12 text-orb mb-4" />
            <CardTitle className="w-full flex items-center justify-between font-bold text-xl">
              Auslan Fingerspelling
              <Badge className="text-sm text-primary">ML/AI</Badge>
            </CardTitle>
            <CardDescription className="text-lg">
              Test and improve your Auslan fingerspelling skills with our
              interactive quiz using computer vision technology.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Link href="/fingerspelling">
              <Button variant="secondary" className="group">
                Explore Feature
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card
          className="animate-in w-full h-full flex flex-col justify-between"
          style={{ "--index": 5 } as React.CSSProperties}
        >
          <CardHeader>
            <HandMetal className="h-12 w-12 text-orb mb-4" />
            <CardTitle className="w-full flex items-center justify-between font-bold text-xl">
              Auslan Dictionary
              <Badge className="text-sm text-primary">LLM</Badge>
            </CardTitle>
            <CardDescription className="text-lg">
              Access a comprehensive Auslan dictionary with hybrid search, video
              demonstrations, and detailed explanations of signs.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Link href="/dictionary">
              <Button variant="secondary" className="group">
                Explore Feature
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
