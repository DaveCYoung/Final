// Include our Model
var ChartModel = require('../models/testmodel')
// Define our Route Handlers

// Create a NEW Hero
// var testFunction = function(req, res){
// 	// Data from a POST request lives in req.body
// 	console.log('Controller Function Executed')
// 	var newTest = new TestModel({
// 		field1			: req.body.field1,
// 		field2			: req.body.field2
// 	})
// 	console.log('this is...', newTest)

// console.log('Response sent')
// 	res.send('Response is good.')
	
// 	newTest.save( function(err, doc){
// 		res.send(doc)
// 	} )

// }

var chartSave = function(req, res){
	// Data from a POST request lives in req.body
	console.log('Controller Function Executed')
	console.log(req.body)
	var newChart  = new ChartModel({
		UserName			: req.body.UserName,
		Data: req.body.Data,
		TitleArray: req.body.TitleArray,
		Actors: req.body.Actors,
		Description: req.body.Description,
		ChartName: req.body.ChartName,
		ImageURL: req.body.ImageURL,
		ColorKeys: req.body.ColorKeys
	})
	// console.log('this is...', newChart)

// console.log('Response sent')
// 	res.send('Response is good.')
	
	newChart.save( function(err, doc){
		res.send(doc)
	} )

}


var findChart = function(req, res) {
	// console.log('before')
	// var myFile = fs.readFileSync('WarAndPeace')
	// console.log('after')

	// console.log('before')
	// fs.readFile('WarAndPeace', function(err, data){
	// 	console.log('Inside Callback!')
	// 	// CODE THAT RELIES ON WAR AND PEACE
	// })
	// console.log('after')
	// // SUPER IMPORTANT CODE THAT CAN EXECUTE BECAUSE ITS NOT HELD UP BY READFILE


	// var heroes = []
	console.log('REQ PARAMs', req.params)
	if (req.params.username){
		ChartModel.findOne({ChartName: req.params.chartname, UserName: req.params.username}, function(err, doc){
			console.log(doc)
			console.log(err)
			res.send(doc)
		})
	}
}

	// $scope.chartObect = {
	// 	'UserName':$scope.user,
	// 	'Data':$scope.userHolderArray,
	// 	'TitleArray': $scope.xTitleArray,
	// 	'Actors':$scope.userActorArray,
	// 	'Description': $scope.userDescription,
	// 	'ChartName': $scope.userChartName,
	// 	'ImageURL': $scope.userImageURL,
	// }


// var findHeroes = function(req, res) {
// 	// console.log('before')
// 	// var myFile = fs.readFileSync('WarAndPeace')
// 	// console.log('after')

// 	// console.log('before')
// 	// fs.readFile('WarAndPeace', function(err, data){
// 	// 	console.log('Inside Callback!')
// 	// 	// CODE THAT RELIES ON WAR AND PEACE
// 	// })
// 	// console.log('after')
// 	// // SUPER IMPORTANT CODE THAT CAN EXECUTE BECAUSE ITS NOT HELD UP BY READFILE


// 	// var heroes = []
// 	console.log('REQ PARAMs', req.params)
// 	if (req.params.heroName){
// 		Hero.findOne({name : req.params.heroName}, function(err, doc){
// 			res.send(doc)
// 		})
// 	}
// 	else{

// 		Hero.find({}, function(err, docs){
// 			res.send(docs)
// 			// heroes = docs
// 		})
// 	}
// 	// res.send(heroes)
// }

module.exports = {
	chartSave: chartSave,
	findChart: findChart,
}