import { createFileRoute, Link } from '@tanstack/react-router'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getLandsByUserId, updateLandStatus } from '@/lib/axios/land'
import { useAuth } from '@/lib/provider/AuthProvider'
import { Button } from '@/components/ui/button'
import { deleteLandById } from '@/lib/axios/land'

export const Route = createFileRoute('/user/_layout/mylands')({
  component: RouteComponent,
  // loader: async ({context})=>{
  //   await context.queryClient.ensureQueryData({
  //     queryKey: ['my-lands'],
  //     queryFn: getLandsByUserId(context?.user?.id)
  //   });
  // }
})

function RouteComponent() {
  const { userAuth } = useAuth();

  const queryClient = useQueryClient();
  const userId = userAuth?.user?.id || userAuth?.user?._id;
  console.log(userId)
  const { data, isPending } = useQuery({
    queryKey: ['my-lands', userId],
    queryFn: async () => await getLandsByUserId(userId),
  })

  const mutateSellStatus = useMutation({
    mutationFn: async (landId: string) => await updateLandStatus(landId),
    onSuccess: () => {
      // Invalidate the query to refetch the lands after updating sell status
      queryClient.invalidateQueries({ queryKey: ['my-lands', userAuth?.user?.id] })
    },
    onError: (error) => {
      console.error("Error updating land sell status:", error);
    }
  })

  const mutateDeleteLand = useMutation({
    mutationFn: async (landId: string) => await deleteLandById(landId),
    onSuccess: () => {
      // Invalidate the query to refetch the lands after deleting a land
      queryClient.invalidateQueries({ queryKey: ['my-lands', userAuth?.user?.id] })
    },
    onError: (error) => {
      console.error("Error deleting land:", error);
    }
  })

  return (
    <>
      <div className="flex flex-col w-full">
        <h3 className="text-xl px-4 py-2 font-bold">My Lands</h3>
        <p className='px-4'>List of lands owned by the user will be displayed here.</p>
        {/* You can add components or logic to display user's lands here */}

        <div className='w-full px-4 py-3'>
          <Card>
            <CardContent className="w-full">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px] font-bold">S.N.</TableHead>
                    <TableHead className="font-bold text-center">Land ID(Kitta No)</TableHead>
                    <TableHead className="font-bold text-center">Area</TableHead>
                    <TableHead className="font-bold text-center">Price</TableHead>
                    <TableHead className="font-bold text-center">City</TableHead>
                    <TableHead className="font-bold text-center">State</TableHead>
                    <TableHead className="font-bold text-center">Status(Ward)</TableHead>
                    <TableHead className='font-bold text-center'>Status(Napi)</TableHead>
                    <TableHead className="font-bold text-center">Status(Rev.Dept.)</TableHead>
                    <TableHead className="font-bold text-center">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>             
                  
                  {
                    data?.data?.map((land, index) => {
                      return (

                        <TableRow key={index}>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell>
                            <Link to={`/user/land/${land._id}`}>
                            {land.landId}</Link>
                          </TableCell>
                          <TableCell>{land.areaSize}</TableCell>
                          <TableCell className="text-right">{land.price}</TableCell>
                          <TableCell>{land.city}</TableCell>
                          <TableCell>{land.state}</TableCell>
                          <TableCell>{land.verifiedByWard?"Verified":"Not-Verified"}</TableCell>
                          <TableCell>{land.verifiedByNapi?"Verified":"Not-Verified"}</TableCell>
                          <TableCell>{land.verifiedByRevenueDepart ? "Verified" : "Not Verified"}</TableCell>
                          <TableCell>
                            <Link to={`/user/land/${land._id}`}>
                            <Button
                              variant='outline'
                            >
                              View
                            </Button>
                            </Link>
                            <Button className='bg-red-500 mx-2 hover:bg-red-700 text-white' onClick={()=>mutateDeleteLand.mutate(land._id)}>
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  }
                </TableBody></Table>
                <p className='text-center py-3 '>{data?.data?.length==0?data.message:null}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
