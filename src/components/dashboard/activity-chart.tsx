// src/components/dashboard/activity-chart.tsx
"use client"

import {
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts'

const data = [
    { name: 'Jan', users: 400, sales: 240, load: 67 },
    { name: 'Feb', users: 520, sales: 380, load: 72 },
    { name: 'Mar', users: 470, sales: 350, load: 60 },
    { name: 'Apr', users: 610, sales: 430, load: 65 },
    { name: 'May', users: 590, sales: 510, load: 58 },
    { name: 'Jun', users: 800, sales: 620, load: 82 },
    { name: 'Jul', users: 900, sales: 780, load: 78 },
]

export default function ActivityChart() {
    return (
        <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 10,
                        left: 10,
                        bottom: 5,
                    }}
                >
                    <defs>
                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="name"
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            borderColor: 'hsl(var(--border))',
                            borderRadius: '8px',
                            fontSize: '12px',
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="users"
                        stroke="#2563eb"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorUsers)"
                    />
                    <Area
                        type="monotone"
                        dataKey="sales"
                        stroke="#10b981"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorSales)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}