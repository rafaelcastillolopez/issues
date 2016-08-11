// Connect to MongoDB using Mongoose
var mongoose = require('mongoose');
//mongoose.set('debug', true);
var db = mongoose.createConnection('localhost', 'incidencias');

// Get Caso schema and model
var CasoSchema = require('../models/Caso.js').CasoSchema;
var Caso = db.model('caso', CasoSchema);

// Main application view
exports.index = function(req, res) {
	res.render('index');
};

exports.partial = function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
};

// JSON API for list of casos
exports.listacasos = function(req, res) {
	var count=req.query.count;
	var query=req.query.query;
  var limit=req.query.limit || 15;
	var page=req.query.page || 1;
	var conditions=[];
  if (query)
		conditions.push({$text: { $search: query }});
  var find;
  if (conditions.length>0)
    find=Caso.find({$and: conditions});
  else
    find=Caso.find();
	if (count)
  	{
  		find.count().exec(function(error, c) {
			res.json({count:c});
		});
  	}
  	else
  	{
  		find.sort({'id': -1})
			.skip((page - 1) * limit)
			.limit(limit)
			.exec(function(error, casos) {
				res.json(casos);
			});
	}
};

// JSON API for getting a single caso
exports.caso = function(req, res) {
	// Poll ID comes in the URL
	var casoId = req.params.id;

	// Find the caso by its ID, use lean as we won't be changing it
	Caso.findById(casoId, '', { lean: true }, function(err, caso) {
		if(caso) {
			res.json(caso);
		} else {
			res.json({error:true});
		}
	});
};

merge = function (a, b) {
    var c=[];

    for(var i = 0; i < a.length; i++) {
        c.push(a[i]);
    }
    for(var i = 0; i < b.length; i++) {
      var found=false;
      for(var j = 0; j < c.length && !found; j++) {
        if (c[j]._id.toString() == b[i]._id.toString())
          found=true;
      }
      if (!found)
        c.push(b[i]);
    }

    return c.sort(function(a,b) { return a.fecha > b.fecha ? 1 : -1 } );
}

exports.savecaso = function(req, res) {
	var caso = new Caso(req.body);

  Caso.findById(caso._id, '', { lean: true }, function(err, casobd) {
    if(casobd) {
      caso.id=casobd.id;
      caso.fecha=casobd.fecha;
      /*if (!caso.borrarAnotaciones)
      {
        var a = caso.anotacionesCaso;
        var b = casobd.anotacionesCaso;
        caso.anotacionesCaso=merge(a,b);
      }*/

      var upsertData = caso.toObject();
    	// Delete the _id property, otherwise Mongo will return a "Mod on _id not allowed" error
    	delete upsertData._id;
      delete upsertData.borrarAnotaciones;
    	Caso.update({_id: caso._id}, upsertData, {upsert: true}, function(err,doc) {
    		if(err || !doc) {
    			throw 'Error';
    		} else {
    			res.json(doc);
    		}
    	});
    } else {
      res.json({error:true});
    }
  });
};

// JSON API for creating a new caso
exports.nuevocaso = function(req, res) {
	var caso = new Caso(req.body);
	if (!caso.id)
	{
		Caso.find().sort({'fecha': -1})
			.limit(1)
			.exec(function(error, casos) {
				var ultimocaso=casos[0];
				var anno=ultimocaso.id.split("/")[0];
				var id=ultimocaso.id.split("/")[1];
				caso.id=anno+"/"+(parseInt(id)+1);

				// Save caso to DB
				caso.save(function(err, doc) {
					if(err || !doc) {
						throw 'Error';
					} else {
						res.json(doc);
					}
				});
			});
	}
	else
	{
		// Save caso to DB
		caso.save(function(err, doc) {
			if(err || !doc) {
				throw 'Error';
			} else {
				res.json(doc);
			}
		});
	}
};
