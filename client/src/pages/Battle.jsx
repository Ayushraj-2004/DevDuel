import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import socket from '../socket/socket';

function Battle() {
    const { roomId } = useParams();
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    function handleAnswer(option) {
        socket.emit('submitAnswer', { questionId: current._id, userId: localStorage.getItem('userId'), roomId: roomId, timeTaken: 0, answer: option });
    }

    useEffect(() => {
        socket.on('startBattle', (data) => {
            setQuestions(data.questions);
        });

        socket.on('answerResult', (data) => {
            if (data.isCorrect) setScore(prev => prev + 1);
             setCurrentIndex(prev => {
                const newIndex = prev + 1;
                if (newIndex >= questions.length) {
                    socket.emit('battleEnd', {
                        roomId,
                        userId: localStorage.getItem('userId'),
                        score
                    });
                }
                return newIndex;
            });
        });

        return () => {
            socket.off('startBattle');
            socket.off('answerResult');
        };
    }, []);

    if (questions.length === 0) return <div>Waiting for battle to start...</div>;
    if (currentIndex >= questions.length) return <div>Battle Over! Score: {score}</div>;

    const current = questions[currentIndex];

    return (
        <div>
            <p>Score: {score}</p>
            <p>Question {currentIndex + 1} of {questions.length}</p>
            <h2>{current.question}</h2>
            {current.options.map((option, i) => (
                <button key={i} onClick={() => handleAnswer(option)}>
                    {option}
                </button>
            ))}
        </div>
    );
}

export default Battle;