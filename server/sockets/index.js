const Question = require('../models/Question');
const User=require('../models/User');
const getRandomQuestion = async () => {
    const questions = await Question.aggregate([{ $sample: { size: 10 } }]);
    return questions;
}

let waitingQueue = [];
const battleScores = {};
const setupSocket = (io) => {
    io.on('connection', (socket) => {
        socket.on('joinQueue', async (userData) => {
            const { userId, rating } = userData;
            waitingQueue.push({ socket, userId, rating });
            if (waitingQueue.length >= 2) {
                const player1 = waitingQueue.shift();
                const player2 = waitingQueue.shift();
                const roomId = `${player1.userId}-${player2.userId}`;
                player1.socket.join(roomId);
                player2.socket.join(roomId);
                io.to(roomId).emit('matchFound', { roomId, player1Id: player1.userId, player2Id: player2.userId });
                const questions = await getRandomQuestion();
                io.to(roomId).emit('startBattle', { questions, timeLimit: 60 });

            }
        });
        socket.on('disconnect', () => {
            waitingQueue = waitingQueue.filter(player => player.socket.id !== socket.id);
        });
        socket.on('submitAnswer', async (data) => {
            const { questionId, answer, timeTaken } = data;
            if (!questionId || !answer || timeTaken < 0) {
                return socket.emit('error', { message: 'Invalid data' });
            }
            const question = await Question.findById(questionId);
            const isCorrect = question.answer === answer;
            socket.emit('answerResult', { questionId, isCorrect, timeTaken });

        });
        socket.on('battleEnd', async (data) => {
            const { roomId, userId, score } = data;
            if (!battleScores[roomId]) {
                battleScores[roomId] = {};
            }
            battleScores[roomId][userId] = score;
            if (Object.keys(battleScores[roomId]).length === 2) {
                const playerIds = Object.keys(battleScores[roomId]);
                const player1Id = playerIds[0];
                const player2Id = playerIds[1];
                const player1Score = battleScores[roomId][player1Id];
                const player2Score = battleScores[roomId][player2Id];
                let winnerId = null;
                let losserId = null;
                if (player1Score > player2Score) {
                    winnerId = player1Id;
                    losserId = player2Id;
                }
                else if (player2Score > player1Score) {
                    winnerId = player2Id;
                    losserId = player1Id;
                }
                await User.findByIdAndUpdate(winnerId, { $inc: { wins: 1 } });
                await User.findByIdAndUpdate(losserId, { $inc: { loss: 1 } });
                delete battleScores[roomId];
                io.to(roomId).emit('battleResult', { winnerId });
            }
        });
    });
};

module.exports = setupSocket;