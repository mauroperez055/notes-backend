const mongoose = require('mongoose');

// Definimos el esquema de la colección de notas
const noteSchema = new mongoose.Schema({ 
  content: { // Definimos el campo content con validaciones
    type: String, 
    minLength: 5,
    required: true // El campo es obligatorio
  },
  important: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

// Modificamos el método toJSON del esquema para transformar la salida al convertir a JSON
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema);