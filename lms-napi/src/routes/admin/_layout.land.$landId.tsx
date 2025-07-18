import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { getLandById, verifyLandByWardOfficer } from '@/lib/axios/land';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/lib/provider/AuthProvider';
import { formOptions, useForm } from '@tanstack/react-form';
import { verifyLandByNapi } from '@/lib/axios/land';
import { useState } from 'react';
import { toast } from 'react-toastify';
export const Route = createFileRoute('/admin/_layout/land/$landId')({
  component: RouteComponent,
})

function RouteComponent() {
  const params = Route.useParams();
  const { userAuth } = useAuth();
  const userId = userAuth?.user?.id || userAuth?.user?._id;

  const { data } = useQuery({
    queryKey: ['lands', params.landId],
    queryFn: async () => await getLandById(params.landId)
  })


  const formOpts = formOptions({
    defaultValues: {
      landId: data?.data?._id,
      verifyLandByWardOfficer: userAuth?.user?.id || userAuth?.user?._id,
      description: "",
      action: "reject",
    }
  })
  const form = useForm({
    ...formOpts,
    onSubmit: ({ value }) => {
      // Handle form submission
      mutateNapiVerification.mutate(value);

    }
  });

  const mutateNapiVerification = useMutation({
    mutationFn: async (values)=>{
      return await verifyLandByNapi(values);
    },
    onSuccess: (data) => {
      toast.success(data?.message);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Error verifying land by Napi");
    }
  })

  return <div className='flex'>
    <div className='w-full m-2'>
      <Card className="m-2 px-2 flex justify-between py-7 flex-column">
        <CardHeader>
          <h2 className='font-bold text-2xl text-nowrap text-left'>Land Profile</h2>
        </CardHeader>
        <CardContent>
          <div className='flex flex-row py-4 justify-between items-center gap-10'>
            <div className='flex justify-between items-center gap-3'>
              <p className='font-bold'>KittaNo:</p>
              <p>{data?.data?.landId}</p>
            </div>
            <div className='flex justify-between items-center gap-3 px-52'>
              <p className='font-bold'>Area(sq.ft): </p>
              <p>{data?.data?.areaSize}</p>
            </div>
            <div className='flex justify-between items-center gap-3'>
              <p className='font-bold'>Type:</p>
              <p>{data?.data?.landType} </p>
            </div>
          </div>
          <div className='flex flex-row py-4 justify-between items-center gap-10'>
            <div className='flex justify-between items-center gap-3'>
              <p className='font-bold'>Municipality:</p>
              <p>{data?.data?.municipality}</p>
            </div>
            <div className='flex justify-between items-center gap-3 px-17'>
              <p className='font-bold'>District: </p>
              <p>{data?.data?.district}</p>
            </div>
            <div className='flex justify-between items-center gap-3'>
              <p className='font-bold'>State:</p>
              <p>{data?.data?.state} </p>
            </div>
          </div>
          <div className='flex flex-row py-4 justify-between items-center gap-x-48'>

            <div className='flex justify-between items-center gap-3'>
              <p className='font-bold'>WardNo:</p>
              <p>{data?.data?.wardNo} </p>
            </div>
            <div className='flex justify-between items-center gap-3'>
              <p className='font-bold '>Documents:</p>
              <p className='text-blue-500 underline'><a href={`http://localhost:5000/${data?.data?.documents}`} target='_blank'>PDF</a> </p>
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
              <p>{data?.data?.firstname + " " + data?.data?.lastname}</p>
            </div>
            <div className='flex justify-between items-center gap-3 px-52'>
              <p className='font-bold'>Citizenship No:  </p>
              <p>{data?.data?.citizenshipNo}</p>
            </div>
            <div className='flex justify-between items-center gap-3'>
              <p className='font-bold'>Citizenship:</p>
              <p><a href={`http://localhost:5000/{data?.data?.citizenshipDoc}`} className='text-blue-500 underline'>CitizenshipPDF</a> </p>
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
            {!data?.data?.verifiedByNapi ? 
            <Button className='bg-green-500 hover:bg-green-800' onClick={()=>mutateNapiVerification.mutate({
              landId: data?.data?._id,
              verifyLandByNapi: userId,
              action: 'verify'
            })}>Verify</Button> : null}
          </div>
        </CardContent>
        <CardFooter>
          

            {data?.data?.verifiedByNapi?
              (
                <div className='flex flex-col justify-between gap-3'>
                  <p className='font-bold'>Reason of Rejection: </p><br/>
                  <p>{data?.data?.verifiedMsgByWardOfficer}</p>
                </div>) : null}
          {!data?.data?.verifiedByNapi ?
            <form
              className="w-full" encType='multipart/form-data' onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log(e)
                form.handleSubmit(e);
              }}>
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
                        <label htmlFor={field.name} className="text-left font-bold">Feedback</label>
                        <textarea id={field.name} rows={3} cols={100} value={field.state.value} onBlur={() => field.handleBlur()} onChange={(e) => field.handleChange(e.target.value)} className="w-full px-3 py-2 border rounded" ></textarea>
                        {field.state.meta.errors && (<p className="text-red-500 text-sm mt-1">{field.state.meta.errors.join(",")}</p>)}
                      </>
                    )
                  }}
                />
              </div>

              <div className='flex flex-row justify-between items-center'>
                {!data?.data?.verifiedByNapi ? <form.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                  children={([isSubmitting]) => (
                    <input type="submit" name="action" disabled={mutateNapiVerification.isPending} className={`w-full mx-2 bg-red-500 text-white ${mutateNapiVerification.isPending ? "bg-red-200" : " hover:bg-red-600"}  text-white py-2 rounded `}
                      value="Reject"
                    />
                  )}
                /> : null}
              </div>
            </form> : null}
        </CardFooter>

      </Card>
    </div>
  </div>
}
