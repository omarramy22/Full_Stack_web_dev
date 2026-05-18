const Notification = ({ message, isError }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={`${isError ? 'notification_error' : 'notification_success'}`}>
      {message}
    </div>
  )
}

export default Notification