// src/components/dashboard/stats-card.tsx
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
    title: string
    value: string
    description: string
    icon: React.ReactNode
    trend?: 'up' | 'down' | 'neutral'
}

export default function StatsCard({
    title,
    value,
    description,
    icon,
    trend = 'neutral',
}: StatsCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                <div className="h-8 w-8 rounded-full bg-primary/10 p-1.5 text-primary">
                    {icon}
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <div className="mt-1 flex items-center text-xs">
                    {trend === 'up' && (
                        <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                    )}
                    {trend === 'down' && (
                        <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                    )}
                    <span
                        className={cn(
                            "font-medium",
                            trend === 'up' && "text-green-500",
                            trend === 'down' && "text-red-500"
                        )}
                    >
                        {description}
                    </span>
                </div>
            </CardContent>
        </Card>
    )
}