"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function SearchModal() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search logic here
    console.log("Searching for:", searchTerm);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Search">
          <Search className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="text-left">Search Products</DialogTitle>
        </DialogHeader>
        <form className="mt-4" action="/search">
          <div className="flex items-center border rounded-md overflow-hidden bg-white">
            <div className="px-3 py-2">
              <Search className="h-5 w-5 text-neutral-500" />
            </div>
            <input
              type="query"
              placeholder="Search for products..."
              className="flex-1 px-2 py-2 outline-none bg-transparent"
              name="query"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <div className="mt-6 flex justify-end">
            <Button type="submit" className="bg-black text-white hover:bg-black/90">
              Search
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 