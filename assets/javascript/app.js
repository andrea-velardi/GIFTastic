// my topics saved as strings in a variable (my comics)
var topics = ["Batman", "Superman", "Wonder Woman", "Incredible Hulk", "Teen Titans",
"Thor", "Raven", "Guardians of the Galaxy", "Watchmen", "Kill Bill",
"Star Wars", "Star Trek", "X-Men", "Spiderman", "Hellboy",
"Deadpool", "DareDevil", "Green Lantern"];
var numberOfGIFs = 10;// limits the results per page to 10
var cutOffRating = "PG13"; // ensuring that nothing past PG will display from the giphy API

function renderButtons(){ //loops through my topics and creates a button for each, and appends that to the DOM render = fetching the informtion
	for(var i = 0; i < topics.length; i++) {
		var newButton = $("<button>");
		newButton.addClass("btn");
		newButton.addClass("comic-button");
		newButton.text(topics[i]);// puts the text of the topic into the button
		$("#button-container").append(newButton);// appends the newButton data into the #button-container on the DOM
		console.log('this works'); 
	}
	$(".comic-button").unbind("click");// removes all handlers attached to the elements

	$(".comic-button").on("click", function(){ //when a button is clicked on, it will run this function
		$(".gif-image").unbind("click");
		$("#gif-container").empty();
		populateGIFContainer($(this).text());//calling the populateGIFContainer function and passing this.text through 
	});

}

function addButton(comic){ //adding buttons from topics in array
	if(topics.indexOf(comic) === -1) {
		topics.push(comic);//push the topic button onto the DOM
		$("#button-container").empty();
		renderButtons(); //calling the renderButtons Function above
	}
}

function populateGIFContainer(comic){
	$.ajax({
		url: "https://api.giphy.com/v1/gifs/search?q=" + comic + 
		"&api_key=ifiRI75D1HQ1iJGEsjd0oR8todb4VZlu&rating=" + cutOffRating + "&limit=" + numberOfGIFs,
		method: "GET" //using the GET method to fetch the data from the API
	}).then(function(response){
		response.data.forEach(function(element){
			newDiv = $("<div>");//add new div element
			newDiv.addClass("individual-gif-container");
			newDiv.append("<p>Rating: " + element.rating.toUpperCase() + "</p>");//appending the rating from the API
			var newImage = $("<img src = '" + element.images.fixed_height_still.url + "'>");//new variable for image
			newImage.addClass("gif-image");
			newImage.attr("state", "still");//attribute of still
			newImage.attr("still-data", element.images.fixed_height_still.url);
			newImage.attr("animated-data", element.images.fixed_height.url);//attr of animated
			newDiv.append(newImage);
			$("#gif-container").append(newDiv);//append the data from newDiv into the html id gif-container
		});
		
		$("#gif-container").addClass("dotted-border");
		$(".gif-image").unbind("click");
		$(".gif-image").on("click", function(){//if the giphy is clicked on, run this function
			if($(this).attr("state") === "still") {// if still, then change to animated when clicked
				$(this).attr("state", "animated");
				$(this).attr("src", $(this).attr("animated-data"));
			}
			else {
				$(this).attr("state", "still");// clicked again change back to still 
				$(this).attr("src", $(this).attr("still-data"));
			}
		});
	});
}

$(document).ready(function(){// DOM is ready
	renderButtons();
	$("#submit").on("click", function(){//when submit is clicked, it runs this function
		event.preventDefault();//preventative 
		addButton($("#comic").val().trim());// add the button and remove white space
		$("#comic").val("");//the button will have the value of the string
	});
});