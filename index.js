require("dotenv").config(); // Importamos las variables de entorno
const express = require("express"); // Importamos el módulo express
const Note = require("./models/note");

// Creamos una aplicación de express
const app = express();


// ---------------------
// 1. MIDDLEWARES GENERALES
// ---------------------

//1- Middleware para servir archivos estáticos desde la carpeta 'dist'
app.use(express.static("dist"));

//2- Middleware para parsear el cuerpo de las peticiones como JSON, toma los datos json de una solicitud, los transforma en objetos de JavaScript y los agrega a la propiedad body del objeto request
app.use(express.json());

// Middleware que imprime informacion sobre cada peticion
const requestLogger = (request, response, next) => {
  console.log("Method:", request.method); // Mostramos el método de la petición
  console.log("Path:  ", request.path); // Mostramos la ruta de la petición
  console.log("Body:  ", request.body); // Mostramos el cuerpo de la petición
  console.log("---"); // Mostramos una línea para separar las peticiones
  next(); // Pasamos al siguiente middleware
};

//3- Usamos el middleware requestLogger
app.use(requestLogger);


// ---------------------
// 2. RUTAS
// ---------------------

// Definimos una ruta para la raíz del servidor y enviamos una respuesta al cliente
app.get("/", (request, response) => {
  response.send("<h1>Backend de app de notas funcionando</h1>");
});

// Endpoint para obtener todas las notas
app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

// Obtener una nota individual con el metodo findById de mongoose
app.get("/api/notes/:id", (request, response, next) => {
  Note.findById(request.params.id)
    .then((note) => {  
      if (note) { 
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error)); // Pasamos el error al siguiente middleware de manejo de errores
});

// Endpoint para crear una nueva nota
app.post("/api/notes", (request, response, next) => {
  const body = request.body; // Obtenemos el cuerpo de la petición

  /* if (body.content === undefined) {
    // Si el cuerpo no tiene contenido
    return response.status(400).json({
      // Enviamos una respuesta al cliente con el código 400 (Bad Request)
      error: "content missing", // Mensaje de error
    });
  } */

  const note = new Note({
    // Creamos un objeto nota
    content: body.content, // Asignamos el contenido de la nota
    important: body.important || false // Asignamos la importancia de la nota, si no se especifica, por defecto es false
  });

  note.save()
    .then((savedNote) => {
      response.json(savedNote);
  })
  .catch(error => next(error)); // Pasamos el error al siguiente middleware de manejo de errores
});

// Endpoint para eliminar una nota por su id
app.delete("/api/notes/:id", (request, response) => {
  Note.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end(); // Enviamos una respuesta al cliente con el código 204 (No Content)
    })
    .catch(error => next(error)); // Pasamos el error al siguiente middleware de manejo de errores
});

// Endpoint para actualizar una nota por su id
app.put('/api/notes/:id', (request, response, next) => {
  const { content, important } = request.body;

  // Creamos un objeto nota con el contenido y la importancia actualizados
  /* const note = {
    content: body.content,
    important: body.important
  } */

  //Actualizamos la nota y con new:true hacemos que la promesa devuelva la nota actualizada y no la nota antigua
  Note.findByIdAndUpdate(
    request.params.id,
    { content, important },
    { new: true, runValidators: true, context: 'query' } // Con runValidators: true hacemos que se apliquen las validaciones del esquema
  )
  .then(updatedNote => {
    response.json(updatedNote);
  })
  .catch(error => next(error)); // Pasamos el error al siguiente middleware de manejo de errores
})


// ---------------------
// 3. MIDDLEWARES DE CONTROL DE ERRORES
// ---------------------

// Middleware para capturar solicitudes a endpoints o rutas desconocidas
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// Usamos el middleware unknownEndpoint
app.use(unknownEndpoint);

// Middleware para manejar errores
const errorHandler = (error, request, response, next) => {
  console.error(error.message); // Mostramos el mensaje de error en la consola

  if (error.name === 'CastError') { // Si el error es un CastError (error de conversión de tipo)
    // Enviamos una respuesta al cliente con el código 400 (Bad Request) y un mensaje de error
    return response.statuts(400).send({ error: 'malformatted id' }); 
  } else if (error.name === 'ValidationError') { // Si el error es un ValidationError (error de validación)
    return response.status(400).json({ error: error.message });
  }

  next(error); // Pasamos el error al siguiente middleware
}

// Usamos el middleware errorHandler
app.use(errorHandler);


// ---------------------
// 4. INICIAR SERVIDOR
// ---------------------

const PORT = process.env.PORT;

// Ponemos el servidor a escuchar en el puerto definido por la variable de entorno
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
