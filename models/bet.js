const mongoose = require('mongoose');

const betSchema = new mongoose.Schema({
  "round_id" : String,
    userId : {
    type: String,
    required: true
  },
  betType  : {
    type: String,
    required: true
  },
  betAmount : {
    type: [Number],
    required: true,
  },
  selectedNumber :Number,
},{timestamps: true});

const bet = mongoose.model('bet', betSchema);

module.exports = bet;