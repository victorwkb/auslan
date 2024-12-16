import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-primary from-10% via-secondary via-40% to-tertiary to-90% items-center">
      <main className="container h-screen flex flex-col justify-center mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1
            className="animate-in-reverse text-8xl font-bold py-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600"
            style={{ "--index": 3 } as React.CSSProperties}
          >
            Auslan
            <br />
            Fingerspelling
          </h1>

          <p
            className="text-3xl text-gray-600 px-16 py-2 mx-auto animate-in-reverse"
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
        </div>
      </main>
      <footer
        className="animate-in absolute bottom-8 text-center text-sm text-primary max-w-xs px-4"
        style={{ "--index": 4 } as React.CSSProperties}
      >
        This app processes your webcam data locally to recognize Auslan hand
        signs. No data is stored or sent anywhere.
      </footer>
    </div>
  );
}
