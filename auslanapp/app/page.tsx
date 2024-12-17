import Link from "next/link";
import { Button } from "@/components/ui/button";
import HeroCards from "@/components/HeroCards";

export default function HomePage() {
  return (
    <div className="md:h-screen flex flex-col bg-gradient-to-b from-primary from-10% via-secondary via-30% to-tertiary to-90% items-center">
      <div className="container md:h-screen flex flex-col justify-center mx-auto px-4 pb-16 pt-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1
            className="animate-in-reverse text-5xl md:text-6xl lg:text-7xl font-bold py-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600"
            style={{ "--index": 3 } as React.CSSProperties}
          >
            Auslan
            <br />
            Fingerspelling
          </h1>

          <p
            className="text-xl md:text-3xl text-gray-600 px-16 py-2 mx-auto animate-in-reverse"
            style={{ "--index": 2 } as React.CSSProperties}
          >
            Australia Sign Language with
            <br />
            AI-powered Hand Sign Recognition
          </p>

          <Link href="/fingerspelling">
            <Button
              className="animate-in text-l text-white uppercase px-14 py-6 mt-8"
              style={{ "--index": 1 } as React.CSSProperties}
            >
              Let&apos;s Go
            </Button>
          </Link>
          {/* Hero Cards */}
        </div>
        <HeroCards />
      </div>
      <footer
        className="animate-in relative bottom-8 text-center text-sm text-primary max-w-xs px-4"
        style={{ "--index": 6 } as React.CSSProperties}
      >
        This app processes your webcam data locally to recognize Auslan hand
        signs. No data is stored or sent anywhere.
      </footer>
    </div>
  );
}
