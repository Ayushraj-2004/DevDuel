import { useState } from "react";
import api from "./../utils/axiosConfig";
import { useNavigate } from 'react-router-dom';
function Register() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate=useNavigate();
    async function handleRegister(e) {
        e.preventDefault();
        try {
            const response = await api.post('/api/auth/register', { username, email, password });
            console.log(response.data);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.user._id);
            navigate('/dashboard');
        }
        catch (err) {
            console.log(err);
        }
    }
    return (
        <form onSubmit={handleRegister}>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
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
            <button type="submit">Register</button>
        </form>
    )
}
export default Register;
