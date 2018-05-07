$(document).ready(function(){
	$('#google-signin').click(function(event) {
		$.get('/goauth2');
	});

	$('#logout').click(function(event) {
		$.get('/logout');
	})
})