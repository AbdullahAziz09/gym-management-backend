// packageModel.js

const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  packageName: { type: String, required: true },
  packageAmount: { type: Number, required: true },
});

module.exports = mongoose.model('Package', packageSchema);
