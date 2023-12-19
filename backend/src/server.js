// Importa el archivo 'configEnv.js' para cargar las variables de entorno
const { PORT, HOST } = require("./config/configEnv.js");
// Importa el módulo 'cors' para agregar los cors
const cors = require("cors");
// Importa el módulo 'express' para crear la aplicacion web
const express = require("express");
const app = express();
// Importamos morgan para ver las peticiones que se hacen al servidor
const morgan = require("morgan");
// Importa el módulo 'cookie-parser' para manejar las cookies
const cookieParser = require("cookie-parser");

// Importa el módulo 'body-parser' para manejar los datos en formato JSON
const bodyParser = require('body-parser');

const dotenv = require('dotenv');
const path = require('path');
// Load environment variables from the .env file
dotenv.config({ path: path.resolve(__dirname, '../../frontend/.env') });

/** El enrutador principal */
const indexRoutes = require("./routes/index.routes.js");
const userRoutes = require('./routes/user.routes.js');
const deudaRoutes = require('./routes/deuda.routes.js');
const notificaRoutes = require('./routes/notifica.routes.js');
// Importa el archivo 'configDB.js' para crear la conexión a la base de datos
const { setupDB } = require("./config/configDB.js");
// Importa el handler de errores
const { handleFatalError, handleError } = require("./utils/errorHandler.js");
const { createRoles, createUsers } = require("./config/initialSetup");

app.use(express.json());

/**
 * Inicia el servidor web
 */
async function setupServer() {
  try {
    const corsOptions = {
      origin: [`http://localhost:443`, '/'],
      credentials: true, // Permite el intercambio de credenciales
    };
    require("./utils/Thread.js")
    /** Instancia de la aplicacion */
    const server = express();
    // Agrega el middleware para el manejo de datos en formato JSON
    server.use(express.json());
    // Agregamos los cors
    server.use(cors(corsOptions));
    // Agregamos el middleware para el manejo de cookies
    server.use(cookieParser());
    // Agregamos morgan para ver las peticiones que se hacen al servidor
    server.use(morgan("dev"));
    // Agrega el middleware para el manejo de datos en formato URL
    server.use(express.urlencoded({ extended: true }));
    //para usar el body-parser
    server.use(bodyParser.urlencoded({ extended: true }));
    // Agrega el enrutador principal al servidor
    server.use("/api", indexRoutes);
    
    app.use('/user', userRoutes);
    app.use('/deuda', deudaRoutes);
    app.use('/notifica', notificaRoutes);
    
    /*const PORT = process.env.PORT || 3000;
    
    app.listen(PORT, () => {
      console.log(`Servidor en ejecución en el puerto ${PORT}`);
    });*/

    // Inicia el servidor en el puerto especificado
    server.listen(PORT, () => {
    console.log(`=> Servidor corriendo en ${HOST}:${PORT}/api`);

    require('./utils/Thread.js');
    });
  } catch (err) {
    handleError(err, "/server.js -> setupServer");
  }
}

// Si la peticion es "/generar-excel" llama a exportarRoutes
//app.use("/generar-excel", exportarRoutes);


/**
 * Inicia la API
 */
async function setupAPI() {
  try {
    // Inicia la conexión a la base de datos
    await setupDB();
    // Inicia el servidor web
    await setupServer();
    // Inicia la creación de los roles
    await createRoles();
    // Inicia la creación del usuario admin y user
    await createUsers();
  } catch (err) {
    handleFatalError(err, "/server.js -> setupAPI");
  }
}

// Inicia la API
setupAPI()
  .then(() => console.log("=> API Iniciada exitosamente"))
  .catch((err) => handleFatalError(err, "/server.js -> setupAPI"));

console.log("=> termina de iniciar la api");
