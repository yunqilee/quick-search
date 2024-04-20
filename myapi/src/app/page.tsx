'use client'

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

import {useEffect, useState} from "react";

export default function Home() {
  const [input, setInput] = useState<string>('');
  const [searchResults, setSearchResults] = useState<{
    response: string[]
    duration:number
  }>();

  useEffect(() => {
    const fetchData = async () => {
      if (!input) return setSearchResults(undefined)

      const resp = await fetch(`https://myapi.yunqi-uiuc.workers.dev/api/search?q=${input}`);
      const data = (await resp.json()) as {response: string[], duration: number};
      setSearchResults(data)
    }

    fetchData()
  }, [input])

  return (
      <main className="h-screen w-screen grainy">
          <div className="flex flex-col  gap-6 items-center pt-32 duration-500 animate-in
          fade-in-5 slide-in-from-bottom-2.5">
              <h1 className="text-5xl text-zinc-900 tracking-tight font-bold">QuickSearch ✈️</h1>
              <p className="text-zinc-600 text-lg max-w-prose text-center">A high-performance API combined with Next.js, powered by Upstash Redis</p>

              <div className="max-w-md w-full">
                  <Command>
                      <CommandInput
                      value={input}
                      onValueChange={setInput}
                      placeholder="Search airports..."
                      className="placeholder:text-zinc-500"
                      />
                      <CommandList>
                          {searchResults?.response.length === 0 ? (
                              <CommandEmpty>No results found.</CommandEmpty>
                          ) : null}

                          {searchResults?.response ? (
                              <CommandGroup heading='Results'>
                                  {searchResults?.response.map((result) => (
                                      <CommandItem
                                          key={result}
                                          value={result}
                                          onSelect={setInput}>
                                          {result}
                                      </CommandItem>
                                  ))}
                              </CommandGroup>
                          ) : null}

                          {searchResults?.response ? (
                              <>
                                  <div className='h-px w-full bg-zinc-200' />

                                  <p className='p-2 text-xs text-zinc-500'>
                                      Found {searchResults.response.length} results in{' '}
                                      {searchResults?.duration.toFixed(0)}ms
                                  </p>
                              </>
                          ) : null}
                      </CommandList>
                  </Command>
              </div>
          </div>
      </main>
  );
}
