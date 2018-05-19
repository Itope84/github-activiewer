		var homepage = document.getElementById('homepage');
		var resultWindow = document.getElementById('resultsWindow');
		
		document.getElementById('submit').addEventListener('click', function(e){
			e.preventDefault();
			var action = document.getElementById('action').value;
			var username = document.getElementById('username').value;
			homepage.classList.remove('d-flex');
			homepage.classList.add('d-none');
			resultWindow.style.display = 'inherit';

			// what should i do?
			
			loadResults(action, username);
		});
		function loadResults(action, name) {
			switch(action){
				case '1':
					break;
				case '2':
					getRepoActivity(name);
					break;
				case '3':
					getProfile(name);
					break;
			}
		}

		function getProfile(username){
			  var xhttp = new XMLHttpRequest();
			  xhttp.onreadystatechange = function() {
			    if (this.readyState == 4 && this.status == 200) {
			    	var response = this.responseText;
			    	var response = JSON.parse(response);
			    	console.log(response);
			    	document.getElementById("avatar").src = response.avatar_url;
			    	document.getElementById("name").innerHTML = response.name;
			      document.getElementById("results").innerHTML = '<div class="row">'+
						'<span class="col-sm-6"><b>Company:</b>'+response.company+'</span>'+
						'<span class="col-sm-6"><b>Public Repos:</b>'+response.public_repos+'</span>'+
						'<span class=" col-sm-6"><b>Location:</b>'+response.location+'</span>'+
						'<span class=" col-sm-6"><b>Blog:</b>'+response.blog+'</span>'
						'<span class=" col-sm-6"><b>email</b>:'+response.email+'</span></div>';
			    }
			  };
			  xhttp.open("GET", "https://api.github.com/users/"+username, true);
			  // xhttp.setRequestHeader("User-Agent", "GitHubActiViewer");
			  // xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			  xhttp.send();
			}

		function getCommitActivity(username){
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
			    	var response = this.responseText;
			    	var response = JSON.parse(response);
			    	console.log(response);
			    	document.getElementById("avatar").src = response.avatar_url;
			    	document.getElementById("name").innerHTML = response.name;
			      document.getElementById("results").innerHTML = '<div class="row">'+
						'<span class="col-sm-6"><b>Company:</b>'+response.company+'</span>'+
						'<span class="col-sm-6"><b>Public Repos:</b>'+response.public_repos+'</span>'+
						'<span class=" col-sm-6"><b>Location:</b>'+response.location+'</span>'+
						'<span class=" col-sm-6"><b>Blog:</b>'+response.blog+'</span>'
						'<span class=" col-sm-6"><b>email</b>:'+response.email+'</span></div>';
			    }
			 };
			  xhttp.open("GET", "https://api.github.com/users/"+username, true);
			  // xhttp.setRequestHeader("User-Agent", "GitHubActiViewer");
			  // xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			  xhttp.send();
		}


	// https://api.github.com/repos/Itope84/itope84.github.io/stats/commit_activity
	function getRepoActivity(repository){
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
			    	var response = this.responseText;
			    	response = JSON.parse(response);
			    	console.log(response.length);
			    	for(var i=0; i<response.length; i++){
			    		for(var j=0; j<response[i].days.length; j++){
			    			console.log(response[i].days[j]);
			    		}
			    	}
			    }
		 };
		  xhttp.open("GET", "https://api.github.com/repos/Itope84/"+repository+"/stats/commit_activity", true);
		  // xhttp.setRequestHeader("User-Agent", "GitHubActiViewer");
		  // xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		  xhttp.send();
	}

	// there's a little problem here, gotta do form validation first...
	function getAvatar(type, name){
		switch(type){
			case 'user':
				url = "https://api.github.com/users/"+name
				break;
			case 'repo':
				url = "https://api.github.com/repos/Itope84/"+name
				break;
		}
	}