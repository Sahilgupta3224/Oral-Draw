"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { User, Mail, Calendar, Save, Camera, FolderOpen } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSession } from "next-auth/react"
import DashboardHeader from '@/components/dashboard/dashboardHeader'

interface UserData {
    name: string
    username: string
    email: string
    image?: string
    provider?: string
    projectsCount: number
    memberSince?: string
}

export default function ProfilePage() {
    const { data: session } = useSession()
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(true)
    const [userData, setUserData] = useState<UserData>({
        name: session?.user?.name || "John Doe",
        username: "johndoe123",
        email: session?.user?.email || "john@example.com",
        image: session?.user?.image || "/placeholder.svg?height=120&width=120",
        provider: "google",
        projectsCount: 0,
        memberSince: "January 2024",
    })

    useEffect(() => {
        const userId = session?.user?.id ?? ""

        if (!userId) return

        const fetchUser = async () => {
            try {
                const res = await fetch(`/api/userByID?id=${userId}`)
                if (!res.ok) throw new Error("Failed to fetch user data")

                const user = await res.json()

                setUserData({
                    name: user.name ?? userData.name,
                    username: user.username ?? userData.username,
                    email: user.email ?? userData.email,
                    image: user.image ?? userData.image,
                    provider: user.provider ?? userData.provider,
                    projectsCount: user.projects ? user.projects.length : 0,
                    memberSince: user.createdAt
                        ? new Date(user.createdAt).toLocaleString("default", { month: "long", year: "numeric" })
                        : userData.memberSince,
                })
            } catch (error) {
                console.error("Error fetching user data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchUser()
    }, [session])

    const stats = [
        {
            label: "Projects",
            value: userData.projectsCount.toString(),
            icon: FolderOpen,
            color: "from-green-500 to-green-600",
        },
        {
            label: "Member Since",
            value: userData.memberSince || "",
            icon: Calendar,
            color: "from-orange-500 to-orange-600",
        },
    ]

    const handleSave = () => {
        console.log("Saving user data:", userData)
        setIsEditing(false)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg text-slate-600 dark:text-slate-300">Loading profile...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <DashboardHeader />

            <motion.div
                className="relative z-10 container mx-auto px-4 py-8 max-w-4xl mt-0" // added mt-20 to shift content below navbar
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                {/* Header */}
                <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <Card className="relative overflow-hidden border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10" />
                        <CardContent className="relative p-8">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <motion.div
                                    className="relative group"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
                                        <AvatarImage src={userData.image || "/placeholder.svg"} alt={userData.name} />
                                        <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                            {userData.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <motion.div
                                        className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        <Camera className="w-8 h-8 text-white" />
                                    </motion.div>
                                </motion.div>

                                <div className="flex-1 text-center md:text-left">
                                    <motion.h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2">
                                        {userData.name}
                                    </motion.h1>
                                    <p className="text-lg text-slate-600 dark:text-slate-300 mb-4">@{userData.username}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Profile Info */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Profile Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {isEditing ? (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input
                                                id="name"
                                                value={userData.name}
                                                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="username">Username</Label>
                                            <Input
                                                id="username"
                                                value={userData.username}
                                                onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={userData.email}
                                            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={handleSave}
                                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Changes
                                        </Button>
                                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                                            Cancel
                                        </Button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                                            <User className="w-5 h-5 text-blue-600" />
                                            <div>
                                                <div className="font-medium">{userData.name}</div>
                                                <div className="text-sm text-slate-600 dark:text-slate-300">Full Name</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                                            <User className="w-5 h-5 text-purple-600" />
                                            <div>
                                                <div className="font-medium">@{userData.username}</div>
                                                <div className="text-sm text-slate-600 dark:text-slate-300">Username</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                                        <Mail className="w-5 h-5 text-green-600" />
                                        <div>
                                            <div className="font-medium">{userData.email}</div>
                                            <div className="text-sm text-slate-600 dark:text-slate-300">Email Address</div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Stats Section */}
                <motion.div
                    className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    {stats.map(({ label, value, icon: Icon, color }) => (
                        <Card
                            key={label}
                            className={`overflow-hidden border-0 shadow-lg bg-gradient-to-br ${color} text-white`}
                        >
                            <CardContent className="flex items-center gap-4">
                                <div className="p-3 bg-white/20 rounded-md">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-3xl font-bold leading-none">{value}</p>
                                    <p className="uppercase tracking-wider text-sm">{label}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </motion.div>
            </motion.div>
        </div>
    )
}
