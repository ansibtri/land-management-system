import { createFileRoute, Link } from '@tanstack/react-router'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { getAllLandsOfArea } from '@/lib/axios/land'
import { useAuth } from '@/lib/provider/AuthProvider';

export const Route = createFileRoute('/admin/_layout/land-records')({
  component: RouteComponent,
})

function RouteComponent() {

  const { userAuth } = useAuth();
  const userId = userAuth?.user?.id || userAuth?.user?._id;
  
  const { data, isPending } = useQuery({
    queryKey: ['landRecords'],
    queryFn: async () => await getAllLandsOfArea(),
  });
  console.log("landRecords", data);
  let sn=0;
  return (
    <>
      <div className="flex flex-col w-full">
        <h3 className="text-xl px-4 py-2 font-bold">Land Records</h3>
        <p className='px-4'>List of the lands shown</p>
        {/* You can add components or logic to display user's lands here */}

        <div className='w-full px-4 py-3'>
          <Card className='w-full'>
            <CardContent className="w-full">
              <Table className='w-full'>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px] font-bold">S.N.</TableHead>
                    <TableHead className="font-bold text-center">Land ID(Kitta No)</TableHead>
                    <TableHead className="font-bold text-center">Area</TableHead>
                    <TableHead className="text-right font-bold text-center">Price</TableHead>
                    <TableHead className="font-bold text-center">City</TableHead>
                    <TableHead className="font-bold text-center">State</TableHead>
                    <TableHead className="font-bold text-center">Status(Ward)</TableHead>
                    <TableHead className='font-bold text-center'>Status(Napi)</TableHead>
                    <TableHead className="font-bold text-center">Status(Rev.Dept.)</TableHead>
                    <TableHead className="font-bold text-center">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>

                  {data?.data?.map((land, index) => {
                    if (land.verifiedByNapi != true){
                      sn+=1

                    
                    return (

                      <TableRow key={index}>
                        <TableCell className="font-medium">{sn}</TableCell>
                        <TableCell>{land.landId}</TableCell>
                        <TableCell>{land.areaSize}</TableCell>
                        <TableCell className="text-right">Rs {land.price}</TableCell>
                        <TableCell>{land.city}</TableCell>
                        <TableCell>{land.state}</TableCell>
                        <TableCell>{land.verifiedByWard ? "Verified" : "Not-Verified"}</TableCell>
                        <TableCell>{land.verifiedByNapi ? "Verified" : "Not-Verified"}</TableCell>
                        <TableCell>{land.verifiedByRevenueDepart ? "Verified" : "Not Verified"}</TableCell>
                        <TableCell>
                          <Link to={`/admin/land/${land?._id}`}>
                            <Button
                              variant='outline'
                            >
                              View
                            </Button></Link>

                        </TableCell>
                      </TableRow>

                    )}
                  })}




                </TableBody>
              </Table>
              {isPending ? "Loading" : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
