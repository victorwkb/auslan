import { useState } from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { Button } from "./ui/button";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleIconClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); 
    const formEvent = new Event("submit") as unknown as React.FormEvent;
    handleSubmit(formEvent);
  };

  return (
    <div
      className="mx-auto flex w-full px-20"
      style={{ "--index": 1 } as React.CSSProperties}
    >
      <div className="border-2 flex w-full cursor-text flex-col rounded-3xl px-2.5 py-1 transition-colors contain-inline-size bg-[#f4f4f4]">
        <div className="flex min-h-[44px] items-center pl-2">
          <form onSubmit={handleSubmit} className="min-w-0 max-w-full flex-1">
            <Input
              placeholder="Search for an Auslan sign"
              value={query}
              aria-label="Search input"
              onChange={(e) => setQuery(e.target.value)}
              className="text-primary max-h-[25dvh] max-h-52 overflow-auto default-browser"
            />
          </form>
          <Button type="submit" variant="outline" aria-label="Search button" onClick={handleIconClick}>
            <Search className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}
