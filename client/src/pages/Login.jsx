import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import api from "./../utils/axiosConfig";
function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    async function handleLogin(e) {
        e.preventDefault();
        try {
            const response = await api.post('/api/auth/login', { email, password });
            console.log(response.data);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.user._id);
            navigate('/dashboard');
        }
        catch (err) {
            console.error(err);
        }
    }
    return (
        <form onSubmit={handleLogin}>
            <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
        </form>
    )
}
export default Login;
