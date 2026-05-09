const Filter = ({ searchTerm, setSearchTerm }) => {
  return (
    <div>
      search:{' '}
      <input
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />
    </div>
  )
}

export default Filter