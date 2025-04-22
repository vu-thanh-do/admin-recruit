// src/app/(dashboard)/page.tsx
import { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import StatsCard from '@/components/dashboard/stats-card'
import RecentUsers from '@/components/dashboard/recent-users'
import ActivityChart from '@/components/dashboard/activity-chart'
import { Users, ShoppingCart, Server, Activity } from 'lucide-react'

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="reports">Reports</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <StatsCard
                            title="Total Users"
                            value="12,345"
                            description="+12% from last month"
                            icon={<Users className="w-5 h-5" />}
                            trend="up"
                        />
                        <StatsCard
                            title="Revenue"
                            value="$45,231"
                            description="+5.2% from last month"
                            icon={<ShoppingCart className="w-5 h-5" />}
                            trend="up"
                        />
                        <StatsCard
                            title="Active Sessions"
                            value="623"
                            description="+18% from last hour"
                            icon={<Activity className="w-5 h-5" />}
                            trend="up"
                        />
                        <StatsCard
                            title="Server Load"
                            value="42%"
                            description="-8% from average"
                            icon={<Server className="w-5 h-5" />}
                            trend="down"
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="lg:col-span-4">
                            <CardHeader>
                                <CardTitle>Activity Overview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Suspense fallback={<div>Loading chart...</div>}>
                                    <ActivityChart />
                                </Suspense>
                            </CardContent>
                        </Card>

                        <Card className="lg:col-span-3">
                            <CardHeader>
                                <CardTitle>Recent Users</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Suspense fallback={<div>Loading users...</div>}>
                                    <RecentUsers />
                                </Suspense>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}