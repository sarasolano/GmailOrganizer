$(document).ready(function(){
	$('#google-signin').click(function(event) {
		$.get('/goauth2');
	});

	$('#logout').click(function(event) {
		$.get('/logout');
	})

  $.post('/'+ meta("userId") + '/getEmails', function(res) {
     if (res && res.messages) {
     	for (var i = 0; i < res.messages.length; i++) {
	    	let mes = res.messages[i] 
	    	console.log(mes)
	    }
     }
  });
})

function meta(name) {
    var tag = document.querySelector('meta[name=' + name + ']');
    if (tag != null)
        return tag.content;
}