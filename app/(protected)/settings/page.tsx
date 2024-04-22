import { auth, signOut } from '@/auth'
import React from 'react'

const SettingsPage = async () => {

  async function handleSignOut(data: FormData) {
    "use server";

    await signOut({
      redirectTo: "/auth/login"
    });

  }

  const session = await auth();

  return (
    <div>
      SettingsPage
      {JSON.stringify(session)}
      <form action={handleSignOut}>
        <button type='submit'>
          Sign out
        </button>
      </form>
    </div>
  )
}

export default SettingsPage