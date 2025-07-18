import { useMutation } from '@tanstack/react-query'
import { formOptions, useForm } from '@tanstack/react-form'

import { useAuth } from '@/lib/provider/AuthProvider'

import { registerRecommendation } from '@/lib/axios/recommendation';
import { toast } from 'react-toastify';
const RCForm = ({ buyer, verifiedData }) => {
    const { userAuth } = useAuth();
    const formOpts = formOptions({
        defaultValues: {
            landId: verifiedData?.data?._id,
            sellerId: verifiedData?.data?.ownerId,
            buyerId: buyer?.data?._id,
            documents: "",
            verifiedByWardOfficer: userAuth?.user?._id || userAuth?.user?.id,
        }
    });

    const form = useForm({
        ...formOpts,
        onSubmit: ({ value }) => {
            mutateRecommendation.mutate(value);
        }
    });

    const mutateRecommendation = useMutation({
        mutationFn: async (values: any) => {
            // Add your API call logic here
            return await registerRecommendation(values);
        },
        onSuccess: (data) => {
            console.log("Recommendation Creation Success", data);
            toast.success(data?.message);
        },

        onError: (error) => {
            toast.error(error?.message || "Failed to create recommendation");
        }
    });

    return (
        <div>
            <form className="w-full" encType='multipart/form-data' onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit(e);
            }}>
                <div className="flex justify-start items-center mb-4 gap-2">

                    <div className="mb-4">

                        <form.Field name="documents" children={(field) => (
                            <>
                                <label htmlFor={field.name} className="text-left font-medium">Upload Recommendation Letter</label>
                                <input
                                className='w-full px-3 py-2 border rounded'
                                    type="file"
                                    id={field.name}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) field.handleChange(file);
                                    }}
                                />
                                {field.state.meta.errors && (
                                    <p className="text-red-500 text-sm">{field.state.meta.errors.join(",")}</p>
                                )}
                            </>
                        )} />
                    </div>
                    <form.Subscribe
                        selector={(state) => [state.canSubmit, state.isSubmitting]}
                        children={([isSubmitting]) => (
                            <input type="submit" disabled={mutateRecommendation.isPending} className={`px-5 py-2 ${mutateRecommendation.isPending ? "bg-blue-300" : "bg-blue-800 hover:bg-blue-600"}  text-white py-2 rounded `}
                                value={mutateRecommendation.isPending ? 'Creating...' : 'Create Recommendation'}
                            />
                        )}
                    />

                </div>
            </form>
        </div>
    )
}

export default RCForm