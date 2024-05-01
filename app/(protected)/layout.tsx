import { SessionProvider } from "next-auth/react"
import Navbar from "./_components/navbar"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (

      <SessionProvider>
        <section className="h-full w-full flex flex-col gap-y-10 items-center justify-center bg-blue-100">
            <Navbar/>
            {children}
        </section>
      </SessionProvider>
    )
  }