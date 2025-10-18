const logger = require("./logger");

// Middleware que imprime informacion sobre cada peticion
const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method); // Mostramos el método de la petición
  logger.info("Path:  ", request.path); // Mostramos la ruta de la petición
  logger.info("Body:  ", request.body); // Mostramos el cuerpo de la petición
  logger.info("---"); // Mostramos una línea para separar las peticiones
  next(); // Pasamos al siguiente middleware
};

// Middleware para capturar solicitudes a endpoints o rutas desconocidas
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// Middleware para manejar errores
const errorHandler = (error, request, response, next) => {
  logger.error(error.message); // Mostramos el mensaje de error en la consola

  if (error.name === 'CastError') { // Si el error es un CastError (error de conversión de tipo)
    // Enviamos una respuesta al cliente con el código 400 (Bad Request) y un mensaje de error
    return response.status(400).send({ error: 'malformatted id' }); 
  } else if (error.name === 'ValidationError') { // Si el error es un ValidationError (error de validación)
    return response.status(400).json({ error: error.message });
  }

  next(error); // Pasamos el error al siguiente middleware
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
};