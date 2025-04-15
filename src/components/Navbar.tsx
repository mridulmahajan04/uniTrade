"use client";

import Link from "next/link";
import { AlignJustify, ShoppingCart, User } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ClerkLoaded } from "@clerk/nextjs";
import { SearchModal } from "./SearchModal";
import { useBasketStore } from "@/store/store";

const Navbar = () => {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const itemCount = useBasketStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  );
  const createPasskey = async () => {

    try {
      const pass = await user?.createPasskey();
      console.log(pass);

    } catch (error) {
      console.log(error);
    }
  }
  return (
    <nav className="w-full bg-white border-b border-neutral-100 h-16 flex items-center sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-xl font-semibold">
          UniTrade
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-neutral-700 hover:text-neutral-900">
            Home
          </Link>
          <Link href="/product" className="text-neutral-700 hover:text-neutral-900">
            Products
          </Link>
          <Link href="/categories" className="text-neutral-700 hover:text-neutral-900">
            Categories
          </Link>
          <Link href="/about" className="text-neutral-700 hover:text-neutral-900">
            About
          </Link>
        </div>

        {/* Right side icons */}
        <div className="hidden md:flex items-center space-x-4">
          <form action="/search">
            <SearchModal />
            {/* <input type="search" name="query" id="" /> */}
          </form>

          <ClerkLoaded>
            {user ? (
              <>
                <UserButton />
                <Button variant="ghost" size="icon" aria-label="Cart">
                  <Link href="/basket">
                  <ShoppingCart className="h-5 w-5 " >

                  </ShoppingCart>
                  </Link>
                </Button>
              </>
            ) : (

              <SignInButton mode="modal" >
                <Button variant="ghost" size="icon" aria-label="Account">
                  <User className="h-5 w-5 cursor-pointer" />
                </Button>
              </SignInButton>
            )}

            {user?.passkeys.length === 0 && (
              <button onClick={createPasskey} className="bg-white hover:bg-black-700 hover:text-black animate-pulse text-black-500 font-bold py-2 px-4 rounded border-black-300 border">Create a Passkey</button>
            )}
          </ClerkLoaded>
        </div>


        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menu">
                <AlignJustify className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col py-6 space-y-6">
                <Link
                  href="/"
                  className="text-neutral-700 hover:text-neutral-900 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/products"
                  className="text-neutral-700 hover:text-neutral-900 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Products
                </Link>
                <Link
                  href="/categories"
                  className="text-neutral-700 hover:text-neutral-900 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Categories
                </Link>
                <Link
                  href="/about"
                  className="text-neutral-700 hover:text-neutral-900 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  About
                </Link>

                <div className="flex items-center space-x-4 pt-4">
                  <SearchModal />
                  {!user && (
                    <SignInButton mode="modal">
                      <Button variant="ghost" size="icon" aria-label="Account">
                        <User className="h-5 w-5" />
                      </Button>
                    </SignInButton>
                  )}
                  <Button variant="ghost" size="icon" aria-label="Cart">
                    <ShoppingCart className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 