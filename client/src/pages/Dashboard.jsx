import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosConfig";
import socket from "../socket/socket";

function Dashboard() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await api.get('/api/user/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(response.data);
            } catch (err) {
                navigate('/login');
            }
        };
        fetchProfile();
        socket.on('matchFound', (data) => {
            navigate(`/battle/${data.roomId}`);
        });
        return ()=>{
            socket.off('matchFound');
        };
    }, []);
    function handleFindBattle() {
        socket.connect();
        socket.emit('joinQueue', { userId: user._id, rating: user.rating });
    }

    if (!user) return <div>Loading...</div>;

    return (
        <div>
            <h1>Welcome, {user.username}</h1>
            <p>Rating: {user.rating}</p>
            <p>Wins: {user.wins}</p>
            <p>Losses: {user.loss}</p>
            <button onClick={handleFindBattle}>Find Battle</button>
        </div>
    );
}

export default Dashboard;