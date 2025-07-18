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
const LandRegister = () => {

    const { mutate, isPending } = useMutation({
        mutationFn: async (value: any) => {
            // Simulate an API call
            console.log("Registering land with:", value);
            // Here you would typically make an API call to register the land
            return registerLand(value)
        }
    })

    // Get user authentication details
    const { userAuth } = useAuth();
    // Get form options    
    const formOpts = formOptions({
        defaultValues: {
            landId: "",
            ownerId: userAuth?.user?.id || "",
            areaSize: "",
            citizenshipNo: userAuth?.user?.citizenshipNo || "",
            description: '',
            price: "",
            city: "",
            state: "",
            documents: "",
        }
    })
    const form = useForm({
        ...formOpts,
        onSubmit: ({ value }) => {
            // Handle form submission
            console.log("Form submitted with values:", value);
            mutate(value);

        }
    })
    return (
        <div>
            <h3 className="text-xl px-4 py-2 font-bold">Register Your Land</h3>
            <Card className="m-2 p-4 flex justify-between items-center flex-row">
                <Info />
                <p>
                    To register your land, please provide the necessary details and documents.
                    Ensure that you have all the required information ready before proceeding.
                </p>

            </Card>
            <Card className='mx-2 mt-3 p-4'>
                <CardHeader>
                    <h2 className="text-2xl font-bold">Land Registration Form</h2>
                    <p className="text-sm text-gray-500">Please fill out the form below to register your land.</p>
                </CardHeader>
                <CardContent>
                    <form className="w-full max-w-md" encType='multipart/form-data' onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log(e)
                        form.handleSubmit(e);
                    }}>
                        <div className="flex justify-between items-center mb-4 gap-4">
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
                                                <label htmlFor={field.name} className="text-left font-medium">Land Id</label>
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
                        </div>
                        <div className="flex justify-between items-center mb-4 gap-4">
                            <div className="mb-4 w-[50%]">
                                <form.Field name="documents"
                                    validators={{
                                        onChange:(e) => {
                                            if (e.target.files) {
                                                field.handleChange(Array.from(e.target.files));
                                            }
                                            
                                        },
                                        onBlur: ({ value }) => {
                                            console.log("Blur Documents", value);
                                        },
                                    }}
                                    children={(field) => {
                                        return (
                                            <>
                                                <label htmlFor={field.name} className="text-left font-medium">Deeds</label>
                                                <input type="file" id={field.name} value={field.state.value} onBlur={() => field.handleBlur()} onChange={(e) => field.handleChange(e.target.value)} className="w-full px-3 py-2 border rounded" />
                                                {field.state.meta.errors && (<p className="text-red-500 text-sm mt-1">{field.state.meta.errors.join(",")}</p>)}
                                            </>
                                        )
                                    }}
                                />
                            </div>
                            <div className="mb-4 w-[50%]">
                                <form.Field name="price"
                                    validators={{
                                        onBlur: ({ value }) => {
                                            console.log("Blur firstname", value);
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
                        </div>
                        <div className="flex justify-between items-center mb-4 gap-4">
                            <div className="mb-4 w-[50%]">
                                <form.Field name="city"
                                    children={(field) => {
                                        return (
                                            <>
                                                <label htmlFor={field.name} className="text-left font-medium">City</label>
                                                <input type="text" id={field.name} value={field.state.value} onBlur={() => field.handleBlur()} onChange={(e) => field.handleChange(e.target.value)} className="w-full px-3 py-2 border rounded" />
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