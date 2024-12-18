const { Router } = require('express');
const roomController = require('../controllers/roomController');

const router = Router();

router.get('/room', roomController.getRoom.bind(roomController));
router.post('/create-room', roomController.createRoom.bind(roomController));
router.post('/remove-player', roomController.removePlayer.bind(roomController));
router.post('/reset-votes', roomController.resetVotes.bind(roomController));
router.post('/sendvote', roomController.sendVote.bind(roomController));
router.post('/join-room', roomController.joinRoom.bind(roomController));

module.exports = router;