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
        <input
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
            }}
            placeholder="Search airports..."
            className="text-zinc-500" type="text"/>
      </main>
  );
}
