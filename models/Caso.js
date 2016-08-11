var mongoose = require('mongoose')

exports.CasoSchema = new mongoose.Schema({
  id:  String,
  fecha: { type: Date, default: Date.now },
  usuario:   String,
  tipo:   String,
  descripcion:   String
}, { collection : 'caso' });
