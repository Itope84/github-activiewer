window.chartColors = {
	red: 'rgb(255, 99, 132)',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(75, 192, 192)',
	blue: 'rgb(54, 162, 235)',
	purple: 'rgb(153, 102, 255)',
	grey: 'rgb(201, 203, 207)'
};

var commitLabels = [];
var commitStats = [];

var fullname = null;

// validate Repo Name
document.getElementById("action").addEventListener('input', function(){
	var action = this.value;
	var repoNameInput = document.getElementById('username');
	validateRepoName(repoNameInput, action);
	
});

document.getElementById("actionInline").addEventListener('input', function(){
	var action = this.value;
	var repoNameInput = document.getElementById('usernameInline');
	validateRepoName(repoNameInput, action);
	
});

var homepage = document.getElementById('homepage');
var resultWindow = document.getElementById('resultsWindow');
		
document.getElementById('submit').addEventListener('click', function(e){
	e.preventDefault();

	// show results page and hide main page
	var action = document.getElementById('action').value;
	var username = document.getElementById('username').value;
	homepage.classList.remove('d-flex');
	homepage.classList.add('d-none');
	resultWindow.style.display = 'inherit';

	// what should i do?
	loadResults(action, username);
});

document.getElementById('submitInline').addEventListener('click', function(e){
	e.preventDefault();

	// show results page and hide main page
	var action = document.getElementById('actionInline').value;
	var username = document.getElementById('usernameInline').value;
	
	//bring back the preloader
	document.getElementById('loaderBg').style.display = 'flex';

	// what should i do?
	loadResults(action, username);
});

document.getElementById('tryAgain').addEventListener('click', function(e){
	document.getElementById('loaderBg').style.display = 'none';
});

function loadResults(action, name) {
	switch(action){
		case '1':
			getAvatar('user', name);
			var url = "https://api.github.com/users/"+name+"/repos";
			ajaxRequest(url, getCommitActivity);
			break;
		case '2':
			getAvatar('repo', name);
			var url = "https://api.github.com/repos/"+name+"/stats/commit_activity";
			ajaxRequest(url, repoCallback);
			break;
		case '3':
			var url = "https://api.github.com/users/"+name;
	  		ajaxRequest(url, loadProfile);
			break;
	}
}



// there's a little problem here, gotta do form validation first... The repo name has to have the form username/reponame
function getAvatar(type, name){
	var url;
	switch(type){
		case 'user':
			fullname = name;
			url = "https://api.github.com/users/"+name;
			break;
		case 'repo':
			fullname = name;
			url = "https://api.github.com/repos/"+name;
			break;
		default:
			break;
	}

	var ajax = new XMLHttpRequest();
	ajax.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	    	var response = this.responseText;
	    	var response = JSON.parse(response);
	    	
	    	if (type=='user') {
	    		document.getElementById("avatar").src = response.avatar_url;
	    		document.getElementById("name").innerHTML = response.name;
	    	}
	    	else{
	    		document.getElementById("avatar").src = response.owner.avatar_url;
	    		document.getElementById("name").innerHTML = response.full_name;
	    	}
	    	
	    } 
	};
  ajax.open("GET", url, true);
  ajax.send();
}



function validateRepoName(repoNameInput, action){
	repoNameInput.addEventListener('input', function(){
		
		switch(action){
			case "2":
				var repoName = this.value;
				if (repoName.indexOf('/')===-1) {
					//invalid
					document.getElementById('validateName').style.display = 'inherit';
					document.getElementById('validateName2').style.display = 'inherit';
					document.getElementById('validateName').innerHTML = 'Repository name should be of the form "username/repoName"';
					document.getElementById('validateName2').innerHTML = 'Repository name should be of the form "username/repoName"';
				}
				else{
					document.getElementById('validateName').style.display = 'none';
					document.getElementById('validateName2').style.display = 'none';
				}

				break;
			default:
				document.getElementById('validateName').style.display = 'none';
				document.getElementById('validateName2').style.display = 'none';
				break;
		}
	});
}

