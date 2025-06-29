import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { User } from 'lucide-react'
import { getInitials, formatDate } from '@/lib/utils'

const ProfileCard = ({ user }) => {
    return (
        <Card>
            <CardHeader className="text-center pb-4">
                <div className="flex flex-col items-center gap-4">
                    <Avatar className="size-20">
                        <AvatarFallback className="text-2xl font-bold">
                            {getInitials(user?.name || 'U')}
                        </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2 text-center">
                        <h3 className="text-xl font-bold text-foreground">
                            {user?.name || 'User'}
                        </h3>
                        <p className="text-sm text-muted-foreground break-all max-w-[200px]">
                            {user?.email || 'user@example.com'}
                        </p>
                        {user?.role && (
                            <Badge className="font-medium capitalize">
                                {user.role}
                            </Badge>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <Separator />
                <div className="space-y-4">
                    <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-muted-foreground">
                            Role
                        </span>
                        <span className="text-sm font-semibold text-foreground capitalize">
                            {user?.role || 'User'}
                        </span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-muted-foreground">
                            Member since
                        </span>
                        <span className="text-sm font-semibold text-foreground">
                            {formatDate(user?.createdAt || new Date())}
                        </span>
                    </div>
                    {user?.lastLogin && (
                        <div className="flex items-center justify-between py-2">
                            <span className="text-sm text-muted-foreground">
                                Last active
                            </span>
                            <span className="text-sm font-semibold text-foreground">
                                {formatDate(user.lastLogin)}
                            </span>
                        </div>
                    )}
                    {user?.uploadsCount !== undefined && (
                        <div className="flex items-center justify-between py-2">
                            <span className="text-sm text-muted-foreground">
                                Total uploads
                            </span>
                            <Badge
                                variant="secondary"
                                className="font-semibold"
                            >
                                {user && typeof user.uploadsCount === 'number'
                                    ? user.uploadsCount
                                    : 0}
                            </Badge>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default ProfileCard
