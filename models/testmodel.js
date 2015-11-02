var mongoose = require('mongoose');

// Define our Schema for the DB
var ChartSchema = mongoose.Schema({

	UserName			: {type : String},
	Data			: {type: Array},
	TitleArray : {type: Array},
	Actors : {type: Array},
	Description: {type: String},
	ChartName: {type: String},
	ImageURL: {type: String},
	ColorKeys:{type: Object},
});

// Being modelling the collection
module.exports = mongoose.model('ChartModel', ChartSchema);


