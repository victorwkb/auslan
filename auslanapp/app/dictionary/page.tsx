"use client";

export default function Home() {
  return (
    <div className="md:h-screen flex flex-col bg-gradient-to-b from-primary from-10% via-secondary via-30% to-tertiary to-90% items-center">
      <div className="container h-screen flex flex-col justify-center items-center mx-auto px-4 py-16">
        <div className="text-center mb-20">
          <>
            <h1
              className="animate-in-reverse text-5xl md:text-6xl lg:text-7xl font-bold py-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600"
              style={{ "--index": 3 } as React.CSSProperties}
            >
              Auslan
              <br />
              Dictionary
            </h1>
            <p
              className="text-xl md:text-3xl text-gray-600 px-16 py-2 mx-auto animate-in-reverse"
              style={{ "--index": 2 } as React.CSSProperties}
            >
              Powered by Machine learning and AI
            </p>
          </>
        </div>
      </div>
    </div>
  );
}
