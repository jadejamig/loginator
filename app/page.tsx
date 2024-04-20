import { LoginButton } from "@/components/auth/LoginButton";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center bg-blue-100">
      <div>
        <LoginButton>
          <Button variant='secondary' size='lg'>Sign in</Button>
        </LoginButton>
      </div>
    </main>
  ) 
}
