var path = require('path');

// Postgres: DATABASE_URL = postgres://user:passwd@host:port/database 
// SQLite:   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6] ||null);
var user     = (url[2] ||null);
var pwd      = (url[3] ||null);
var protocol = (url[1] ||null);
var dialect  = (url[1] ||null);
var port     = (url[5] ||null);
var host     = (url[4] ||null);
var storage  = process.env.DATABASE_STORAGE


// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize  = new Sequelize(DB_name, user, pwd, 
		{   dialect:  protocol,
			protocol: protocol,
			port:     port,
			host:     host,
			storage:  storage, // solo SQLite (.env)
			omitNULL: true // solo Postgres 
		}
	);

// Importar la definicion de la tabbla  Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

// exportar definición de tabla Quiz
exports.Quiz = Quiz;

// sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function() {
	// then(..) ejecuta el manjeador una vez creada la tabla
	Quiz.count().then(function (count){
		if(count === 0) {
			// la tabla se inicializa solo si está vacía
			Quiz.create({//id: 1,
						 pregunta: '¿ cual es la capital de italia ?',
						 respuesta: 'Roma',
						 tema: 'otro'
			});
			Quiz.create({//id: 2,
						 pregunta: '¿ quien descubrio america ?',
						 respuesta: 'Colon',
						 tema: 'otro'
			});
			Quiz.create({//id: 3,
						 pregunta: '¿ cual es la Capital de portugal ?',
						 respuesta: 'Lisboa',
						 tema: 'otro'
			});
			Quiz.create({//id: 4,
						 pregunta: '¿ cual es la capital de colombia ?',
						 respuesta: 'Bogota',
						 tema: 'otro'
			})
			.then(function(){console.log('Base de datos inicializada')});
		};
	});
});