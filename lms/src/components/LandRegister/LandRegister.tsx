import {
    Card,
    CardHeader,
    CardContent,
} from '@/components/ui/card'
import { Info } from 'lucide-react'
import { formOptions, useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { useAuth } from '@/lib/provider/AuthProvider';
import { registerLand } from '@/lib/axios/land';
import { toast } from "react-toastify"

const LandRegister = () => {

    const { mutate, isPending } = useMutation({
        mutationFn: async (value: any) => {
            // Simulate an API call
            console.log("Registering land with:", value);
            // Here you would typically make an API call to register the land
            return registerLand(value)
        },
        onSuccess: (value) => {
            console.log(value)
            if (value.type == "warning") {
                toast.warning(value.message)
            } else if (value.type == "success") {
                toast.success(value.message)
            } else {
                toast.default(value.message);
            }
        }
    })

    // Get user authentication details
    const { userAuth } = useAuth();
    const userId = userAuth?.user?.id;
    console.log(userId)
    // Get form options    
    const formOpts = formOptions({
        defaultValues: {
            landId: "",
            ownerId: userId,
            areaSize: "",
            citizenshipNo: userAuth?.user?.citizenshipNo || "",
            description: '',
            price: "",
            state: "Bagmati",
            documents: "",
            landType: "",
            district: "Kathmandu",
            municipality: "Kritipur",
            wardNo: "1",
        }
    })
    const form = useForm({
        ...formOpts,
        onSubmit: ({ value }) => {
            // Handle form submission
            value.ownerId = userAuth?.user?.id || userAuth?.user?._id;
            mutate(value);
        }
    })
    return (
        <div>
            <h3 className="text-xl px-4 py-2 font-bold">Register Your Land</h3>
            <Card className="m-2 p-4 flex justify-between flex-column">
                <div className="flex justify-between items-center flex-row gap-2">
                    <Info />
                    <p>
                        To register your land, please provide the necessary details and documents.
                        Ensure that you have all the required documents ready which are mentioned below before proceeding.
                    </p>
                </div>

                <ul className='px-4'>
                    <li>1. Lalpurja Photo</li>
                    <li>2. Bank Voucher of Tax Payment</li>
                    <li>3. Map of the Land</li>
                </ul>
                <p><strong>Note:</strong>&nbsp;    Merge all the documents in a single PDF.</p>


            </Card>
            <Card className='mx-2 mt-3 p-4'>
                <CardHeader>
                    <h2 className="text-2xl font-bold">Land Registration Form</h2>
                    <p className="text-sm text-gray-500">Please fill out the form below to register your land.</p>
                </CardHeader>
                <CardContent className='w-full'>
                    <form className="w-full" encType='multipart/form-data' onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log(e)
                        form.handleSubmit(e);
                    }}>

                        <div className="w-full flex justify-between items-center mb-4 gap-4">
                            <div className="mb-4 w-[50%]">
                                <form.Field name="landId"
                                    validators={{
                                        onBlur: ({ value }) => {
                                            console.log("Blur Land Id", value);
                                        },
                                    }}
                                    children={(field) => {
                                        return (
                                            <>
                                                <label htmlFor={field.name} className="text-left font-medium">Kitta No</label>
                                                <input type="text" id={field.name} value={field.state.value} onBlur={() => field.handleBlur()} onChange={(e) => field.handleChange(e.target.value)} className="w-full px-3 py-2 border rounded" />
                                                {field.state.meta.errors && (<p className="text-red-500 text-sm mt-1">{field.state.meta.errors.join(",")}</p>)}
                                            </>
                                        )
                                    }}
                                />
                            </div>
                            <div className="mb-4 w-[50%]">

                                <form.Field name="areaSize"
                                    validators={{

                                        onBlur: ({ value }) => {
                                            console.log("Blur Land Area", value);
                                        },
                                    }}
                                    children={(field) => {
                                        return (
                                            <>
                                                <label htmlFor={field.name} className="text-left font-medium">Land Area(sq.ft)</label>
                                                <input type="text" id={field.name} value={field.state.value} onBlur={() => field.handleBlur()} onChange={(e) => field.handleChange(e.target.value)} className="w-full px-3 py-2 border rounded" />
                                                {field.state.meta.errors && (<p className="text-red-500 text-sm mt-1">{field.state.meta.errors.join(",")}</p>)}
                                            </>
                                        )
                                    }}
                                />

                            </div>
                            <div className="mb-4 w-[50%]">
                                <form.Field name="landType"
                                    validators={{

                                    }}
                                    children={(field) => {
                                        return (
                                            <>
                                                <label htmlFor={field.name} className="text-left font-medium">Land Type</label>
                                                <input type="text" id={field.name} value={field.state.value} onBlur={() => field.handleBlur()} onChange={(e) => field.handleChange(e.target.value)} className="w-full px-3 py-2 border rounded" />
                                                {field.state.meta.errors && (<p className="text-red-500 text-sm mt-1">{field.state.meta.errors.join(",")}</p>)}
                                            </>
                                        )
                                    }}
                                />
                            </div>
                        </div>
                        <div className="flex justify-between items-center mb-4 gap-4">
                            <div className="mb-4 w-[50%]">

                                <>
                                    <label htmlFor="username" className="text-left font-medium">Owner</label>
                                    <input type="text" value={userAuth?.user?.firstname + " " + userAuth?.user?.lastname} id="username" className="w-full px-3 py-2 border rounded" />
                                </>
                            </div>
                            <div className="mb-4 w-[50%]">
                                <form.Field name="price"
                                    validators={{
                                        onBlur: ({ value }) => {
                                            console.log("Blur firstname", value);
                                        },
                                        onChange: ({ value }) => {
                                            console.log("changing", value)
                                        }
                                    }}
                                    children={(field) => {
                                        return (
                                            <>
                                                <label htmlFor={field.name} className="text-left font-medium">Price</label>
                                                <input type="text" id={field.name} value={field.state.value} onBlur={() => field.handleBlur()} onChange={(e) => field.handleChange(e.target.value)} className="w-full px-3 py-2 border rounded" />
                                                {field.state.meta.errors && (<p className="text-red-500 text-sm mt-1">{field.state.meta.errors.join(",")}</p>)}
                                            </>
                                        )
                                    }}
                                />
                            </div>
                            <div className="mb-4 w-[50%]">
                                <form.Field name="documents"
                                    validators={{
                                        onChange: (e) => {
                                            console.log(e.value[0])
                                        }
                                    }}
                                    children={(field) => {
                                        return (
                                            <>
                                                <label htmlFor={field.name} className="text-left font-medium">Documents</label>
                                                <input type="file" id={field.name} onBlur={() => field.handleBlur()} onChange={(e) => field.handleChange(e.target.files)} className="w-full px-3 py-2 border rounded" />
                                                {field.state.meta.errors && (<p className="text-red-500 text-sm mt-1">{field.state.meta.errors.join(",")}</p>)}
                                            </>
                                        )
                                    }}
                                />
                            </div>
                        </div>
                        <div className="flex justify-between items-center mb-4 gap-4">
                            <div className="mb-4 w-[50%]">
                                <form.Field name="municipality"
                                    validators={{

                                    }}
                                    children={(field) => {
                                        return (
                                            <>
                                                <label htmlFor={field.name} className="text-left font-medium">Municipality</label>
                                                <input type="text" id={field.name} value={field.state.value} defaultValue={field.state.value} onBlur={() => field.handleBlur()} onChange={(e) => field.handleChange(e.target.value)} className="w-full px-3 py-2 border rounded" />
                                                {field.state.meta.errors && (<p className="text-red-500 text-sm mt-1">{field.state.meta.errors.join(",")}</p>)}
                                            </>
                                        )
                                    }}
                                />
                            </div>
                            <div className="mb-4 w-[50%]">
                                <form.Field name="district"
                                    validators={{

                                    }}
                                    children={(field) => {
                                        return (
                                            <>
                                                <label htmlFor={field.name} className="text-left font-medium">District</label>
                                                <input type="text" id={field.name} value={field.state.value} defaultValue={field.state.value} onBlur={() => field.handleBlur()} onChange={(e) => field.handleChange(e.target.value)} className="w-full px-3 py-2 border rounded" />
                                                {field.state.meta.errors && (<p className="text-red-500 text-sm mt-1">{field.state.meta.errors.join(",")}</p>)}
                                            </>
                                        )
                                    }}
                                />
                            </div>

                            <div className="mb-4 w-[50%]">
                                <form.Field name="state"
                                    children={(field) => {
                                        return (
                                            <>
                                                <label htmlFor={field.name} className="text-left font-medium">State</label>
                                                <input type="text" id={field.name} value={field.state.value} onBlur={() => field.handleBlur()} onChange={(e) => field.handleChange(e.target.value)} className="w-full px-3 py-2 border rounded" />
                                                {field.state.meta.errors && (<p className="text-red-500 text-sm mt-1">{field.state.meta.errors.join(",")}</p>)}
                                            </>
                                        )
                                    }}
                                />
                            </div>
                        </div>
                        <div className="flex justify-between items-center mb-4 gap-4">
                            <div className="mb-4 w-[50%]">
                                <form.Field name="wardNo"
                                    validators={{

                                    }}
                                    children={(field) => {
                                        return (
                                            <>
                                                <label htmlFor={field.name} className="text-left font-medium">Ward No</label>
                                                <input type="text" id={field.name} value={field.state.value} onBlur={() => field.handleBlur()} onChange={(e) => field.handleChange(e.target.value)} className="w-full px-3 py-2 border rounded" />
                                                {field.state.meta.errors && (<p className="text-red-500 text-sm mt-1">{field.state.meta.errors.join(",")}</p>)}
                                            </>
                                        )
                                    }}
                                />
                            </div>
                            
                        </div>
                        <div className="mb-4 w-full">
                            <form.Field name="description"
                                validators={{
                                    onBlur: ({ value }) => {
                                        console.log("Blur Description", value);
                                    },
                                }}
                                children={(field) => {
                                    return (
                                        <>
                                            <label htmlFor={field.name} className="text-left font-medium">About Land</label>
                                            <textarea id={field.name} rows={3} cols={100} value={field.state.value} onBlur={() => field.handleBlur()} onChange={(e) => field.handleChange(e.target.value)} className="w-full px-3 py-2 border rounded" ></textarea>
                                            {field.state.meta.errors && (<p className="text-red-500 text-sm mt-1">{field.state.meta.errors.join(",")}</p>)}
                                        </>
                                    )
                                }}
                            />
                        </div>


                        <form.Subscribe
                            selector={(state) => [state.canSubmit, state.isSubmitting]}
                            children={([isSubmitting]) => (
                                <input type="submit" disabled={isPending} className={`w-full ${isPending ? "bg-blue-300" : "bg-blue-800 hover:bg-blue-600"}  text-white py-2 rounded `}
                                    value={isPending ? 'Registering...' : 'Register'}
                                />
                            )}
                        />
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default LandRegister;