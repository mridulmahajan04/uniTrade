"use client"
import { useBasketStore } from '@/store/store'
import React from 'react'

import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
const page = () => {
    const groupedItems = useBasketStore((state) => state.getGroupItems());
    const { isSignedIn } = useAuth();
    const { user } = useUser();
    const router = useRouter();

    const [isClient, setIsClient] = useState(false);
    const [loading, setLoading] = useState(false);
    if (!isClient) return null;
    if (groupedItems.length == 0) {
        return (
            <div className='container mx-auto p-4 flex flex-col items-center justify-center min-h-[50vh]'>
                <h1 className='text-2xl font-bold mb-6 text-gray-800'> Your Basket</h1>
                <p className="text-gray=600 text-lg">Your Basket is Empty</p>
            </div>
        )
    }
    return (
        <div className='container mx-auto p-4 max-w-6xl'>
            <h1 className='text-2xl font-bold mb-4'> Your Basket </h1>
            <div className='flex flex-col lg:flex-row gap-8'>
                <div className='flex-grow'>
                    {groupedItems?.map((item) => (
                    <div
                        key={item.product._id} className='mb-4 p-4 border rounded flex items-center justify-between'>
                            <div>{item.product.name}</div>
                            <div>{item.quantity}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default page
