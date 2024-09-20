//Importando las dependencias a usar 0.o
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

//Inicializando la Base de datos de Sqlite
const db = new sqlite3.Database(':memory:');

//db.serialize se encarga de ejecutar los comandos en secuencia
db.serialize(() => {
    //Creando la tabla usuarios
    db.run('CREATE TABLE users (username TEXT, password TEXT)', (error) => {
        
        if (error) {

            console.error('Error Creano la Tabla: ', error.message);
        } else {

        console.log('Tabla Usuarios creada!');

        //Agregando un Usuario default Para probar la conectividad
        db.run('INSERT INTO users (username, password) VALUES (?, ?)', ['admin', 'admin'], (error) => {
            
            if (error) {
                //Mostrando el Error
                console.error('Error almacenando el Usuario:', error.message);
            } else {
                //Confirmando en consola la accion
                console.log('Usuario Admin Almacenado!')

                //Verificando lo que hay guardado en la base de datos debug
                db.all('SELECT * FROM users', (error, rows) => {

                    if (error) {

                        console.error('Error Selecionando los datos de la tabla 0.o', error.message)
                    }
                    //Mostrando en consola para debuggear
                    console.log('Usuarios: \n' + rows)

                });
            }

        });

        }

    });

});

//Endpoint para manejar el Login
app.post('/login', (request, response) =>{ //Si hay error puede ser el nombre de las variable ya que pueden ser palabras reservadas
    const { username, password } = request.body;

    //Limpiando La consola
    console.clear();
    //Debug de lo que traigo de el front
    console.log(request.body)
    console.log('Body de la peticion:\n' + '\nUsuario: ' + username + '\nContraseña: ' + password);

    db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (error, row) => {
        if (error) {
            return response.status(500).json({ message: 'Error consultando la base de datos! :,(' });
        }

        if (row) {
            response.json({ message: 'Login Exitoso!' });
        } else {
            response.json({ message: 'Usuario o Contraseña Incorrectos >:|' });
        }
    });

});

app.listen(port, () => {
    console.log(`Servidor En Ejecucion en http://localhost:${port}`);
});

