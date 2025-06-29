"use client";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import PostgreSQL from "@/icons/postgreSql.icon";
import Redis from "@/icons/redis.icon";
import { cn } from "@/lib/utils";
import { CommandList } from "cmdk";
import { useEffect, useState } from "react";
import { useDebounce } from 'use-debounce';



export default function HomePage() {
  const [inputValue, setInputValue] = useState<string>('');
  const [selectedEngine, setSelectedEngine] = useState<'redis' | 'postgresql'>('postgresql');
  const [searchResults, setSearchResults] = useState<{
    result: string[];
    duration: number;
  }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [debouncedInputValue] = useDebounce(inputValue, 300);


  useEffect(() => {
    setSearchResults(undefined);
  }, [selectedEngine]);


  useEffect(() => {
    const fetchData = async () => {
      if (debouncedInputValue.trim() === '') {
        setSearchResults(undefined);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${selectedEngine}?q=${encodeURIComponent(debouncedInputValue)}`);
        if (!res.ok) {
          throw new Error('Something went wrong!');
        }
        const data = (await res.json()) as { result: string[]; duration: number };
        setSearchResults(data);
      } catch (e) {
        console.error("Error: ", e);
        if (e instanceof Error) setError(e.message);
        setSearchResults(undefined);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [debouncedInputValue, selectedEngine]);


  return (
    <>
      <main className="h-screen w-screen flex flex-col gap-6 items-center pt-32 grainy">

        <h1 className="sm:text-5xl text-4xl tracking-tight font-black">⚡ Speed Search</h1>
        <p className="text-zinc-500 text-lg max-w-prose text-center">
          Blazing fast country search powered by Redis, Hono, and Cloudflare Workers — right at the edge.
        </p>

        <div className="max-w-md w-full">
          <Command>
            <CommandInput
              placeholder="Search for a country..."
              value={inputValue}
              onValueChange={setInputValue}
              className="placeholder:text-zinc-500"
            />

            <CommandList className="max-h-[35vh] overflow-y-auto">
              {loading && <CommandEmpty>Loading...</CommandEmpty>}
              {error && <CommandEmpty className="text-red-500 p-2 rounded-md">{error}</CommandEmpty>}
              {!loading && !error && searchResults?.result.length === 0 ? (
                <CommandEmpty>
                  No results found.
                </CommandEmpty>
              ) : null}

              {searchResults?.result ? (
                <p className="p-2 text-xs text-zinc-500 border-b">
                  Found {searchResults.result.length} results in {searchResults.duration.toFixed(2)}ms
                </p>
              ) : null}

              {searchResults?.result ? (
                <CommandGroup heading="Results">
                  {searchResults?.result.map((country, index) => (
                    <CommandItem
                      key={index}
                      value={country}
                      onSelect={setInputValue}
                    >
                      {country}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}
            </CommandList>
          </Command>
        </div>

        <div className="flex flex-col items-center gap-4 mt-14">
          <span className="flex items-center gap-10 bg-zinc-300 p-4 rounded-lg">
            <div
              className={cn(
                "p-2 rounded-md transition-all duration-150",
                selectedEngine === 'postgresql' && 'bg-white'
              )}
              onClick={() => setSelectedEngine('postgresql')}
            >
              <PostgreSQL className="size-10 hover:scale-110 transition-all duration-350" />
            </div>
            <div
              className={cn(
                "p-2 rounded-md transition-all duration-350",
                selectedEngine === 'redis' && 'bg-white'
              )}
              onClick={() => setSelectedEngine('redis')}
            >
              <Redis className="size-10 hover:scale-110 transition-all duration-350" />
            </div>
          </span>
          <p className="text-lg text-zinc-500">
            Query Backend: <span className="font-bold">{selectedEngine === 'redis' ? 'Redis' : 'PostgreSQL'}</span>
          </p>
        </div>

      </main>
    </>
  );
}
