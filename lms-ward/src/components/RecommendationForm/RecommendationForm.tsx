import {
    Card,
    CardHeader,
    CardContent,
    CardFooter
} from '@/components/ui/card'

import { useMutation } from '@tanstack/react-query'
import { useAuth } from '@/lib/provider/AuthProvider';
import { formOptions, useForm } from '@tanstack/react-form'
import { getUserByEmailAndCitizenship } from '@/lib/axios/user';
import RCForm from '../RCForm/RCForm';

const RecommendationForm = ({ verifiedData }) => {

    const { mutate, isPending, data } = useMutation({
        mutationFn: async (value: any) => {
            console.log("Form Values", value);
            return await getUserByEmailAndCitizenship(value);
        },
        onSuccess: (data) => {
            console.log("User Verification Success", data);
            // Handle success, e.g., show a success message or redirect
        },
    })

    // Get user authentication details
    const { userAuth } = useAuth();
    // Get form options    
    const formOpts = formOptions({
        defaultValues: {
            buyerEmail: "",
            buyerCitizenshipNo: "",
        }
    })
    const form = useForm({
        ...formOpts,
        onSubmit: ({ value }) => {
            // Handle form submission
            console.log("Form submitted with values:", value);
            mutate(value);

        }
    });

    
    

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
                                <p>{verifiedData?.data?.landId}</p>
                            </div>
                            <div className='flex justify-between items-center gap-3 px-52'>
                                <p className='font-bold'>Area(sq.ft): </p>
                                <p>{verifiedData?.data?.areaSize}</p>
                            </div>
                            <div className='flex justify-between items-center gap-3'>
                                <p className='font-bold'>Type:</p>
                                <p>{verifiedData?.data?.landType} </p>
                            </div>
                        </div>
                        <div className='flex flex-row py-4 justify-between items-center gap-10'>
                            <div className='flex justify-between items-center gap-3'>
                                <p className='font-bold'>Municipality:</p>
                                <p>{verifiedData?.data?.municipality}</p>
                            </div>
                            <div className='flex justify-between items-center gap-3 px-17'>
                                <p className='font-bold'>District: </p>
                                <p>{verifiedData?.data?.district}</p>
                            </div>
                            <div className='flex justify-between items-center gap-3'>
                                <p className='font-bold'>State:</p>
                                <p>{verifiedData?.data?.state} </p>
                            </div>
                        </div>
                        <div className='flex flex-row py-4 justify-between items-center gap-x-48'>

                            <div className='flex justify-between items-center gap-3'>
                                <p className='font-bold'>WardNo:</p>
                                <p>{verifiedData?.data?.wardNo} </p>
                            </div>
                            <div className='flex justify-between items-center gap-3'>
                                <p className='font-bold '>Documents:</p>
                                <p className='text-blue-500 underline'><a href={`http://localhost:5000/${verifiedData?.data?.documents}`} target='_blank'>PDF</a> </p>
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
                                <p>{verifiedData?.data?.firstname + " " + verifiedData?.data?.lastname}</p>
                            </div>
                            <div className='flex justify-between items-center gap-3 px-52'>
                                <p className='font-bold'>Citizenship No:  </p>
                                <p>{verifiedData?.data?.citizenshipNo}</p>
                            </div>
                            <div className='flex justify-between items-center gap-3'>
                                <p className='font-bold'>Citizenship:</p>
                                <p><a href={`http://localhost:5000/${verifiedData?.data?.citizenshipDoc}`} className='text-blue-500 underline' target="_blank">PDF</a> </p>
                            </div>
                        </div>
                        <div className='flex flex-row py-4 justify-between items-center gap-10'>
                            <div className='flex justify-between items-center gap-3'>
                                <p className='font-bold'>Father:</p>
                                <p>{verifiedData?.data?.fatherName}</p>
                            </div>
                            <div className='flex justify-between items-center gap-3 px-17'>
                                <p className='font-bold'>GrandFather: </p>
                                <p>{verifiedData?.data?.grandFatherName}</p>
                            </div>
                        </div>
                    </CardContent>
                    <CardHeader className='font-bold text-2xl text-nowrap text-left'>
                        <h3>Buyer Information</h3>
                    </CardHeader>
                    <CardContent className='w-full'>

                        <form className="w-full" onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log(e)
                            form.handleSubmit(e);
                        }}>
                            <div className="flex justify-start items-center mb-4 gap-2">
                                <div className="mb-4">
                                    <form.Field name="buyerEmail"
                                        validators={{
                                            onBlur: ({ value }) => {
                                                console.log("Blur Land Id", value);
                                            },
                                        }}
                                        children={(field) => {
                                            return (
                                                <>
                                                    <label htmlFor={field.name} className="text-left font-medium">Email</label>
                                                    <input type="text" id={field.name} value={field.state.value} onBlur={() => field.handleBlur()} onChange={(e) => field.handleChange(e.target.value)} className="w-full px-3 py-2 border rounded" />
                                                    {field.state.meta.errors && (<p className="text-red-500 text-sm mt-1">{field.state.meta.errors.join(",")}</p>)}
                                                </>
                                            )
                                        }}
                                    />
                                </div>
                                <div className="mb-4">
                                    <form.Field name="buyerCitizenshipNo"
                                        validators={{
                                            onBlur: ({ value }) => {
                                                console.log("Blur Land Id", value);
                                            },
                                        }}
                                        children={(field) => {
                                            return (
                                                <>
                                                    <label htmlFor={field.name} className="text-left font-medium">Citizenship No:</label>
                                                    <input type="text" id={field.name} value={field.state.value} onBlur={() => field.handleBlur()} onChange={(e) => field.handleChange(e.target.value)} className="w-full px-3 py-2 border rounded" />
                                                    {field.state.meta.errors && (<p className="text-red-500 text-sm mt-1">{field.state.meta.errors.join(",")}</p>)}
                                                </>
                                            )
                                        }}
                                    />
                                </div>
                                <form.Subscribe
                                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                                    children={([isSubmitting]) => (
                                        <input type="submit" disabled={isPending} className={`px-5 py-2 ${isPending ? "bg-blue-300" : "bg-blue-800 hover:bg-blue-600"}  text-white py-2 rounded `}
                                            value={isPending ? 'Getting...' : 'Get'}
                                        />
                                    )}
                                />
                            </div>
                        </form>
                    </CardContent>

                    {data && (<CardContent>
                        <div className='flex flex-row py-4 justify-between items-center gap-10'>
                            <div className='flex justify-between items-center gap-3'>
                                <p className='font-bold'>Owner:</p>
                                <p>{data?.data?.firstname + " " + data?.data?.lastname}</p>
                            </div>
                            <div className='flex justify-between items-center gap-3 px-52'>
                                <p className='font-bold'>Citizenship No:  </p>
                                <p>{data?.data?.citizenshipNo}</p>
                            </div>
                            <div className='flex justify-between items-center gap-3'>
                                <p className='font-bold'>Citizenship:</p>
                                <p><a href={`http://localhost:5000/${data?.data?.citizenshipDoc}`} className='text-blue-500 underline'>PDF</a></p>
                            </div>
                        </div>
                        <div className='flex flex-row py-4 justify-between items-center gap-10'>
                            <div className='flex justify-between items-center gap-3'>
                                <p className='font-bold'>Father:</p>
                                <p>{data?.data?.fatherName}</p>
                            </div>
                            <div className='flex justify-between items-center gap-3 px-17'>
                                <p className='font-bold'>GrandFather: </p>
                                <p>{data?.data?.grandFatherName}</p>
                            </div>
                        </div>
                    </CardContent>)}

                    <CardFooter>
                        {data && (
                            <RCForm buyer={data} verifiedData={verifiedData} />
                        )}
                    </CardFooter>

                </Card>
            </div>
        </div>
    )
}

export default RecommendationForm;