const { Router } = require('express');
const roomController = require('../controllers/roomController');

const router = Router();

router.get('/room', roomController.getRoom);
router.post('/create-room', roomController.createRoom.bind(this.roomController));
router.post('/remove-player', roomController.removePlayer);
router.post('/reset-votes', roomController.resetVotes);
router.post('/sendvote', roomController.sendVote);
router.post('/join-room', roomController.joinRoom);

module.exports = router;