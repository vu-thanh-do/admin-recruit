// src/components/dashboard/recent-users.tsx
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

type User = {
    id: string
    name: string
    email: string
    role: string
    lastActive: string
    initials: string
}

const users: User[] = [
    {
        id: '1',
        name: 'Alex Morgan',
        email: 'alex@example.com',
        role: 'Admin',
        lastActive: '2 minutes ago',
        initials: 'AM',
    },
    {
        id: '2',
        name: 'Sara Chen',
        email: 'sara@example.com',
        role: 'Editor',
        lastActive: '1 hour ago',
        initials: 'SC',
    },
    {
        id: '3',
        name: 'David Kim',
        email: 'david@example.com',
        role: 'User',
        lastActive: '3 hours ago',
        initials: 'DK',
    },
    {
        id: '4',
        name: 'Mia Johnson',
        email: 'mia@example.com',
        role: 'User',
        lastActive: '1 day ago',
        initials: 'MJ',
    },
    {
        id: '5',
        name: 'Ryan Patel',
        email: 'ryan@example.com',
        role: 'Editor',
        lastActive: '2 days ago',
        initials: 'RP',
    },
]

export default function RecentUsers() {
    return (
        <div className="space-y-4">
            {users.map((user) => (
                <div key={user.id} className="flex items-center gap-4">
                    <Avatar>
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                            {user.initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{user.name}</p>
                            <span className="text-xs text-muted-foreground">{user.lastActive}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{user.role}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}