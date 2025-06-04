'use client'

import { Label } from "@radix-ui/react-dropdown-menu";
import { ThemeToggle } from "../dashboard/themeToggle";
import { Button } from "../ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { useState } from "react";
import { Eye, EyeOff, Paintbrush } from "lucide-react";
import Link from "next/link";
import axios from 'axios'
import { useRouter } from "next/navigation";

export default function SignupCard() {
    const router = useRouter();
    const [isView, setIsView] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formdata, setFormdata] = useState({
        name: "",
        username: "",
        email: "",
        password: ""
    });

    const handleRedirect = ()=>{
        router.push('/login')
    }
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true)
        try {
            await axios.post('/api/auth/signup', formdata, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            handleRedirect()
        } catch (error:any) {
            console.log(error.response.data.message)
        }
        finally{
            setLoading(false)
        }
    }
    const handleChange = (e: any) => {
        const { id, value } = e.target
        setFormdata((prev) => ({ ...prev, [id]: value}))
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <Card className="w-[400px]">
                <CardHeader className="space-y-1 flex justify-center items-center">
                    <a
                        href="/"
                        className="flex items-center gap-2 self-center font-medium"
                    >
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                            <Paintbrush className="h-6 w-6" />
                        </div>
                        BuilZee Inc.
                    </a>
                    <CardTitle className="text-2xl font-bold">
                        Create an account
                    </CardTitle>

                    {/* <ThemeToggle /> */}
                    <CardDescription className="flex justify">
                        Let's get started. Fill in the details below to create your account.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3">
                    <form onSubmit={handleSubmit}>
                        <Button variant="outline" className="w-full">
                            <svg
                                className="mr-2 h-4 w-4"
                                aria-hidden="true"
                                focusable="false"
                                data-prefix="fab"
                                data-icon="google"
                                role="img"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 488 512"
                            >
                                <path
                                    fill="currentColor"
                                    d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                                ></path>
                            </svg>
                            Sign up with Google
                        </Button>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                        </div>
                        <div className="">
                            <div className="grid gap-1">
                                <Label className="font-bold text-md">Name</Label>
                                <Input id="name" type="text" placeholder="John Doe" value={formdata.name} onChange={handleChange} required />
                            </div>
                            <div className="grid gap-1">
                                <Label className="font-bold text-md">username</Label>
                                <Input id="username" type="text" placeholder="johndoe123" value={formdata.username} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="grid gap-1">
                            <Label className="font-bold text-md">Email</Label>
                            <Input id="email" type="email" placeholder="m@example.com" value={formdata.email} onChange={handleChange} required />
                        </div>
                        <div className="grid gap-1">
                            <Label className="font-bold text-md">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={isView ? "text" : "password"}
                                    placeholder="********"
                                    value={formdata.password}
                                    onChange={handleChange}
                                    required
                                />
                                {isView ? (
                                    <Eye
                                        className="absolute right-4 top-1 z-10 cursor-pointer text-gray-500"
                                        onClick={() => {
                                            setIsView(!isView);
                                        }}
                                    />
                                ) : (
                                    <EyeOff
                                        className="absolute right-4 top-1 z-10 cursor-pointer text-gray-500"
                                        onClick={() => setIsView(!isView)}
                                    />
                                )}
                            </div>
                        </div>
                        {loading ? <Button type="submit" disabled={loading} className="w-full">Creating...</Button> : <Button className="w-full" type="submit" disabled={loading}>Create an Account</Button>}
                        <CardFooter className="flex flex-col">
                            <p className="mt-2 text-center text-sm text-muted-foreground">
                                Already have an account?{" "}
                                <Link
                                    href="/login"
                                    className="text-primary underline-offset-4 hover:underline"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}


// 'use client'
 
// import { useRouter } from 'next/navigation'
 
// export default function SignupCard() {
//   const router = useRouter()
 
//   return (
//     <button type="button" onClick={() => router.push('/dashboard')}>
//       Dashboard
//     </button>
//   )
// }