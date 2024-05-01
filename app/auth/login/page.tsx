import LoginForm from "@/components/auth/LoginForm"
import { Suspense } from "react"

const LoginPage = () => {
  return (
    <Suspense>
      <LoginForm/>
    </Suspense>
  )
}

export default LoginPage