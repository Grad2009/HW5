'use strict';

var connectionManager = {
	serverURL: "https://node-from-lynda-grad2009.c9users.io/",
	mainButton: document.getElementById('main'),
	tree: document.getElementById('containerTree')
};

var comment = {};
comment.Form = document.getElementById('addComments');
comment.Text = document.getElementById('commentValue');
comment.Panel = document.getElementById('allComments');
comment.header = document.getElementById('commentsHeader');
comment.onDelete = document.getElementById('delete');
comment.onEdit = document.getElementById('edit');
comment.responseFromSrv = [];
comment.lastRequest = {};


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
	if (target.tagName !== 'SPAN') {return;}
	selectItem(target);
	//delete comments from previous item
	//comment.Panel.innerHTML = '';
	//show responsed comments in commentPanel
	comment.header.textContent = target.getAttribute('data-path');
	showComment(comment.header.textContent, comment.responseFromSrv);
	comment.lastSelectedItem = target;
	comment.lastSelected = null;
	return false;
	});

function selectItem(seleсtedItem) {
	if (comment.lastSelectedItem) {
		comment.lastSelectedItem.classList.remove('selected');
	} else if (comment.lastSelected) {
		comment.lastSelected.classList.remove('selected');
	}
    seleсtedItem.classList.add('selected');
    }

	

comment.Form.addEventListener('submit', function(e) {
	// add comment to comment panel;
	if (comment.Text.value && comment.lastSelectedItem) {
	e.preventDefault();
	console.log(comment.Text.value);
	printComment(comment.Text.value);
	postComment(comment.header.textContent, comment.Text.value);
	} else {
		alert('You have to choose some item to comment!');
	}

	//need callback for correct handling the response from server
	if (comment.tmp === '{"ok":1,"n":1}') {
		comment.responseFromSrv.push(comment.lastRequest);
		console.log('Comments array after changing:' + comment.responseFromSrv);
	}
});

comment.Panel.addEventListener('contextmenu', function(e) {
	event.preventDefault();
	var target = event.target;
	if (target.tagName !== "P") {return;}
	selectItem(target);
	comment.lastSelected = target;
	comment.onPanel = target.textContent;
	comment.lastSelectedItem = null;
	
	//init getComments request in order 
	//to update the data-id of added comments
	/*if (target.getAttribute('data-id') === "undefined") {
		getComments('getcomments').onload = function() {
		showComment(comment.header.textContent, comment.responseFromSrv);
		selectItem(target);
		}
		/*asyncGetComments('getcomments')
			.then(
				responce => {
					showComment(comment.header.textContent, comment.responseFromSrv);
					selectItem(target);
					return;
				},
				error => alert('Cannot synchronize with server')
			);
			
	}	
	*/
	return false;
});

comment.onDelete.addEventListener('click', function(e) {
	if (comment.lastSelected) {
		var answerDel = confirm('Are you shure to delete?');
		if (answerDel) {
		deleteComment(comment.header.textContent, comment.onPanel);
		} else {
			return;
		}
	}
});

comment.onEdit.addEventListener('click', function(e) {
	if (comment.lastSelected) {
		var answerEdit = prompt('Enter new version of your comment');
		if (answerEdit) {
			editComment(comment.header.textContent, comment.onPanel, answerEdit);
			comment.lastSelected.textContent = answerEdit;
		}
	} else {
		alert('You need to choose some comment!');
		return;
	}
	
});

function printComment(printedText, id) {
	var newComment = document.createElement('p');
	newComment.innerHTML = /*'<strong>'+ data.user + '</strong>: '+*/printedText;
	newComment.setAttribute('data-id', id);
    comment.Panel.appendChild(newComment, comment.Panel.children[0]);
}

function postComment(selectedItemPath, printedText) {
	// post comment to server;
	var request = {
		path: selectedItemPath,
		comment: printedText
	//	user: user
	};
	comment.lastRequest = request;
	postQuery(connectionManager.serverURL + 'postComments', request);
	comment.Text.value = '';
}

function showComment(selectedItemPath, data) {
	comment.Panel.innerHTML = '';
	for (var dataElement in data) {
		if (data[dataElement].path === selectedItemPath) {
			printComment(data[dataElement].comment, data[dataElement]._id);
		}
	}
}

function deleteComment(selectedItemPath, printedText) {
	var request = {
		path: selectedItemPath,
		comment: printedText
	//	user: user
	};
	comment.lastDelRequest = request;
	postQuery(connectionManager.serverURL + 'delComments', request);
	comment.lastSelected.remove();
	//need callback for correct handling the response from server
	if (comment.tmp === '{"ok":1,"n":1}') {
		var count = 0;
		for (var dataElement in data) {
			if (data[dataElement].path === selectedItemPath &&
				data[dataElement].comment === printedText) {
			var index = count;
			}
		count++;
		}
		comment.responseFromSrv.splice(index);
	}
	
}

function editComment(selectedItemPath, previosText, newText) {
	var request = {
		path: selectedItemPath,
		comment: previosText,
		version: newText
	//	user: user
	};
	comment.lastDelRequest = request;
	postQuery(connectionManager.serverURL + 'editComments', request);
	
	//need callback for correct handling the response from server
	if (comment.tmp === '{"ok":1,"n":1}') {
		var count = 0;
		for (var dataElement in data) {
			if (data[dataElement].path === selectedItemPath &&
				data[dataElement].comment === previosText) {
			var index = count;
		count++;
		}
		comment.responseFromSrv.splice(index, newText);
	}
	
}