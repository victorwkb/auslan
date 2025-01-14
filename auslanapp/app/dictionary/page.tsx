"use client";

import SearchBar from "@/components/SearchBar";
import { Suspense, useState } from "react";
import { DictionaryResults, DictionaryItem } from "./SearchResults";

export default function Dictionary() {
  const [results, setResults] = useState<DictionaryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/dictionary?query=${encodeURIComponent(query)}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch dictionary data");
      }
      const data = await response.json();
      setResults(data || []); // Ensure results is always an array
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching results. Please try again.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={
        "flex flex-col items-center bg-gradient-to-b from-primary from-10% via-secondary via-30% to-tertiary to-90%"
      }
    >
      <div
        className={`container flex flex-col justify-center items-center mx-auto px-4 py-16
        ${results.length === 0 ? "min-h-screen" : "min-h-full"}`}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="mx-auto animate-in-reverse text-5xl md:text-6xl lg:text-7xl font-bold py-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600"
            style={{ "--index": 3 } as React.CSSProperties}
          >
            Auslan
            <br />
            Dictionary
          </h1>
        </div>

        {/* Search and Results */}
        <Suspense fallback={<div>Loading...</div>}>
          <SearchBar onSearch={handleSearch} />
          {isLoading && <p className="mt-4">Loading...</p>}
          {error && <p className="mt-4 text-red-600">{error}</p>}
          {!isLoading && !error && <DictionaryResults results={results} />}
        </Suspense>

        {/* Footer */}
        <p
          className="text-xl md:text-3xl text-gray-600 px-16 py-12 mx-auto animate-in-reverse text-center"
          style={{ "--index": 2 } as React.CSSProperties}
        >
          Powered by Amazon Titan Large Language Model <br />
          via Amazon Bedrock
        </p>
      </div>
    </div>
  );
}
