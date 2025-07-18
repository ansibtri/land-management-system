import { createFileRoute } from '@tanstack/react-router'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useAuth } from '@/lib/provider/AuthProvider'
import { Button } from '@/components/ui/button'
import { getUnverifiedUsers, updateUserVerificationStatus } from '@/lib/axios/user'
import { toast } from 'react-toastify'


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

  const mutateUserVerificationStatus = useMutation({
    mutationFn: async(userId:string)=>await updateUserVerificationStatus(userId),
    onSuccess: (data) => {
      // Invalidate the query to refetch the lands after updating sell status
      queryClient.invalidateQueries({ queryKey: ['unverified-users', userAuth?.user?.id] })
      console.log("User verification status updated successfully",data);
      toast.success(data?.message || "User verification status updated successfully");

    },
    onError: (error) => {
      console.error("Error updating land sell status:", error);
      toast.error(error?.response?.data?.message || "Error updating user verification status");
    }
  })

  let sno=0;
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
                    <TableHead className="w-[100px]">S.N.</TableHead>
                    <TableHead>Firstname</TableHead>
                    <TableHead>Lastname</TableHead>
                    <TableHead className="text-right">Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Citizenship</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                    data?.data?.map((user, index) => {
                     if(user?.role !="user" && user?.email !=userAuth?.user?.email && user?.email!="admin@lms.com"){
                      sno+=1;
                       return (
  
                          <TableRow>
                            <TableCell className="font-medium">{sno}</TableCell>
                            <TableCell>{user.firstname}</TableCell>
                            <TableCell>{user.lastname}</TableCell>
                            <TableCell className="text-right">{user.phone}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>{user.isVerified?"Verified":"Unverified"}</TableCell>
                            <TableCell>{user.citizenshipNo}</TableCell>
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
                        )
                     } 
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
