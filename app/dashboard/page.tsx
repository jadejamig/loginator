import Link from 'next/link'
import React from 'react'

const Dashboard = () => {
  return (
    <div>
        <h1>Welcome to Dashboard!</h1>
        <div className='flex content-between'>
            <Link href='../' className='text-blue-400'>{`<- Back`}</Link>
        </div>
    </div>
  )
}

export default Dashboard