import {
    Card,
    CardHeader,
    CardContent,
    CardFooter
} from '@/components/ui/card'

import { useMutation } from '@tanstack/react-query'
import { useAuth } from '@/lib/provider/AuthProvider';
import { formOptions, useForm } from '@tanstack/react-form'

import { Button } from '../ui/button';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { verifyRecommendationAndTransferLand } from '@/lib/axios/recommendation';
const RecommendationForm = ({ verifiedData }) => {

    const require_data = verifiedData?.data?.[0];
    const sellerData = require_data?.sellerId;
    const buyerData = require_data?.buyerId;
    const landData = require_data?.landId;
    const wardOfficerData = require_data?.verifiedByWardOfficer;


    // Get user authentication details
    const { userAuth } = useAuth();
    // Get form options    
    const mutateVerificationAndLandTransfer = useMutation({
        mutationFn: async (data) => await verifyRecommendationAndTransferLand(data),
        onSuccess: (data) => {
            toast.success(data?.message)
        },
        onError: (data) => {
            toast.error(data?.message || "An error occurred while verifying the recommendation and transferring the land.");
        }
    });

    const dataForVerification = {
        recommendationId: require_data?._id,
        lroId: userAuth?.user?._id || userAuth?.user?.id,
        sellerId: sellerData?._id,
        buyerId: buyerData?._id
    }

    




    return (
        <div className='flex'>
            <div className='w-full my-2'>
                <Card className="m-2 px-2 flex justify-between py-7 flex-column">
                    <CardHeader>
                        <h2 className='font-bold text-2xl text-nowrap text-left'>Land Profile</h2>
                    </CardHeader>
                    <CardContent>
                        <div className='flex flex-row py-4 justify-between items-center gap-10'>
                            <div className='flex justify-between items-center gap-3'>
                                <p className='font-bold'>KittaNo:</p>
                                <p>{landData?.landId}</p>
                            </div>
                            <div className='flex justify-between items-center gap-3 px-52'>
                                <p className='font-bold'>Area(sq.ft): </p>
                                <p>{landData?.areaSize}</p>
                            </div>
                            <div className='flex justify-between items-center gap-3'>
                                <p className='font-bold'>Type:</p>
                                <p>{landData?.landType} </p>
                            </div>
                        </div>
                        <div className='flex flex-row py-4 justify-between items-center gap-10'>
                            <div className='flex justify-between items-center gap-3'>
                                <p className='font-bold'>Municipality:</p>
                                <p>{landData?.municipality}</p>
                            </div>
                            <div className='flex justify-between items-center gap-3 px-17'>
                                <p className='font-bold'>District: </p>
                                <p>{landData?.district}</p>
                            </div>
                            <div className='flex justify-between items-center gap-3'>
                                <p className='font-bold'>State:</p>
                                <p>{landData?.state} </p>
                            </div>
                        </div>
                        <div className='flex flex-row py-4 justify-between items-center gap-x-48'>

                            <div className='flex justify-between items-center gap-3'>
                                <p className='font-bold'>WardNo:</p>
                                <p>{landData?.wardNo} </p>
                            </div>
                            <div className='flex justify-between items-center gap-3'>
                                <p className='font-bold '>Documents:</p>
                                <p className='text-blue-500 underline'><a href={`http://localhost:5000/${landData?.documents}`} target='_blank'>PDF</a> </p>
                            </div>
                        </div>
                    </CardContent>
                    <CardHeader>
                        <h2 className='font-bold text-2xl text-nowrap text-left'>Land Owner Profile</h2>
                    </CardHeader>
                    <CardContent>
                        <div className='flex flex-row py-4 justify-between items-center gap-10'>
                            <div className='flex justify-between items-center gap-3'>
                                <p className='font-bold'>Owner:</p>
                                <p>{sellerData?.firstname + " " + sellerData?.lastname}</p>
                            </div>
                            <div className='flex justify-between items-center gap-3 px-52'>
                                <p className='font-bold'>Citizenship No:  </p>
                                <p>{sellerData?.citizenshipNo}</p>
                            </div>
                            <div className='flex justify-between items-center gap-3'>
                                <p className='font-bold'>Citizenship:</p>
                                <p>{sellerData?.citizenshipDoc} </p>
                            </div>
                        </div>
                        <div className='flex flex-row py-4 justify-between items-center gap-10'>
                            <div className='flex justify-between items-center gap-3'>
                                <p className='font-bold'>Father:</p>
                                <p>{sellerData?.fatherName}</p>
                            </div>
                            <div className='flex justify-between items-center gap-3 px-17'>
                                <p className='font-bold'>GrandFather: </p>
                                <p>{sellerData?.grandFatherName}</p>
                            </div>
                        </div>
                    </CardContent>
                    <CardHeader>
                        <h2 className='font-bold text-2xl text-nowrap text-left'>Buyer Profile</h2>
                    </CardHeader>
                    <CardContent>
                        <div className='flex flex-row py-4 justify-between items-center gap-10'>
                            <div className='flex justify-between items-center gap-3'>
                                <p className='font-bold'>Owner:</p>
                                <p>{sellerData?.firstname + " " + buyerData?.lastname}</p>
                            </div>
                            <div className='flex justify-between items-center gap-3 px-52'>
                                <p className='font-bold'>Citizenship No:  </p>
                                <p>{buyerData?.citizenshipNo}</p>
                            </div>
                            <div className='flex justify-between items-center gap-3'>
                                <p className='font-bold'>Citizenship:</p>
                                <p>{buyerData?.citizenshipDoc} </p>
                            </div>
                        </div>
                        <div className='flex flex-row py-4 justify-between items-center gap-10'>
                            <div className='flex justify-between items-center gap-3'>
                                <p className='font-bold'>Father:</p>
                                <p>{buyerData?.fatherName}</p>
                            </div>
                            <div className='flex justify-between items-center gap-3 px-17'>
                                <p className='font-bold'>GrandFather: </p>
                                <p>{buyerData?.grandFatherName}</p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter >
                        <div className='flex flex-col w-full'>
                            <div className='flex flex-row py-4 justify-between gap-10 items-center'>
                                <div className='flex justify-between items-center gap-4'>
                                    <p className='font-bold'>Recommended By:</p>
                                    <p>{wardOfficerData?.firstname + " " + wardOfficerData?.lastname}</p>
                                </div>
                                <div className='flex justify-between items-center gap-3 px-17'>
                                    <p className='font-bold'>Recommendation Letter: </p>
                                    <p><a href={`http://localhost:5000/${require_data?.documents}`} target="_blank" className="underline text-blue-500">PDF</a></p>
                                </div>
                                <div>
                                    <Button className='bg-green-500 hover:bg-green-700' onClick={()=>mutateVerificationAndLandTransfer.mutate(dataForVerification)}>Verify and Transfer</Button>
                                </div>
                            </div>
                        </div>
                    </CardFooter>

                </Card>
            </div>
        </div>
    )
}

export default RecommendationForm;