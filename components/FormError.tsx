import { FaExclamationTriangle } from "react-icons/fa"

interface FormErrorProps {
    message?: string
}

export const ErrorForm = ({ message }: FormErrorProps) => {
    if (!message)
        return null

        return (
            <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
                <FaExclamationTriangle className="h-4 w-4"/>
                {message}
            </div>
        )
}