'use strict';

var connectionManager = {
	serverURL: "https://node-from-lynda-grad2009.c9users.io/",
	mainButton: document.getElementById('main'),
	tree: document.getElementById('containerTree')
}

var comment = {};
comment.Form = document.getElementById('addComments');
comment.Text = document.getElementById('commentValue');
comment.Panel = document.getElementById('allComments');
comment.header = document.getElementById('commentsHeader');
comment.responseFromSrv = [];

connectionManager.mainButton.addEventListener('click', getInfo);


function checkForKids(item) {
	if(item.hasOwnProperty('children')) {
		return true;
	} else {return false;}
}

function createTree(containerName, obj) {
	var container = document.getElementById(containerName);
    container.innerHTML = createTreeText(obj);
}

function createTreeText(data) {
    var li = '';
	  
    for (var dataElement in data) {
		if (checkForKids(data[dataElement])) {
        li += '<li><span class="glyphicon glyphicon-folder-open"></span><span class="folder" data-path="'
		+ data[dataElement].path + '"> ' + dataElement
		+ createTreeText(data[dataElement].children) + '</span></li>';
		
		} else {
			li += '<li><span class="file" data-path="'
			+ data[dataElement].path + '">' + dataElement + '</span></li>'; 
		}
	}
      
	if (li) {
		var ul = '<ul>' + li + '</ul>';
    }
    return ul || '';
}

connectionManager.tree.addEventListener('click', function(event) {
	var target = event.target;
	if (target.tagName != 'SPAN' || target.classList.contains('file')) {return;}
	var childrenContainer = target.parentNode.getElementsByTagName('ul')[0];
    if (!childrenContainer) return; // no children
	childrenContainer.hidden = !childrenContainer.hidden;
});

connectionManager.tree.addEventListener('contextmenu', function(event) {
	event.preventDefault();
	var target = event.target;
	if (target.tagName != 'SPAN') {return;}
	selectItem(target);
	//delete comments from previous item
	if (comment.lastSelected) {
		comment.Panel.innerHTML = '';
	}
	//show responsed comments in commentPanel
	comment.header.textContent = target.getAttribute('data-path');
	showComment(comment.header.textContent, comment.responseFromSrv);
	comment.lastSelected = target;
	return false;
	});

function selectItem(seleсtedItem) {
	if (comment.lastSelected) {
		comment.lastSelected.classList.remove('selected');
	}
    seleсtedItem.classList.add('selected');
    }

	

comment.Form.addEventListener('submit', function(e) {
	/// add comment to comment panel;
	if (comment.Text.value && comment.lastSelected) {
	e.preventDefault();
	console.log(comment.Text.value);
	printComment(comment.Text.value);
	postComment(comment.header.textContent, comment.Text.value);
	} else {
		alert('You have to choose some item to comment!');
	}
});

function printComment(printedText) {
	var newComment = document.createElement('p');
	newComment.innerHTML = /*'<strong>'+ data.user + '</strong>: '+*/printedText + '<br/>';
    comment.Panel.appendChild(newComment, comment.Panel.children[0]);
}

function postComment(selectedItemPath, printedText) {
	// post comment to server;
	var request = {
		path: selectedItemPath,
		comment: printedText
	//	user: user
	};
	postQuery(connectionManager.serverURL + 'postComments', request);
	comment.Text.value = '';
}

function showComment(selectedItemPath, data) {
	for (var dataElement in data) {
		if (data[dataElement].path === selectedItemPath) {
			printComment(data[dataElement].comment);
		}
	}
}