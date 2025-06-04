"use client"
import NotificationsList from '@/components/notificationsList'
import DashboardHeader from '@/components/dashboard/dashboardHeader'
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


export default function NotificationsPage() {
    const { isAuthenticated } = useAuth();
    const router = useRouter()
    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, router]);
    return (
        <div className="flex flex-col max-h-screen">
            <DashboardHeader />
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold mb-6">Notifications</h1>
                <NotificationsList />
            </div>
        </div>
    )
}

