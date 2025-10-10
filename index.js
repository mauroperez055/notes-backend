const app = require('./app'); // Importamos la aplicación de express
const config = require("./utils/config"); 
const logger = require("./utils/logger"); 

//cambio para ver si funciona n8n

// Ponemos el servidor a escuchar en el puerto definido por la variable de entorno
app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`); // Usamos el logger para mostrar el mensaje en la consola
});
