import { createFileRoute } from '@tanstack/react-router'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getLandsWhichIsAvailableForSell, verifyOTPandSellProcess } from '@/lib/axios/land'
import { useAuth } from '@/lib/provider/AuthProvider'
import { Button } from '@/components/ui/button'

import { Info } from 'lucide-react'
import { formOptions, useForm } from '@tanstack/react-form'

import RecommendationForm from "@/components/RecommendationForm/RecommendationForm"
import { toast } from "react-toastify";

export const Route = createFileRoute('/admin/_layout/recommendation')({
  component: RouteComponent,

})

function RouteComponent() {
  const { userAuth } = useAuth();

  
  const mutateOTP = useMutation({
    mutationFn: (values:any)=>{
      return verifyOTPandSellProcess(values);
    },
    onSuccess: (data) => {
      console.log("OTP Verification Success", data);
      toast.success(data?.message);
    },
    onError: (error) => {
      console.error("OTP Verification Error", error);
      // Handle error, e.g., show an error message
    }
  })




  const formOpts = formOptions({
    defaultValues: {
      landId: "",
      otp: "",
      sellerEmail: "",
    }
  })
  const form = useForm({
    ...formOpts,
    onSubmit: ({ value }) => {
      // Handle form submission
      console.log("Form submitted with values:", value);
      mutateOTP.mutate(value);

    }
  })


  return (
    <>
      <div className="flex flex-col w-full">

        <div className='w-full'>
          <h3 className="text-xl px-4 py-2 font-bold">Land Transaction Recommendation</h3>
          <Card className="m-2 p-4 flex justify-start items-center flex-row">
            <Info />
            <p>
              To issue a Recommendation letter seller and buyer most submit their required documents.
            </p>

          </Card>
          <Card className='mx-2 mt-3'>

            <CardContent className='w-full'>
              <form className="w-full" onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log(e)
                form.handleSubmit(e);
              }}>
                <div className="flex justify-between items-center mb-4 gap-4">
                  <div className="mb-4 ">
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
                  <div className="mb-4">
                    <form.Field name="otp"
                      validators={{
                        onBlur: ({ value }) => {
                          console.log("Blur Land Id", value);
                        },
                      }}
                      children={(field) => {
                        return (
                          <>
                            <label htmlFor={field.name} className="text-left font-medium">OTP</label>
                            <input type="text" id={field.name} value={field.state.value} onBlur={() => field.handleBlur()} onChange={(e) => field.handleChange(e.target.value)} className="w-full px-3 py-2 border rounded" />
                            {field.state.meta.errors && (<p className="text-red-500 text-sm mt-1">{field.state.meta.errors.join(",")}</p>)}
                          </>
                        )
                      }}
                    />
                  </div>
                  <div className="mb-4">
                    <form.Field name="sellerEmail"
                      validators={{
                        onBlur: ({ value }) => {
                          console.log("Blur Land Id", value);
                        },
                      }}
                      children={(field) => {
                        return (
                          <>
                            <label htmlFor={field.name} className="text-left font-medium">Seller Email</label>
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
                      <input type="submit" disabled={false} className={`px-5 py-2 ${false ? "bg-blue-300" : "bg-blue-800 hover:bg-blue-600"}  text-white py-2 rounded `}
                        value={false ? 'Verifying...' : 'Verify'}
                      />
                    )}
                  />
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {mutateOTP.isSuccess && RecommendationForm && (
          <RecommendationForm verifiedData={mutateOTP.data}/>)}
      </div>
    </>
  )
}
