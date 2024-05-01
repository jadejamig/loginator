import { ExtendedUser } from "@/auth";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";


interface UserInfoProps {
    user?: ExtendedUser
    label: string
}

const CardRow = ({label, value} : {label: string, value: string | undefined | null}) => {
    return (
        <div className="flex flex-row items-center justify-between rounded-lg 
                                border p-3 shadow-sm">
                    <p className="text-sm font-medium">{label}</p>
                    <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-blue-100 rounded-md">
                        {value}
                    </p>  
        </div>
    )
}

export const UserInfo = ({ user, label}: UserInfoProps) => {
    return (
        <Card className="w-[600px] shadow-md">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">
                    {label}
                </p>
            </CardHeader>
            <CardContent className="space-y-4">
                <CardRow label="ID" value={user?.id}/>
                <CardRow label="Name" value={user?.name}/>
                <CardRow label="Email" value={user?.email}/>
                <CardRow label="Role" value={user?.role}/>
                <div className="flex flex-row items-center justify-between rounded-lg 
                                border p-3 shadow-sm">
                    <p className="text-sm font-medium">Two Factor Authentication</p>
                    <Badge variant={user?.isTwoFactorEnabled ? "success" : "destructive"}>
                        {user?.isTwoFactorEnabled ? "ON" : "OFF"}
                    </Badge> 
                </div>
            </CardContent>
        </Card>
    )
}
