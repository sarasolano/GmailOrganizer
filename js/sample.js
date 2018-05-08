$(document).ready(function(){
	$('#google-signin').click(function(event) {
		$.get('/goauth2');
	});

	$('#logout').click(function(event) {
		$.get('/logout');
	})


function meta(name) {
    var tag = document.querySelector('meta[name=' + name + ']');
    if (tag != null)
        return tag.content;
}
