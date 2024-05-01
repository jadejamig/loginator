import { NewVerificationForm } from "@/components/auth/NewVerificationForm"
import { Suspense } from "react"

const NewVerificationPage = () => {
    return (
        <Suspense>
            <NewVerificationForm/>
        </Suspense>
    )
}

export default NewVerificationPage