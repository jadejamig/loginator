import { auth } from "@/auth"
import { UserInfo } from "@/components/UserInfo";

const ServerPage = async () => {
    const session = await auth();
    return (
        <UserInfo label=" Server component" user={session?.user}/>
    )
}

export default ServerPage