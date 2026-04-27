import Authenticated from '@/Layouts/AuthenticatedLayout'
import React from 'react'

const Notifications = () => {
  return (
    <Authenticated header={<h2>Notifications</h2>}>
      <div>Hello , this is notifications, but you can still keep writing</div>
    </Authenticated>
  )
}

export default Notifications