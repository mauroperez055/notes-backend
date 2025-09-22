require('dotenv').config(); // Importamos las variables de entorno
const express = require('express'); // Importamos el módulo express
const Note = require('./models/note'); 

// Creamos una aplicación de express
const app = express(); 

// Creamos un array de notas 
let notes = [] 

// Middleware que imprime informacion sobre cada peticion
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method); // Mostramos el método de la petición
  console.log('Path:  ', request.path); // Mostramos la ruta de la petición
  console.log('Body:  ', request.body); // Mostramos el cuerpo de la petición
  console.log('---'); // Mostramos una línea para separar las peticiones
  next(); // Pasamos al siguiente middleware
}

// Usamos el middleware requestLogger
app.use(requestLogger); 

// Middleware para servir archivos estáticos desde la carpeta 'dist'
app.use(express.static('dist')); 

// Middleware para parsear el cuerpo de las peticiones como JSON, toma los datos json de una solicitud, los transforma en objetos de JavaScript y los agrega a la propiedad body del objeto request
app.use(express.json()); 

// Definimos una ruta para la raíz del servidor y enviamos una respuesta al cliente
app.get('/', (request, response) => { 
  response.send('<h1>Backend de app de notas funcionando</h1>'); 
})

// Endpoint para obtener todas las notas
app.get('/api/notes', (request, response) => { 
  Note.find({}).then(notes => {
    response.json(notes); 
  })
})

// Obtener una nota individual con el metodo findById de mongoose
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(note => {
    response.json(note);
  })
})

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
})

// Endpoint para eliminar una nota por su id
app.delete('/api/notes/:id', (request, response) => { 
  const id = Number(request.params.id); // Obtenemos el id de la nota de los parámetros de la ruta
  notes = notes.filter(note => note.id !== id); // Filtramos las notas para eliminar la nota con el id correspondiente

  response.status(204).end(); // 204: No Content
})


// Middleware para capturar solicitudes a endpoints o rutas desconocidas
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
}

// Usamos el middleware unknownEndpoint
app.use(unknownEndpoint); 

const PORT = process.env.PORT;

// Ponemos el servidor a escuchar en el puerto definido por la variable de entorno
app.listen(PORT, () => { 
  console.log(`Server running on port ${PORT}`); 
}); 