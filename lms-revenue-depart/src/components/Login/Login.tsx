import { Link, useNavigate } from "@tanstack/react-router"
import { Card, CardContent, CardHeader } from "../ui/card"
import { useForm, formOptions } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { loginAccount } from "@/lib/axios/auth"
import { toast } from "react-toastify"
import { useAuth } from "@/lib/provider/AuthProvider"
const Login = () => {

    const {setUserAuth} = useAuth();
    const { mutate, isPending } = useMutation({
        mutationFn: async (value: any) => {
            value.role = "lro"; // Set role to lro for login
            return loginAccount(value);
        },
        onSuccess: (data) => {
            console.log("Login successful:", data);

            setUserAuth({
                isAuthenticated: true,
                authToken: data?.token,
                user: data?.data,
            });

            toast.success("Login successful!");
            // Reset form or perform any other actions
            form.reset();

            // Navigate to the dashboard or another page
            navigate({ to: "/admin/land-records" })
        },
        onError: (error) => {
            console.error("Login failed:", error);
            // Handle error, show notification, etc.
            toast(error?.message || "Login failed. Please try again.");
        }
    })
    const formOpts = formOptions({
        defaultValues: {
            email: '',
            password: '',
            role:"lro",
        }
    })
    const form = useForm({
        ...formOpts,
        onSubmit: ({ value }) => {
            // Handle form submission

            console.log("Form submitted with values:", value);
            mutate(value);
        }
    });
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center h-screen">
            <Card>
                <CardHeader className="text-center">
                    <h1 className="text-2xl font-bold">Login</h1>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                    
                    <form className="w-full max-w-sm" onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log(e)
                        form.handleSubmit(e);
                    }}>
                        <div className="mb-4">
                            <form.Field name="email"
                                validators={{
                                    onChange: ({ value }) => {
                                        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                                        if (!pattern.test(value)) {
                                            return "Invalid Email Address";
                                        }
                                    },
                                    onBlur: ({ value }) => {
                                        console.log("Blur firstname", value);
                                    },
                                }}
                                children={(field) => {
                                    return (
                                        <>
                                            <label htmlFor={field.name} className="text-left font-medium">Email</label>
                                            <input type="text" id={field.name} value={field.state.value} onBlur={() => field.handleBlur()} onChange={(e) => field.handleChange(e.target.value)} className="w-full px-3 py-2 border rounded" />
                                            {field.state.meta.errors && (<p className="text-red-500 text-sm mt-1">{field.state.meta.errors.join(",")}</p>)}
                                        </>
                                    )
                                }}
                            />
                        </div>
                        <div className="mb-4">
                            <form.Field name="password"
                                validators={{
                                    onChange: ({ value }) => {
                                        if (value.length < 6) {
                                            return "Minimum 6 characters is required.";
                                        }
                                        return undefined;
                                    },
                                    onBlur: ({ value }) => {
                                        console.log("Blur email", value);
                                    },
                                }}
                                children={(field) => {
                                    return (
                                        <>
                                            <label htmlFor={field.name} className="text-left font-medium">Password</label>
                                            <input type="password" id={field.name} value={field.state.value} onBlur={() => field.handleBlur()} onChange={(e) => field.handleChange(e.target.value)} className="w-full px-3 py-2 border rounded" />
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
                                    value={isPending ? 'Logging In...' : 'Login'}
                                />
                            )}
                        />
                    </form>
                </CardContent>
                <CardContent className="text-center mt-4">
                    <p className="text-sm text-gray-500">Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline">Register here</Link>.</p>
                </CardContent>
            </Card>
        </div>
    )
}

export default Login