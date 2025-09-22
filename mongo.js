const mongoose = require('mongoose');

// Verificamos que se haya proporcionado la contraseña como argumento
if (process.argv.length < 3) { // Si no se proporciona la contraseña como argumento
  console.log('give password as argument'); // Mostramos un mensaje de error
  process.exit(1);  // Salimos del programa con un código de error
}

const password = process.argv[2]; // Obtenemos la contraseña de los argumentos

// URL de conexión a la base de datos MongoDB
const url = 
  `mongodb+srv://maurodb:${password}@cluster0.p4bfxiy.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false); // Configuramos Mongoose para que no use consultas estrictas

mongoose.connect(url); // Conectamos a la base de datos MongoDB

// Definimos el esquema de la colección de notas
const noteSchema = new mongoose.Schema({ 
  content: String,
  important: Boolean,
})

// Creamos el modelo de la colección de notas 
const Note = mongoose.model('Note', noteSchema);

// Creamos una nueva nota 
/* const note = new Note({
  content: 'MongoDB is fun',
  important: false,
}) */

Note.find({important: false}).then(result => { // Buscamos todas las notas en la base de datos
  result.forEach(note => { // Recorremos las notas encontradas
    console.log(note); // Mostramos cada nota en la consola
  })
  mongoose.connection.close(); // Cerramos la conexión a la base de datos
})

// Guardamos la nueva nota en la base de datos y cerramos la conexión
/* note.save().then(result => {
  console.log('note saved!');
  mongoose.connection.close(); 
})  */