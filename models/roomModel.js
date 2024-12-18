class Room {
  constructor(name, moderator) {
    this.name = name;
    this.currentTask = "Task 1";
    this.moderator = moderator;
    this.players = [{ name: moderator, point: "?" }];
  }
}

const rooms = {};

module.exports = { Room, rooms };