import NewPasswordForm from '@/components/auth/NewPasswordForm'
import React, { Suspense } from 'react'

const NewPassword = () => {
  return (
    <Suspense>
        <NewPasswordForm />
    </Suspense>
  )
}

export default NewPassword