"use client";

import { UserInfo } from "@/components/UserInfo";
import { useSession } from "next-auth/react";

const ServerPage = () => {
    const session = useSession();
    return (
        <UserInfo label=" Server component" user={session.data?.user}/>
    )
}

export default ServerPage