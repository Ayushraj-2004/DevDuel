let waitingQueue = [];
const setupSocket = (io) => {
    io.on('connection', (socket) => {
        socket.on('joinQueue', (userData) => {
            const { userId, rating } = userData;
            waitingQueue.push({ socket, userId, rating });
            if(waitingQueue.length>=2)
            {
                const player1=waitingQueue.shift();
                const player2=waitingQueue.shift();
                const roomId=`${player1.userId}-${player2.userId}`;
                player1.socket.join(roomId);
                player2.socket.join(roomId);
                io.to(roomId).emit('matchFound', { roomId,player1Id: player1.userId, player2Id: player2.userId});
            }
        });
        socket.on('disconnect',()=>{
            waitingQueue = waitingQueue.filter(player => player.socket.id !== socket.id);     
        });
    });
};

module.exports = setupSocket;