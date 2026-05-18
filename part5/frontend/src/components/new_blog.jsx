const New_blog = ({ handleSubmit, newBlog, setNewBlog }) => {
    return (
        <form onSubmit={handleSubmit}>
            <div>
                title:{' '}
                <input
                    value={newBlog.title}
                    onChange={(event) =>
                        setNewBlog({
                            ...newBlog,
                            title: event.target.value
                        })
                    }
                />
            </div>
            <div>
                url:{' '}
                <input
                    value={newBlog.url}
                    onChange={(event) =>
                        setNewBlog({
                            ...newBlog,
                            url: event.target.value
                        })
                    }
                />
            </div>
            <button type="submit">Create</button>
        </form>
    );
}

export default New_blog