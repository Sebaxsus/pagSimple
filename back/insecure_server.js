//Importando las denpendencias
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
//verbose() permite un debug detallado es decir nos muestra mas informacion cuando
//sale un error

//Inicializando express
const app = express();

//definiendo el puerto a escuchar
const port = 3000;

//Definiendo usar cors en la app de express para aceptar peticiones de dominios diferentes
app.use(cors());

//Definiendole a express usar el JSON body parser middleware
//Para poder manejar las peticiones JSON en POST o PUT
//Nos permite acceder el JSON payload pedido AKA acceder a los datos enviados 
app.use(express.json());

//Inicializando la Base de datos de sqlite
const db = new sqlite3.Database(':memory:');

/* Para volver vulnerable mi base de datos las consultas deben ser un string
Concatenado con la entrada del usuario sin parametizar*/

//ejemplo de Query vulnerable

//const insecureQuery = `SELECT * FROM users WHERE usuario = '${usuario}' AND contraseña = '${contraseña}'`;

/*Con la estructura anterior Si se usa el 'OR 1=1 -- en alguno de los campos de entrada
Volvera la query en esto SELECT * FROM users WHERE usuario = '' OR 1=1 -- AND contraseña = '';
*/

//db.serialize se encarga de ejecutar los comandos en secuencia
db.serialize(() => {
    //Creando la tabla usuarios
    db.run('CREATE TABLE users (usuario TEXT, contraseña TEXT)', (error) => {
        //Si salio un error
        if (error) {

            console.error('Error Creano la Tabla: ', error.message);
        } else {
        //Si no hay error
        console.log('Tabla Usuarios creada!');

        //Agregando un Usuario default Para probar la conectividad
        db.run('INSERT INTO users (usuario, contraseña) VALUES (?, ?)', ['admin', 'admin'], (error) => {
            //Si hay error
            if (error) {
                //Mostrando el Error
                console.error('Error almacenando el Usuario:', error.message);
            } else {
                //Si no hay error
                //Confirmando en consola la accion
                console.log('Usuario Admin Almacenado!')

                //Verificando lo que hay guardado en la base de datos debug
                db.all('SELECT * FROM users', (error, rows) => {
                    //si hay error
                    if (error) {

                        console.error('Error Selecionando los datos de la tabla 0.o', error.message)
                    }
                    //Si no hay error
                    //Mostrando en consola para debuggear
                    console.log('Usuarios: \n');
                    console.log(rows)

                });
            }

        });

        }

    });

});

// Endpoint para manejar el login Con vulnerabilidad
app.post('/vulnerable-login', (request, response) =>{
    const { usuario, contraseña } = request.body;
    //Query que permite ejecutar codigo de sql
    const insecureQuery = `SELECT * FROM users WHERE usuario = '${usuario}' AND contraseña = '${contraseña}'`;

    //Limpiando La consola
    console.clear();

    //Debug de lo que traigo de el front
    console.log('Body de la peticion:');
    console.log(request.body);

    console.log('\nUsuario: ' + usuario + '\nContraseña: ' + contraseña);

    //Query a la base de datos
    db.get(insecureQuery, (error, row) => {
        //Si hay error responda con un codigo de estado 500 error
        if (error) {
            return response.status(500).json({ message: 'Error consultando la base de datos! :,(' });
        }
        //Si encuentra almenos una fila(row) responda con un json con atributo message:
        if (row) {
            response.json({ message: 'Login Exitoso!' });
        } else {
            response.json({ message: 'Usuario o Contraseña Incorrectos >:|' });
        }
    });

});

// Endpoint para manejar el login sin vulnerabilidades
app.post('/secure-login', (request, response) => {
    const { usuario, contraseña } = request.body;

    console.clear();
    //Query con parametros para prevenir sql injection
    const parameterizedQuery = 'SELECT * FROM users WHERE usuario = ? AND contraseña = ?';

    db.get(parameterizedQuery, [usuario, contraseña], (error, row) => {
        if (error) {
            return response.status(500).json({ message: 'Error Consultando la base de datos!'});
        }

        if (row) {
            response.json({ message: 'Login Exitoso!'});
        } else {
            response.json({ message: 'Usuario o Contraseña Incorrectos >:|'});
        }
    });
});

//Diciendole a express(app) que escuche el puerto port(3000)
app.listen(port, () => {
    console.log(`Servidor En Ejecucion en http://localhost:${port}`);
});

/*
Para evitar la sql injection se usa parametizacion que es basicamente trabajar con
Variables para evitar que se cierre el string de manera externa, al usar ? los 
motores de base de datos reemplazan ese simbolo con valores de manera segura,
Al manejar los datos de entrada como variables el motor de base de datos
Interpreta estas entradas como strings lo que previene que el motor crea que son
Comandos 
*/