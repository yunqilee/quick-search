'use client'

import {useEffect, useState} from "react";

export default function Home() {
  const [input, setInput] = useState<string>('');
  const [searchResults, setSearchResults] = useState<{
    results: string[]
    duration:number
  }>();

  useEffect(() => {
    const fetchData = async () => {
      if (!input) return setSearchResults(undefined)

      const resp = await fetch(`/api/search?q=${input}`)
    }

    fetchData()
  }, [input])

  return (
      <main className="h-screen w-screen grainy">
          <div className="flex flex-col  gap-6 items-center pt-32 duration-500 animate-in
          fade-in-5 slide-in-from-bottom-2.5">
              <h1 className="text-5xl text-zinc-900 tracking-tight font-bold">QuickSearch ✈️</h1>
              <p className="text-zinc-600 text-lg max-w-prose text-center">A high-performance API combined with Next.js, powered by Upstash Redis</p>
              <input
                  value={input}
                  onChange={(e) => {
                      setInput(e.target.value)
                  }}
                  placeholder="Search airports..."
                  className="text-zinc-500" type="text"/>
          </div>
      </main>
  );
}
