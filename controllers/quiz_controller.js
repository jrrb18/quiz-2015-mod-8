var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizID
exports.load = function(req, res, next, quizId) {
	models.Quiz.findById(quizId).then(
		function(quiz) {
			if (quiz) {
				req.quiz = quiz;
				next();
			} else { next(new Error('No existe quizId= ' + quizId)); }	
		}
	).catch(function(error) { next(error);});
};

// GET /quizes
exports.index = function(req, res) {
	var options = {};
   
	models.Quiz.findAll(options).then(
  	function(quizes) {
    	if (req.query.search !== undefined) {
        	
        	req.query.search = req.query.search.replace(/^| |$/g,'%');
        	
        	models.Quiz.findAll({where: [ "lower(pregunta) like ?", req.query.search.toLowerCase()], order: [["pregunta"]]}).then(
         		function(quizes){
                  	res.render('quizes/index.ejs', {quizes: quizes, errors: []});
          		});
     	}else {
        	res.render('quizes/index.ejs', {quizes: quizes, errors: []});         
      	}
    }
    ).catch(function(error) { next(error)});
 
};

// GET /quizes/:id
exports.show = function(req, res) {
	res.render('quizes/show', { quiz: req.quiz, errors: []});
};

// GET  /quizes/:id/answer
exports.answer = function(req, res) {
	var resultado = 'Incorrecto';
	if (req.query.respuesta.toLowerCase() === req.quiz.respuesta.toLowerCase()) {
			resultado = 'Correcto';
	}
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
};

// GET /quizes/new
exports.new = function(req, res) {
	// crea objecto quiz
	var quiz = models.Quiz.build({pregunta: "Pregunta", respuesta: "Respuesta", tema: "otro"});

	res.render('quizes/new', {quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build(req.body.quiz);

	quiz.validate().then(
		function(err) {
			if (err) {
				res.render('quizes/new', {quiz: quiz, errors: err.errors});
			} else {
				// guarda en DB los campos pregunta y respuesta de quiz
				quiz.save({fields: ["pregunta", "respuesta", "tema"]}).then(function() {
					// Redirección HTTP (URL relativo) lista de preguntas
					res.redirect('/quizes');
				})
			}

		} // function err

	); // then	
};

// GET /quizes/:id/edit
exports.edit = function(req, res) {
	// autoload de instancia de quiz
	var quiz = req.quiz;

	res.render('quizes/edit', {quiz: quiz, errors: []});
};

// PUT /quizes/:id
exports.update = function(req, res) {
	req.quiz.pregunta  = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema      = req.body.quiz.tema;

	req.quiz.validate().then(
		function(err) {
			if (err) {
				res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
			} else {
				// guarda en DB los campos pregunta y respuesta de quiz
				req.quiz.save({fields: ["pregunta", "respuesta", "tema"]}).then(function() {
					// Redirección HTTP (URL relativo) lista de preguntas
					res.redirect('/quizes');
				})
			}

		} // function err

	); // then	

};

// DELETE /quizes/:id
exports.destroy = function(req, res) {
	req.quiz.destroy().then(function() {
		res.redirect('/quizes');
	}).catch(function(error){next(error)});
};

