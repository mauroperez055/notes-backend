require('dotenv').config(); // Importamos las variables de entorno
const express = require('express'); // Importamos el módulo express
const cors = require('cors'); // Importamos el módulo cors
const Note = require('./models/note'); 

const app = express(); // Creamos una aplicación de express

app.use(cors()); // Usamos el middleware cors para permitir solicitudes desde cualquier origen

// json-parser middleware
app.use(express.json()); // Middleware para parsear el cuerpo de las peticiones como JSON, toma los datos json de una solicitud, los transforma en objetos de JavaScript y los agrega a la propiedad body del objeto request

app.use(express.static('dist')); // Middleware para servir archivos estáticos desde la carpeta 'dist'

// Middleware que imprime informacion sobre cada peticion
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method); // Mostramos el método de la petición
  console.log('Path:  ', request.path); // Mostramos la ruta de la petición
  console.log('Body:  ', request.body); // Mostramos el cuerpo de la petición
  console.log('---'); // Mostramos una línea para separar las peticiones
  next(); // Pasamos al siguiente middleware
}

app.use(requestLogger); // Usamos el middleware requestLogger

//const http = require('http'); // Importamos el módulo http

let notes = [ // Creamos un array de notas 
  {
    id: 1,
    content: 'HTML is easy',
    important: true
  },
  {
    id: 2,
    content: 'Browser can execute only JavaScript',
    important: false
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    important: true   
  }
]

/* const app = http.createServer((request, response) => { // Creamos el servidor 
  response.writeHead(200, { 'Content-Type': 'application/json' }); // Configuramos la cabecera de la respuesta 
  response.end(JSON.stringify(notes)); // Enviamos la respuesta al cliente 
}) */


app.get('/', (request, response) => { // Definimos una ruta para la raíz del servidor
  response.send('<h1>Backend de app de notas funcionando</h1>'); // Enviamos una respuesta al cliente
})

// Endpoint para obtener todas las notas
app.get('/api/notes', (request, response) => { // Definimos una ruta para /api/notes
  Note.find({}).then(notes => {
    response.json(notes); // Enviamos la respuesta al cliente en formato JSON 
  })
})

// Obtener una nota individual con el metodo findById de mongoose
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(note => {
    response.json(note);
  })
})

/* // Endpoint para obtener una nota por su id
app.get('/api/notes/:id', (request, response) => { // Definimos una ruta para /api/notes/:id
  const id = Number(request.params.id); // Obtenemos el id de la nota de los parámetros de la ruta
  const note = notes.find(note => note.id === id); // Buscamos la nota con el id correspondiente

  if (note) { // Si encontramos la nota 
    response.json(note); // Enviamos la respuesta al cliente en formato JSON
  } else {
    response.status(404).end(); // Si no encontramos la nota, enviamos un error 404
  }
}) */

// Endpoint para eliminar una nota por su id
app.delete('/api/notes/:id', (request, response) => { 
  const id = Number(request.params.id); // Obtenemos el id de la nota de los parámetros de la ruta
  notes = notes.filter(note => note.id !== id); // Filtramos las notas para eliminar la nota con el id correspondiente

  response.status(204).end(); // Enviamos una respuesta al cliente con el código 204 (No Content)
})

// Función para generar un id único para una nueva nota
/* const generateId = () => {
  const maxId = notes.length > 0 // notes.length es mayor que 0? 
    ? Math.max(...notes.map(n => n.id)) // notes.map(n => n.id) es un array, con ... lo convertimos en una lista de argumentos para Math.max, que devuelve el id máximo
    : 0; // Si no, el id máximo es 0
  return maxId + 1; // Devolvemos el id máximo + 1
} */

// Endpoint para crear una nueva nota
app.post('/api/notes', (request, response) => { 
  const body = request.body; // Obtenemos el cuerpo de la petición

  if (body.content === undefined) { // Si el cuerpo no tiene contenido
    return response.status(400).json({ // Enviamos una respuesta al cliente con el código 400 (Bad Request)
      error: 'content missing' // Mensaje de error
    });
  }

  const note = new Note ({ // Creamos un objeto nota
    content: body.content, // Asignamos el contenido de la nota
    important: body.important || false, // Asignamos la importancia de la nota, si no se especifica, por defecto es false
    /* id: generateId(), // Generamos un id único para la nota */
  })

  note.save().then(savedNote => {
    response.json(savedNote);
  })

  /* notes = notes.concat(note); // Agregamos la nueva nota al array de notas
  response.json(note); // Enviamos la respuesta al cliente en formato JSON */
})

// Middleware para capturar solicitudes a endpoints o rutas desconocidas
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' }); // Enviamos una respuesta al cliente con el código 404 (Not Found)
}

app.use(unknownEndpoint); // Usamos el middleware unknownEndpoint

const PORT = process.env.PORT;
app.listen(PORT, () => { 
  console.log(`Server running on port ${PORT}`); 
}); // Ponemos el servidor a escuchar en el puerto definido