"use client"
import { useState } from "react";
import { Category } from "../../../sanity.types";
import { useRouter } from "next/navigation";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

interface CategorySelectorProps {
    categories: Category[];
};
export function CategorySelectorComponent({ categories, }: CategorySelectorProps) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
    const router = useRouter();
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {value
                        ? categories.find((category) => category._id === value)?.name
                        : " Filter by Category"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search Category..." className="h-9" onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            const selectedCategory = categories.find((c) =>
                                c.name
                                    ?.toLowerCase()
                                    .includes(e.currentTarget.value.toLowerCase())
                            );

                            if (selectedCategory?.slug?.current) {
                                setValue(selectedCategory._id)
                                router.push(`/categories/${selectedCategory.slug.current}`);
                                setOpen(false);
                            }
                        }
                    }} />


                    <CommandList>
                        <CommandEmpty>No Category found.</CommandEmpty>
                        <CommandGroup>
                            {categories.map((category) => (
                                <CommandItem
                                    key={category._id}
                                    value={category.name}
                                    onSelect={() => {
                                        setValue(value === category._id ? "" : category._id);
                                        router.push(`/categories/${category.slug?.current}`);
                                        setOpen(false);
                                    }}
                                >
                                    {category.name}
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === category._id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}