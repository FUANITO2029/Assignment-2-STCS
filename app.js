// import the packages to use
const inicioDebug = require('debug')('app:inicio');
const dbDebug = require('debug')('app:produccion');
const config = require('config');
const morgan = require('morgan');

const express = require('express');
const app = express();

// Imports the routes to use
const objStudents = require('./rutas/students');
const events = require('./rutas/events');
const record = require('./rutas/records');

app.use(express.json());
app.use(express.urlencoded({extended:true})); 

app.use('/api/students', objStudents.ruta);
app.use('/api/events', events.ruta);
app.use('/api/records', record);

app.get('/', (req, res) => {
    res.send('Hola mundo desde Express');
});

// Middleware Morgan, Debug y Cofig
console.log(`Aplication: ${config.get('name')}`);
console.log(`Description: ${config.get('description')}`)
console.log(`DB server: ${config.get('configDB.host')}`);

if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
    // Muestra el mensaje de depuración 
    inicioDebug('Morgan está habilitado'); 
}
dbDebug('Conectando al servicio...');


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}...`);
}); 





// SETX NODE_ENV " "  
//      development 
//      prodution

// SETX DEBUG " " 
//      app:inicio
//      app:produccion