const mongoose = require('mongoose'); // Importamos el módulo mongoose

// Configuramos Mongoose para que no use consultas estrictas
mongoose.set('strictQuery', false); 

const url = process.env.MONGODB_URI;

console.log('connecting to', url);

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB');
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message);
  })

// Definimos el esquema de la colección de notas
const noteSchema = new mongoose.Schema({ 
  content: { // Definimos el campo content con validaciones
    type: String, 
    minLength: 5,
    required: true // El campo es obligatorio
  },
  important: Boolean,
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