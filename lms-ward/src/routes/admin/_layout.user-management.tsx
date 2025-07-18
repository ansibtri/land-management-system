import { createFileRoute } from '@tanstack/react-router'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useAuth } from '@/lib/provider/AuthProvider'
import { Button } from '@/components/ui/button'
import { getUnverifiedUsers, updateUserVerificationStatus } from '@/lib/axios/user'


export const Route = createFileRoute('/admin/_layout/user-management')({
  component: RouteComponent,

})

function RouteComponent() {
  const { userAuth } = useAuth();

  const queryClient = useQueryClient();

  const { data, isPending } = useQuery({
    queryKey: ['unverified-users'],
    queryFn: async () => await getUnverifiedUsers(),
  })

  console.log("Unverified Users Data:", data);

  const mutateUserVerificationStatus = useMutation({
    mutationFn: async(userId:string)=>await updateUserVerificationStatus(userId),
    onSuccess: (data) => {
      // Invalidate the query to refetch the lands after updating sell status
      queryClient.invalidateQueries({ queryKey: ['unverified-users', userAuth?.user?.id] })
      console.log("User verification status updated successfully",data);

    },
    onError: (error) => {
      console.error("Error updating land sell status:", error);
    }
  })
  
  
  return (
    <>
      <div className="flex flex-col w-full">
        <h3 className="text-xl px-4 py-2 font-bold">User Management</h3>
        <p className='px-4'>
          User management section allows you to verify and manage users who have registered on the platform.
        </p>
        {/* You can add components or logic to display user's lands here */}

        <div className='w-full px-4 py-3'>
          <Card className='w-full'>
            <CardContent className="w-full">
              <Table className='w-full'>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px] font-bold">S.N.</TableHead>
                    <TableHead className='font-bold'>Firstname</TableHead>
                    <TableHead className='font-bold'>Lastname</TableHead>
                    <TableHead className="text-right font-bold">Phone</TableHead>
                    <TableHead className='font-bold'>Email</TableHead>
                    <TableHead className='font-bold'>Role</TableHead>
                    <TableHead className='font-bold'>Status</TableHead>
                    <TableHead className='font-bold'>Citizenship No</TableHead>
                    <TableHead className='font-bold'>Citizenship Doc</TableHead>
                    <TableHead className='font-bold'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                    data?.data?.map((user, index) => {
                     return user?.role =="user"? (

                        <TableRow key={index}>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell>{user.firstname}</TableCell>
                          <TableCell>{user.lastname}</TableCell>
                          <TableCell className="text-right">{user.phone}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.role}</TableCell>
                          <TableCell>{user.isVerified?"Verified":"Unverified"}</TableCell>
                          <TableCell>{user.citizenshipNo}</TableCell>
                          <TableCell><a className='text-blue-500 underline' href={`http://localhost:5000/${user.citizenshipDoc}`} target='_blank'>PDF</a></TableCell>
                          <TableCell>
                            <Button 
                              variant='outline' 
                              className='w-full' 
                              onClick={() => mutateUserVerificationStatus.mutate(user._id)}
                              disabled={mutateUserVerificationStatus.isPending}
                            >
                              {mutateUserVerificationStatus.isPending ? "Verifying..." : "Verify User"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ):null
                    })
                  }
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
