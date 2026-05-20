import { useState } from 'react'
const New_blog = ({createBlog}) => {
    const [newBlog, setNewBlog] = useState({
        title: '',
        url: '',
        likes: 0
    })
    const handleSubmit = (event) => {
        event.preventDefault()
        createBlog({ ...newBlog })
        setNewBlog({
            title: '',
            url: '',
            likes: 0
        })
    }
    return (
        <form onSubmit={handleSubmit}>
            <div>
                title:{' '}
                <input
                    value={newBlog.title}
                    placeholder='write title here'
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
                    placeholder='write url here'
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