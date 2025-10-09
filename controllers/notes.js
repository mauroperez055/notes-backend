const notesRouter = require("express").Router();
const Note = require("../models/note");

// Endpoint para obtener todas las notas
notesRouter.get("/", (request, response) => {
  Note.find({}).then((notes) => { 
    response.json(notes);
  })
})

// Obtener una nota individual con el metodo findById de mongoose
notesRouter.get("/:id", (request, response, next) => {
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
notesRouter.post("/", (request, response, next) => {
  const body = request.body; // Obtenemos el cuerpo de la petición

  const note = new Note({ // Creamos un objeto nota
    content: body.content, // Asignamos el contenido de la nota
    important: body.important || false // Asignamos la importancia de la nota, si no se especifica, por defecto es false
  });

  note
    .save()
    .then((savedNote) => {
      response.json(savedNote);
  })
  .catch(error => next(error)); // Pasamos el error al siguiente middleware de manejo de errores
});

// Endpoint para eliminar una nota por su id
notesRouter.delete("/:id", (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end(); // Enviamos una respuesta al cliente con el código 204 (No Content)
    })
    .catch(error => next(error)); // Pasamos el error al siguiente middleware de manejo de errores
});

// Endpoint para actualizar una nota por su id
notesRouter.put('/:id', (request, response, next) => {
  const { content, important } = request.body

  Note.findById(request.params.id)
    .then((note) => {
      if (!note) { // Si la nota no existe, respondemos con un 404
        return response.status(404).end()
      }

      note.content = content
      note.important = important

      return note.save().then((updatedNote) => { // Guardamos la nota actualizada
        response.json(updatedNote) // Respondemos con la nota actualizada en formato JSON
      })
    })
    .catch((error) => next(error))
})

module.exports = notesRouter;