function validateRepo(repoName){
	if (repoName.indexOf('/')===-1) {
		return false;
	}
	else{
		return true;
	}
}

function ajaxRequest(url, callback){
	var xhttp;
	xhttp=new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	      callback(this);
	    }
	    else if(this.readyState == 4 && this.status!=200){
	    	// show loaderror and hide loader
	    	document.getElementById('loader').style.display = 'none';
	    	document.getElementById('loadError').style.display = 'inherit';
	    }
	};
	
	xhttp.open("GET", url, true);
	xhttp.send();
}

function loadProfile(xhttp){
	document.getElementById('loaderBg').style.display = 'none';
	var response = xhttp.responseText;
	var response = JSON.parse(response);
	document.getElementById("avatar").innerHTML = '<img src="'+response.avatar_url+'" id="avatar">';
	document.getElementById("name").innerHTML = response.name;
  	document.getElementById("results").innerHTML = '<div class="row">'+
		'<span class="col-sm-6"><b>Company:</b>'+response.company+'</span>'+
		'<span class="col-sm-6"><b>Public Repos:</b>'+response.public_repos+'</span>'+
		'<span class=" col-sm-6"><b>Location:</b>'+response.location+'</span>'+
		'<span class=" col-sm-6"><b>Blog:</b>'+response.blog+'</span>'
		'<span class=" col-sm-6"><b>email</b>:'+response.email+'</span></div>';
}

function repoCallback(xhttp){

	var response = xhttp.responseText;
	response = JSON.parse(response);
	

	var commitLabels = [];
	var commitStats = [];

	for(var i=0; i<response.length; i++){
		commitLabels.push(i);
		commitStats.push(response[i].total);
	}

	drawChart(commitLabels, commitStats);
}


// get participation stats for each user repos
function getCommitActivity(xhttp){
	var response = xhttp.responseText;
	response = JSON.parse(response);

	//loop through all the repos
	for(var i=0; i<response.length; i++){
		//visit each repo, count and push or add users commits to array
		var url = response[i].url+"/stats/participation";
		ajaxRequest(url, extractUserCommits);
	}

	
	drawChart(commitLabels, commitStats);
}

function drawChart(commitLabels, commitStats){
	document.getElementById("results").innerHTML = '<canvas id="myChart" width="400" height="400"></canvas>';

	document.getElementById('loaderBg').style.display = 'none';

	var ctx = document.getElementById("myChart").getContext("2d");

	var config = {
		type: 'line',
		data: {
			labels: commitLabels,
			datasets: [{
				label: 'Number of commits',
				backgroundColor: window.chartColors.purple,
				borderColor: window.chartColors.purple,
				data: commitStats,
				fill: false,
			}]
		},
		options: {
			responsive: true,
			title: {
				display: true,
				text: 'Commit Activity for '+fullname+' over the last year'
			},
			tooltips: {
				mode: 'index',
				intersect: false,
			},
			hover: {
				mode: 'nearest',
				intersect: true
			},
			scales: {
				xAxes: [{
					display: true,
					scaleLabel: {
						display: true,
						labelString: 'Week'
					}
				}],
				yAxes: [{
					display: true,
					scaleLabel: {
						display: true,
						labelString: 'Commits'
					}
				}]
			}
		}
	};

	var myLineChart = new Chart(ctx, config);
}

function extractUserCommits(xhttp){
	var ajaxResponse = xhttp.responseText;
	ajaxResponse = JSON.parse(ajaxResponse);

	for(var i=0; i<ajaxResponse.owner.length; i++){
		if (commitLabels[i]===undefined||commitLabels[i]===null) {
			
			commitLabels.push(i);
			commitStats.push(ajaxResponse.owner[i]);
		}
		else{

			commitStats[i]+=ajaxResponse.owner[i];
			
		}
	}
	
}