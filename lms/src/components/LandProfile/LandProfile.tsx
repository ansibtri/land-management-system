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
                    
                    
                </CardContent>
            </Card>
        </div>
    )
}

export default LandRegister;