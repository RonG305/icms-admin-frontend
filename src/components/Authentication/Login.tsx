'use client'

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMutation } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { Separator } from "../ui/separator"


export function Login() {
    const [formData, setFormData] = useState<any>({
        email: '',
        password: ''
    })

    const router = useRouter()

    const { mutate, isPending } = useMutation({
        // mutationFn: async (data: any) => authService.login(data),
        // onSuccess: (data) => {
        //     console.log(data);
        //     if (data?.error) {
        //         showToast({
        //             type: 'error',
        //             message: data.error || "Login failed",
        //             title: 'Error',
        //         })
        //         return
        //     }
        //     document.cookie = `token=${data.access}; path=/`
        //     localStorage.setItem("token", data.access)
        //     toast.success("Login successful", { duration: 2000 })
        //     router.push('/dashboard')
        // },
        // onError: (error: any) => {
        //     showToast({
        //         type: 'error',
        //         message: error?.response?.data?.message || "Login failed",
        //         title: 'Error',
        //     })
        // },

    })

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        mutate(formData)
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <Card className="w-full mx-2 p-4   max-w-3xl">
            <div className=" flex md:flex-row flex-col md:items-start items-center gap-x-4">
                <div className="md:w-1/2 flex flex-col items-center mb-6 md:mb-0">
                    <Image
                        src="/milk-cooperation.jpg"
                        alt="Logo"
                        width={150}
                        height={150}
                        className="mx-auto"
                    />
                    <div className="text-center font-bold">
                        <h2 className="text-2xl  text-primary">Coolpam</h2>
                         <p className="text-sm text-secondary ">Utility management</p>
                    </div>
                </div>

                <div className="w-full">

                    <CardHeader className="text-start">
                        <CardTitle className=" text-2xl text-primary">Signin to account</CardTitle>
                        <Separator className="mb-6" />
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="mail@example.com"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Password</Label>
                                        <a
                                            href="#"
                                            className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                        >
                                            Forgot your password?
                                        </a>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="w-full my-5">
                                {isPending && <Loader2 className=" animate-spin" />}
                                Login
                            </Button>


                        </form>

                        <div className="text-center font-medium text-sm mt-4">
                            <Link href="/auth/register">Don't have an account ? <span className="text-secondary">Register</span></Link>
                        </div>
                    </CardContent>
                </div>
            </div>
        </Card>
    )
}
