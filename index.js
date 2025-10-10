const app = require('./app'); // Importamos la aplicación de express
const config = require("./utils/config"); 
const logger = require("./utils/logger"); 

//nuevos cambios para ver el resultado finaldsadasdasdasdas

// Ponemos el servidor a escuchar en el puerto definido por la variable de entorno
app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`); // Usamos el logger para mostrar el mensaje en la consola
});
