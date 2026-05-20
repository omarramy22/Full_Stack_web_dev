const login = ({ handleLogin, newUser, setNewUser }) => {
    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    username:{' '}
                    <input
                        data-testid="username"
                        value={newUser.username}
                        onChange={(event) =>
                            setNewUser({
                                ...newUser,
                                username: event.target.value
                            })
                        }
                    />
                </div>
                <div>
                    password:{' '}
                    <input
                        data-testid="password"
                        type="password"
                        value={newUser.password}
                        onChange={(event) =>
                            setNewUser({
                                ...newUser,
                                password: event.target.value
                            })
                        }
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );  
}

export default login