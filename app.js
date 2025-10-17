const config = require("./utils/config");
const express = require("express");
require("express-async-errors");
const app = express();
const notesRouter = require("./controllers/notes");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");


logger.info('Connecting to', config.MONGODB_URI); 

// Conectamos a la base de datos MongoDB
mongoose
  .connect(config.MONGODB_URI) 
  .then(() => {
    logger.info("Connected to MongoDB");
  })
  .catch((error) => {
    logger.error("Error connecting to MongoDB:", error.message);
  })

  app.use(express.static("dist")); // Servimos archivos estáticos desde la carpeta 'dist'
  app.use(express.json()); // Parseamos el cuerpo de las peticiones como JSON
  app.use(middleware.requestLogger); // Usamos el middleware requestLogger

  app.use("/api/notes", notesRouter); // Usamos el router de notas para las rutas que comienzan con /api/notes

  app.use(middleware.unknownEndpoint); // Manejador de endpoint desconocido
  app.use(middleware.errorHandler); // Manejador de errores

  module.exports = app;