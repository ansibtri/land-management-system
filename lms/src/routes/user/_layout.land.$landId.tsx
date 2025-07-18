import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { getLandById, uploadTaxVoucher } from '@/lib/axios/land';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { updateLandStatus } from '@/lib/axios/land';
import { useAuth } from '@/lib/provider/AuthProvider';
import { Loader } from 'lucide-react';
import { formOptions, useForm } from '@tanstack/react-form';
import { toast } from 'react-toastify';

export const Route = createFileRoute('/user/_layout/land/$landId')({
  component: RouteComponent,
})

function RouteComponent() {
  const params = Route.useParams();
  const queryClient = useQueryClient();
  const { userAuth } = useAuth();

  const { data, isPending, isSuccess } = useQuery({
    queryKey: ['lands', params.landId],
    queryFn: async () => await getLandById(params.landId)
  })

  const mutateSellStatus = useMutation({
    mutationFn: async (landId: string) => await updateLandStatus(landId),
    onSuccess: (data) => {
      console.log(data)
      // Invalidate the query to refetch the lands after updating sell status
      // queryClient.invalidateQueries({ queryKey: ['my-lands', userAuth?.user?.id] })
      // queryClient.invalidateQueries({ queryKey: ['lands', params.landId] })
    },
    onError: (error) => {
      console.error("Error updating land sell status:", error);
    }
  })

  const formOpts = formOptions({
    defaultValues: {
      landId: params.landId,
      userId: userAuth?.user?.id,
      documents: "",

    }
  })

  const form = useForm({
    ...formOpts,
    onSubmit: async ({ value }) => {
      console.log("Form submitted with values:", value);
      // Handle form submission logic here
      mutateTax.mutate(value)
    }
  });

  const mutateTax = useMutation({
    mutationFn: async (values: any) => {
      return await uploadTaxVoucher(values);
    },
    onSuccess: (data) => {
      console.log("Tax Creation Success", data);
      toast.success(data?.message);
    },
    onError: (error) => {
      console.error("Tax Creation Error:", error);
      toast.error(error?.message || "Failed to create tax");
    }
  });


  console.log(data, "data from land by id");
  return <div className='flex'>
    <div className='w-full m-2'>
      <Card className="m-2 p-4 flex justify-between items-center flex-column">
        <CardHeader>
          <h2 className='font-bold text-center text-2xl text-nowrap'>Land Profile</h2>
        </CardHeader>
        <CardContent>
          <div className='flex flex-row py-4 w-full justify-between items-center gap-10'>
            <div className='flex justify-between items-center gap-3'>
              <p className='font-bold'>KittaNo:</p>
              <p>{data?.data?.landId}</p>
            </div>
            <div className='flex justify-between items-center gap-3'>
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
            <div className='flex justify-between items-center gap-3'>
              <p className='font-bold'>District: </p>
              <p>{data?.data?.district}</p>
            </div>
            <div className='flex justify-between items-center gap-3'>
              <p className='font-bold'>State:</p>
              <p>{data?.data?.state} </p>
            </div>
          </div>
          <div className='flex flex-row py-4 justify-between items-center gap-10'>

            <div className='flex justify-between items-center gap-3'>
              <p className='font-bold'>WardNo:</p>
              <p>{data?.data?.wardNo} </p>
            </div>
            <div className='flex justify-between items-center gap-3'>
              <p className='font-bold'>Land Documents:</p>
              <p><a href={`http://localhost:5000/${data?.data?.documents}`} className='text-blue-500 underline' target='_blank'>PDF</a> </p>
            </div>
            {data?.data?.taxId ? (<div className='flex justify-between items-center gap-3'>
              <p className='font-bold'>Tax Documents:</p>
              <p><a href={`http://localhost:5000/${data?.data?.bankVoucher}`} className='text-blue-500 underline' target='_blank'>PDF</a> </p>
            </div>) : null}
          </div>
          {!data?.data?.verifiedByNapi || !data?.data?.verifiedByWard ? (
            <p><span className='font-bold'>Note</span>: Details Must be verified by Napi and Ward for uploading voucher.</p>
          ):null}
          {data?.data?.taxId==null && data?.data?.verifiedByNapi && data?.data?.verifiedByWard ? (
            <div className='flex flex-row py-4 justify-between items-center gap-10'>
              <form className="w-full" encType='multipart/form-data' onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit(e);
              }}>
                <div className="flex justify-start items-center mb-4 gap-2">

                  <div className="mb-4">

                    <form.Field name="documents" children={(field) => (
                      <>
                        <label htmlFor={field.name} className="text-left font-bold my-4">Upload Bank Voucher: </label>
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
                      <input type="submit" disabled={mutateTax.isPending} className={`px-5 py-2 ${mutateTax.isPending ? "bg-blue-300" : "bg-blue-800 hover:bg-blue-600"}  text-white py-2 rounded `}
                        value={mutateTax.isPending ? 'Uploading...' : 'Upload Voucher'}
                      />
                    )}
                  />

                </div>
              </form>
            </div>
          ) : null}
        </CardContent>
        <CardFooter>
          {data?.data?.verifiedByNapi && data?.data?.verifiedByWard ? <Button
            variant='outline'
            className='w-full'
            onClick={() => mutateSellStatus.mutate(params.landId)}
            disabled={mutateSellStatus.isPending}
          >
            {data?.data?.sellStatus ? "Unlist" : "List for Sale"}
            {mutateSellStatus?.isPending ? <Loader /> : null}
          </Button> : <p>Not allowed to sell</p>}
        </CardFooter>

      </Card>
    </div>
  </div>
}
