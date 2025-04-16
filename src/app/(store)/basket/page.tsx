"use client"
import { useBasketStore } from '@/store/store'
import React, { useEffect } from 'react'
import Loader from '@/components/Loader'
import { SignInButton, useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AddToBasketButton from '@/components/AddToBasketButton';
import { imageUrl } from '@/lib/imageUrl';
import Image from 'next/image';
import { toast } from 'react-toastify'
import { createCheckoutSession, Metadata } from '@/actions/createCheckoutSession'

const BasketPage = () => {
    const groupedItems = useBasketStore((state) => state.getGroupItems());
    const { isSignedIn } = useAuth();
    const { user } = useUser();
    const router = useRouter();

    const [isClient, setIsClient] = useState(false);
    const [loading, setLoading] = useState(false);
    const [checkoutError, setCheckoutError] = useState<string | null>(null);

    useEffect(() => {
        setIsClient(true);
    }, [])

    if (!isClient) {
        return <Loader />
    }

    const handleCheckout = async () => {
        setCheckoutError(null);
        
        if (!isSignedIn) {
            toast.error("Please sign in to checkout");
            return;
        }
        
        if (groupedItems.length === 0) {
            toast.error("Your basket is empty");
            return;
        }
        
        setLoading(true);
        toast.info("Preparing checkout...");

        try {
            // Validate user data
            if (!user?.id || !user?.emailAddresses?.[0]?.emailAddress) {
                throw new Error("User information is incomplete");
            }

            const metadata: Metadata = {
                orderNumber: crypto.randomUUID(),
                customerName: user?.fullName ?? "Unknown",
                customerEmail: user?.emailAddresses[0].emailAddress,
                clerkUserId: user.id,
            }

            console.log("Creating checkout session with items:", groupedItems);
            const checkoutUrl = await createCheckoutSession(groupedItems, metadata);
            
            if (checkoutUrl) {
                console.log("Redirecting to checkout URL:", checkoutUrl);
                toast.success("Redirecting to checkout...");
                window.location.href = checkoutUrl;
            } else {
                throw new Error("Failed to create checkout session - no URL returned");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            setCheckoutError(errorMessage);
            toast.error(`Checkout failed: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    }

    if (groupedItems.length === 0) {
        return (
            <div className='container mx-auto p-4 flex flex-col items-center justify-center min-h-[50vh]'>
                <h1 className='text-2xl font-bold mb-6 text-gray-800'>Your Basket</h1>
                <p className="text-gray-600 text-lg">Your Basket is Empty</p>
            </div>
        )
    }

    return (
        <div className='container mx-auto p-4 max-w-6xl'>
            <h1 className='text-2xl font-bold mb-4'>Your Basket</h1>
            <div className='flex flex-col lg:flex-row gap-8'>
                <div className='flex-grow'>
                    {groupedItems?.map((item) => (
                        <div
                            key={item.product._id} 
                            className='mb-4 p-4 border rounded flex items-center justify-between'
                            onClick={() => {
                                router.push(`/product/${item.product.slug?.current}`)
                            }}
                        >
                            <div className='w-20 h-20 sm:w-24 sm:h-24 flex-shirk-0 mr-4'>
                                {item.product.image && (
                                    <Image 
                                        src={imageUrl(item.product.image).url()} 
                                        alt={item.product.name ?? "Product Image"} 
                                        className="w-full h-full object-cover rounded" 
                                        width={96}
                                        height={96} 
                                    />
                                )}
                            </div>

                            <div className='min-w-0'>
                                <h2 className='text-lg sm:text-xl font-semibold truncate'>{item.product.name}</h2>
                                <p className='text-sm sm:text-base'>
                                    Price: Rs. {((item.product.price ?? 0) * item.quantity).toFixed(2)}
                                </p>
                            </div>

                            <div className='flex items-center ml-4 flex-shrink-0'>
                                <AddToBasketButton product={item.product} disabled={false} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className='lg:w-80 p-4 border rounded h-fit'>
                    <h3 className='text-xl font-semibold'>Order Summary</h3>
                    <div className='mt-4 space-y-2'>
                        <p className='flex justify-between'>
                            <span>Items:</span>
                            <span>
                                {groupedItems.reduce((total, item) => total + item.quantity, 0)}
                            </span>
                        </p>
                        <p className='flex justify-between text-2xl font-bold border-t pt-2'>
                            <span>Total:</span>
                            <span>
                                Rs.{useBasketStore.getState().getTotalPrice().toFixed(2)}
                            </span>
                        </p>
                    </div>

                    {checkoutError && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
                            {checkoutError}
                        </div>
                    )}

                    <button 
                        onClick={handleCheckout} 
                        disabled={loading} 
                        className='mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 flex items-center justify-center'
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </>
                        ) : (
                            "Checkout"
                        )}
                    </button>
                </div>

                <div className='h-64 lg:h-0'></div>
            </div>
        </div>
    )
}

export default BasketPage;
