
angular.module('exModule', []);
angular.module('exModule')
	.service('authService', ['$http', '$location', function($http){
		
		this.authCheck = function(cb){
			$http.get('/api/me')
				.then( function(returnData){
					cb(returnData.data)

				})
		}
					
						
	}])

angular.module('exModule');
angular.module('exModule').controller('mainController', ['$scope', '$sce','$http', 'authService', function($scope, $sce, $http, authService){

console.log('AUTH', authService)
		
		authService.authCheck(function(user){
			console.log('USER!', user)
			$scope.user = user
		})



$scope.createchat = false;
$scope.storyshow = false;
$scope.color = "#000000"
$scope.actors = []
$scope.relations = [];
$scope.displayArray=[];
$scope.guardianDisplayArray=[];
$scope.relationshipValues = [
.2, .2, .1, .9, .9, .1, .2, .8, 1, .3, //Saudi
1, 1, .2, .8, .8, .3, .9, .2, .2, //Russia
1, .2, .1, 1, .8, .1, .7, 1,  //US
.1, .2, .1, .1, .1, .1, .2,  // Turkey
1, 1, .1, 1, .7, .1,  // Iran
.2, .1, .1, .1, .1,  // Al Nusra
.3, .1, .1, 1, // Syrian Kurds
.3, .3, .1,  //Iraqi Kurds
.1, .1,  //ISIL
1 //Syria
]
//function to allocate color
$scope.colorSelect = function(input){
	if (0 <= input <= .1){
		return '#6600FF'
	}
	else if (.1<input<=.2){
		return '#FF3300'
	}
	else if(.2<input<=.3){
		return '#FF9933'
	}
	else if(.3<input<=.4){
		return '#FFCC66'
	}
	else if(.4<input <=.5){
		return '#FFD6CC'
	}
	else if(.5< input<=.6){
		return'#D6F5D6'
	}	
	else if(.6 < input <=.7){
		return '#ADEBAD'
	}
	else if(.7< input <=.8){
		return'#FFFF99'
	}
	else if(.8< input <=.9){
		return '#CCFF66'
	}

	else if (.9< input <=1){
		return'#33CC33'
	}}

//Object for single actors
var SingleActor = function(header, UNqueryTerm, guardianQueryTerm){
	this.header=header;
	this.UNqueryTerm=UNqueryTerm;
	this.guardianQueryTerm=guardianQueryTerm
	this.horizontalcallout = false;
	this.verticalcallout2 = false;
	this.verticalcallout = false;
	this.horizontalcallout2 = false;
}
// Object for Relationship
var Relation = function (country1, country1UNQueryTerm, country1GuardianQueryTerm, country2, country2UNQueryTerm,  country2GuardianQueryTerm, score){
	this.country1=country1;
	this.country1UNQueryTerm = country1UNQueryTerm;
	this.country1GuardianQueryTerm=country1GuardianQueryTerm
	this.country2= country2;
	this.country2UNQueryTerm = country2UNQueryTerm;
	this.country2GuardianQueryTerm=country2GuardianQueryTerm
	this.score = score;
	this.color = '#CCCCCC';
	this.border= false;
	this.xtitlecallout=false;
	this.ytitlecallout = false;
}
// All Actors and Query Terms Below. 
// $scope.actors.push(new SingleActor('Iraqi Government','?query[value]=iraq%20iraqi[fields][]=title&query[operator]=OR'))
$scope.actors.push(new SingleActor('Iraqi Government','iraq','((iraq%20OR%20iraqi)%20AND%20government)'))
// $scope.actors.push(new SingleActor('Syrian Government','?query[value]=syria%20assad&query[fields][]=title&query[operator]=OR'))
$scope.actors.push(new SingleActor('Syrian Government','syria','(syria%20OR%20syrian%20OR%20assad)'))

$scope.actors.push(new SingleActor('ISIL','isis','(isis%20OR%20isil%20OR%20(islamic%20state))'))
$scope.actors.push(new SingleActor('Iraqi Kurdistan','iraq%20kurds','(kurdistan%20OR%20(iraq%20AND%20kurds))'))
$scope.actors.push(new SingleActor('Syrian Kurds / YPG','syrian%20kurds', '(ypg)'))
$scope.actors.push(new SingleActor('Al Nusra Front','nusra','(nusra)'))
$scope.actors.push(new SingleActor('Iran and Aligned Militias','iran','(iran%20OR%20irgc%20OR%20quds%20OR%20hezbollah)'))
$scope.actors.push(new SingleActor('Turkey','turkey', '(turkey)'))
$scope.actors.push(new SingleActor('United States','united%20states','(america)'))
$scope.actors.push(new SingleActor('Russia','russia','(russia)'))
$scope.actors.push(new SingleActor('Saudi Arabia / Arab Coalition','saudi','(saudi%20OR(arab%20coalition))'))

$scope.populate = function(){
	for(i=($scope.actors.length-1); i >0 ; i--){// populates relationship actors and query terms for Reliefweb API
		for (j = 0; j < i; j++){
				$scope.relations.push(new Relation($scope.actors[i].header, $scope.actors[i].UNqueryTerm, $scope.actors[i].guardianQueryTerm, $scope.actors[j].header, $scope.actors[j].UNqueryTerm, $scope.actors[j].guardianQueryTerm, 0))
		}
	}
	for(i = 0; i<$scope.relations.length; i++){ // Populates realtionship score and color values
		$scope.relations[i].score = $scope.relationshipValues[i];
		$scope.relations[i].color = $scope.colorSelect($scope.relations[i].score)
	}
	
}

$scope.populate() //populates Relationship Array.  
console.log($scope.relations)
console.log($scope.actors)
// Function that calls API for UN Reports
$scope.currentCountries = []
$scope.click = function(x){
	$scope.displayArray=[];
	$scope.guardianDisplayArray=[];
	$scope.storyshow = true;
		$scope.currentCountries = []
		$scope.currentCountries.push($scope.relations[x].country1)
		$scope.currentCountries.push($scope.relations[x].country2)
		$http.get('http://api.rwlabs.org/v1/reports?query[value]='+$scope.relations[x].country1UNQueryTerm+'%20'+$scope.relations[x].country2UNQueryTerm+'&query[fields][]=title&query[operator]=AND?query[value]=syria%20iraq%20war&query[fields][]=body&query[operator]=AND&sort[]=date:desc').then(function(response){
			for (var i=0; i<response.data.data.length; i++){
				$scope.displayArray.push(response.data.data[i])
			}	  	
		}, function(error){
		console.log(error)
		});

		$http.get('http://content.guardianapis.com/search?q=(('+$scope.relations[x].country2GuardianQueryTerm+'%20AND%20'+$scope.relations[x].country2GuardianQueryTerm+')%20AND%20((syria%20OR%20iraq)%20AND%20(war%20OR%20conflict)))&section=world&from-date=2014-01-01&api-key=e55xbt922tpbefw9tgyvbjtc').then(function(response){
			console.log($scope.relations[x].country1GuardianQueryTerm)

// +'%20OR%20'+$scope.relations[x].country2GuardianQueryTerm+')%20AND%20((syria%20OR%20iraq)%20AND%20(war%20OR%20conflict)))

			for (var i=0; i<response.data.response.results.length; i++){
				$scope.guardianDisplayArray.push(response.data.response.results[i])
			}	  	
		}, function(error){
		console.log(error)
		});
}


// ANIMATIONS AND GRAPHICAL EXPERIENCE d


$scope.closeButton = function(){
	$scope.storyshow = false;
	$scope.bodyshow = false;
	$scope.relationshipOptionsShow = false;
	console.log("close")
}

$scope.storyBack = function(){
	$scope.storyshow = true;
	$scope.bodyshow = false;
}
$scope.storyClose = function(){
	$scope.storyshow = false;
	$scope.bodyshow = false;
}

$scope.storystring ='';
$scope.bodyshow = false;
//necessary for Angular to Accept HTML 
$scope.to_trusted = function(html_code) {
    return $sce.trustAsHtml(html_code);
}
//function to pull HTML for UN Report from database
$scope.loadStory= function($index){
	$scope.storyshow = false;
	$scope.bodyshow = true;
	$http.get($scope.displayArray[$index].href).then(function(response){
		$scope.storystring = response.data.data[0].fields.body
	})
}


$scope.mouseOver = function(color){
	for (i=0; i<$scope.relations.length;i++){
		if(color != $scope.relations[i].color){
			$scope.relations[i].border=true;
		}
	}
}
$scope.mouseLeave = function(){
	for (i=0; i<$scope.relations.length;i++){
		$scope.relations[i].border=false;
	}
	for (i=0; i<$scope.actors.length;i++){
		$scope.actors[i].horizontalcallout=false;
		$scope.actors[i].verticalcallout=false;
		$scope.actors[i].horizontalcallout2=false;
		$scope.actors[i].verticalcallout2=false;
	}
}
$scope.relationshipMouseOver= function(relationship){
	for (i=0; i<$scope.relations.length;i++){
		if(relationship != i){
			$scope.relations[i].border=true;
		}
	}
	for(i=0;i<$scope.actors.length;i++){
		if($scope.relations[relationship].country1 === $scope.actors[i].header){
			$scope.actors[i].verticalcallout = true;
		}
		if($scope.relations[relationship].country2 === $scope.actors[i].header){
			$scope.actors[i].horizontalcallout = true;
		}
	}
}

$scope.titleMouseOver=function(country){

for (i=0; i<$scope.relations.length;i++){
		$scope.relations[i].border = false;
		if((country != $scope.relations[i].country1)&&(country!=$scope.relations[i].country2)){
			$scope.relations[i].border=true;
		}
	}
}
$scope.submitForm = function(){

			$http.post('/charts/', $scope.test) //Req TO SERVER
				.then(function(returnData){ //Res FROM SERVER
					console.log('Recieved...! ', returnData)
				})

		}

//  USER BUILD 
$scope.userColorKeys = {'color1' : 'Set Key',
						'color2': 'Set Key',
						'color3': 'Set Key',
						'color4':'Set Key',
						'color5':'Set Key',
						'color6':'Set Key',}
$scope.userActorArray=[]
$scope.userRelations = []
$scope.userHolderArray = []
$scope.userActor = ""
$scope.userActorQuery = ""
$scope.xTitleArray=[]
$scope.relationshipOptionsShow = false;
$scope.makeYourOwn = function(){
	$scope.createchart = true;}

$scope.NextEntity = function(){
	$scope.userActorArray.push(new SingleActor($scope.userActor, $scope.userActorQuery, $scope.userActorQuery))
	console.log($scope.userActorArray)
	$scope.userActor = ""
$scope.userActorQuery = ""
// $scope.Finished()
if ($scope.userActorArray.length>1){
	$scope.Finished()
}
}

$scope.Finished = function(){
	if($scope.userActor){
	$scope.userActorArray.push(new SingleActor($scope.userActor, $scope.userActorQuery, $scope.userActorQuery))
	}
	$scope.userHolderArray = []
	$scope.userRelations = []
	$scope.xTitleArray=[]
	$scope.userPopulate = function(){
	for(i=($scope.userActorArray.length-1); i >0 ; i--){// populates relationship actors and query terms for Reliefweb API
		for (j = 0; j < i; j++){
				console.log('Relationship for '+$scope.userActorArray[i].header+' and '+  $scope.userActorArray[j].header)
				$scope.userRelations.push(new Relation($scope.userActorArray[i].header, $scope.userActorArray[i].UNqueryTerm, $scope.userActorArray[i].guardianQueryTerm, $scope.userActorArray[j].header, $scope.userActorArray[j].UNqueryTerm, $scope.userActorArray[j].guardianQueryTerm, 0))
		}
	}

	// for(i = 0; i<$scope.relations.length; i++){ // Populates realtionship score and color values
	// 	$scope.relations[i].score = $scope.relationshipValues[i];
	// 	$scope.relations[i].color = $scope.colorSelect($scope.relations[i].score)
	// }

	}
	$scope.userPopulate()
	console.log('Relations: ', $scope.userRelations)

//
for(i = 1; i<($scope.userActorArray.length);i++){
	console.log("for loop 1")
	$scope.placeHolder = []
	$scope.placeHolder2 = []
		for(j = 1; j<=i; j++){
			console.log("for loop 2")
				$scope.placeHolder.push($scope.userRelations.pop())}
			var x = $scope.placeHolder.length;
			for(k=0; k<x; k++){
				console.log("for loop 3")
				$scope.placeHolder2.push($scope.placeHolder.pop())
			}
	
	
	$scope.userHolderArray.push($scope.placeHolder2)
}
$scope.placeHolder = []
console.log($scope.userHolderArray)
var x = $scope.userHolderArray.length


for(i = 0; i<x	;i++){
	console.log(i)
	$scope.placeHolder.push($scope.userHolderArray.pop())
	console.log($scope.userHolderArray)
	console.log('-=-=-=-=-=-=-=-=-')
}


$scope.userHolderArray = $scope.placeHolder

console.log($scope.userHolderArray)

for (i=0;i<$scope.userHolderArray[0].length; i++){
	$scope.xTitleArray.push($scope.userHolderArray[0][i].country2)
}
console.log($scope.xTitleArray)
}

//=-=-=-=-=-=-  Redone Functions =-=-=-=-=-=
//WORKS
$scope.userLoadStory= function($index){
	$scope.storyshow = false;
	$scope.bodyshow = true;
	$http.get($scope.userHolder[yindex][xindex].href).then(function(response){
		$scope.storystring = response.data.data[0].fields.body
	})
}


$scope.userMouseOver = function(color){
	for (i=0; i<$scope.relations.length;i++){
		if(color != $scope.relations[i].color){
			$scope.relations[i].border=true;
		}
	}
}

//works
$scope.userMouseLeave = function(){
	console.log('mouse leave')
	for (i=0; i<$scope.userHolderArray .length;i++){
		for(j=0; j<$scope.userHolderArray[i].length; j++){
			$scope.userHolderArray[i][j].border=false;
		}
	}
	for (i=0; i<$scope.userHolderArray.length;i++){
		for(j=0; j<$scope.userHolderArray[i].length;j++){
			$scope.userHolderArray[i][j].xtitlecallout = false;
			$scope.userHolderArray[i][j].ytitlecallout = false;
			}
	}
}

//works
$scope.userRelationshipMouseOver= function(yindex, xindex){
	for (i=0; i<$scope.userHolderArray.length;i++){
		for(j=0; j<$scope.userHolderArray[i].length; j++){
			if($scope.userHolderArray[i][j] != $scope.userHolderArray[yindex][xindex]){
			$scope.userHolderArray[i][j].border=true;
			}
		}	
	}
	$scope.userHolderArray[0][xindex].xtitlecallout = true;
	$scope.userHolderArray[yindex][0].ytitlecallout = true;
}


//WORKS
$scope.userTitleMouseOver=function(country){
for (i=0; i<$scope.userHolderArray.length;i++){
	for(j=0; j<$scope.userHolderArray[i].length;j++){
			$scope.userHolderArray[i][j].border = false;
			if((country != $scope.userHolderArray[i][j].country1)&&(country!=$scope.userHolderArray[i][j].country2)){
			$scope.userHolderArray[i][j].border=true;
			}
		}	
		
	}

}

$scope.progressCounter = 0;
$scope.nextStep = function(){
	$scope.progressCounter++
}
$scope.backStep = function(){
	$scope.progressCounter--
}
$scope.reset = function(){
	$scope.userActorArray=[]
$scope.userRelations = []
$scope.userHolderArray = []
$scope.userActor = ""
$scope.userActorQuery = ""
$scope.xTitleArray=[]

}

$scope.userSave = function(){
	$scope.chartObject = {
		'UserName':$scope.user.username,
		'Data':$scope.userHolderArray,
		'TitleArray': $scope.xTitleArray,
		'Actors':$scope.userActorArray,
		'Description': $scope.userDescription,
		'ChartName': $scope.userChartName,
		'ImageURL': $scope.userImageURL,
		'ColorKeys': $scope.userColorKeys
	}
	console.log('Chart Object: '+$scope.chartObject)
	$scope.progressCounter++
	$http.post('/chart/', $scope.chartObject) //Req TO SERVER
		.then(function(returnData){ //Res FROM SERVER
			console.log('Made a chart! ', returnData)
	})

}


//works
$scope.userColorSelect = function(color){
	console.log("color function ran")
	console.log(color)
	$scope.userHolderArray[$scope.yplaceholder][$scope.xplaceholder].color = color;
	console.log($scope.userHolderArray[yplaceholder][xplaceholder].color)
}
//WORKS
$scope.xplaceholder = 0;
$scope.yplaceholder = 0;

$scope.userClick = function(yindex, xindex){
if(!$scope.save && ($scope.progressCounter == 1)){
$scope.relationshipOptionsShow = true;
$scope.currentCountries = []
$scope.xplaceholder = xindex;
$scope.yplaceholder = yindex;
		$scope.currentCountries.push($scope.userHolderArray[yindex][xindex].country1)
		console.log($scope.currentCountries)
		$scope.currentCountries.push($scope.userHolderArray[yindex][xindex].country2)
}
else{

	$scope.displayArray=[];
	$scope.guardianDisplayArray=[];
	$scope.storyshow = true;
	$scope.currentCountries = []
		console.log("variables defined, function executing")
		console.log("x index: "+xindex+ " y index: "+ yindex)
		console.log($scope.userHolderArray[yindex][xindex].country1)
		$scope.currentCountries.push($scope.userHolderArray[yindex][xindex].country1)
		console.log($scope.currentCountries)
		$scope.currentCountries.push($scope.userHolderArray[yindex][xindex].country2)
		$http.get('http://api.rwlabs.org/v1/reports?query[value]='+$scope.userHolderArray[yindex][xindex].country1UNQueryTerm+'%20'+$scope.userHolderArray[yindex][xindex].country2UNQueryTerm+'&query[fields][]=title&query[operator]=AND&sort[]=date:desc').then(function(response){
			for (var i=0; i<response.data.data.length; i++){
				$scope.displayArray.push(response.data.data[i])
			}	  	
		}, function(error){
		console.log(error)
		});

		$http.get('http://content.guardianapis.com/search?q=(('+$scope.userHolderArray[yindex][xindex].country1GuardianQueryTerm+'%20AND%20'+$scope.userHolderArray[yindex][xindex].country2GuardianQueryTerm+'))&section=world&from-date=2014-01-01&api-key=e55xbt922tpbefw9tgyvbjtc').then(function(response){
// +'%20OR%20'+$scope.relations[x].country2GuardianQueryTerm+')%20AND%20((syria%20OR%20iraq)%20AND%20(war%20OR%20conflict)))

			for (var i=0; i<response.data.response.results.length; i++){
				$scope.guardianDisplayArray.push(response.data.response.results[i])
			}	  	
		}, function(error){
		console.log(error)
		});
}
}
console.log(window.location.pathname.split('/')[2])
	if(window.location.pathname.split('/')[2]){
		var username = window.location.pathname.split('/')[2] 
		var chartname = window.location.pathname.split('/')[3] 
			$http.get('/chart/' + username+'/'+chartname)
		.then(function(returnData){
			console.log('return data: ', returnData)
				$scope.chart = returnData.data
				console.log($scope.chart)
				$scope.userHolderArray = $scope.chart.Data
				$scope.xTitleArray = $scope.chart.TitleArray
				$scope.userActorArray = $scope.chart.Actors
				$scope.userDescription = $scope.chart.Description
				$scope.userChartName = $scope.chart.ChartName
				$scope.userImageURL = $scope.chart.ImageURL
				$scope.userColorKeys = $scope.chart.ColorKeys

			})
	}


}])

















