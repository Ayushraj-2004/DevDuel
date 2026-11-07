import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Brand from '../components/Brand';
import socket from '../socket/socket';

const optionLabels = ['A', 'B', 'C', 'D'];

export default function Battle() {
  const { roomId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const scoreRef = useRef(0);
  const currentIndexRef = useRef(0);
  const questionsRef = useRef([]);

  useEffect(() => {
    function handleStart({ questions: battleQuestions }) {
      if (!Array.isArray(battleQuestions) || battleQuestions.length === 0) {
        setError('No questions were available for this battle. Please return to the dashboard.');
        return;
      }
      questionsRef.current = battleQuestions;
      setQuestions(battleQuestions);
      setError('');
    }

    function handleAnswerResult({ isCorrect }) {
      setSubmitting(false);
      if (isCorrect) {
        scoreRef.current += 1;
        setScore(scoreRef.current);
      }

      const nextIndex = currentIndexRef.current + 1;
      currentIndexRef.current = nextIndex;
      setCurrentIndex(nextIndex);

      if (nextIndex >= questionsRef.current.length) {
        setFinished(true);
        socket.emit('battleEnd', {
          roomId,
          userId: localStorage.getItem('userId'),
          score: scoreRef.current,
        });
      }
    }

    function handleBattleResult(battleResult) {
      setResult(battleResult);
    }

    function handleSocketError(socketError) {
      setSubmitting(false);
      setError(socketError.message || 'The battle could not process your answer.');
    }

    function handleConnectError() {
      setError('Could not connect to the battle server. Check your connection and try again.');
    }

    socket.on('startBattle', handleStart);
    socket.on('answerResult', handleAnswerResult);
    socket.on('battleResult', handleBattleResult);
    socket.on('error', handleSocketError);
    socket.on('connect_error', handleConnectError);

    return () => {
      socket.off('startBattle', handleStart);
      socket.off('answerResult', handleAnswerResult);
      socket.off('battleResult', handleBattleResult);
      socket.off('error', handleSocketError);
      socket.off('connect_error', handleConnectError);
    };
  }, [roomId]);

  function handleAnswer(option) {
    const currentQuestion = questions[currentIndex];
    if (!currentQuestion || submitting || finished) return;

    setError('');
    setSubmitting(true);
    socket.emit('submitAnswer', {
      questionId: currentQuestion._id,
      userId: localStorage.getItem('userId'),
      roomId,
      timeTaken: 0,
      answer: option,
    });
  }

  if (!questions.length) {
    return (
      <main className="battle-page">
        <header className="battle-top"><Brand /><span>DEVDUEL / ARENA</span></header>
        <section className="battle-content battle-state">
          <span className="kicker"><i /> MATCH FOUND</span>
          <h1>Preparing your duel…</h1>
          <p>Waiting for the battle questions to arrive.</p>
          {error && <p className="battle-error" role="alert">{error}</p>}
          <Link className="button" to="/dashboard">Return to dashboard</Link>
        </section>
      </main>
    );
  }

  if (finished) {
    const isWinner = result?.winnerId === localStorage.getItem('userId');
    const isDraw = result && !result.winnerId;
    return (
      <main className="battle-page">
        <header className="battle-top"><Brand /><span>DEVDUEL / RESULTS</span></header>
        <section className="battle-content battle-result">
          <span className="kicker">BATTLE COMPLETE</span>
          <h1>{result ? (isDraw ? 'It’s a draw.' : isWinner ? 'Victory.' : 'Good game.') : 'Answers locked in.'}</h1>
          <p>Your score: <strong>{score} / {questions.length}</strong></p>
          <p>{result ? 'Your battle result has been recorded.' : 'Waiting for your opponent to finish the duel.'}</p>
          {error && <p className="battle-error" role="alert">{error}</p>}
          <Link className="button" to="/dashboard">Back to dashboard <span aria-hidden="true">↗</span></Link>
        </section>
      </main>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <main className="battle-page">
      <header className="battle-top">
        <Brand />
        <span>DEVDUEL / ARENA · {roomId}</span>
      </header>
      <section className="battle-content battle-question">
        <div className="battle-progress">
          <span className="kicker"><i /> LIVE BATTLE</span>
          <span>QUESTION {currentIndex + 1} / {questions.length}</span>
          <span>SCORE {score}</span>
        </div>
        <h1>{currentQuestion.question}</h1>
        <div className="battle-options">
          {currentQuestion.options.map((option, index) => (
            <button key={`${currentQuestion._id}-${option}`} type="button" onClick={() => handleAnswer(option)} disabled={submitting}>
              <i>{optionLabels[index] || index + 1}</i>{option}
            </button>
          ))}
        </div>
        {error && <p className="battle-error" role="alert">{error}</p>}
        {submitting && <p className="battle-feedback" aria-live="polite">Locking in your answer…</p>}
      </section>
    </main>
  );
}
