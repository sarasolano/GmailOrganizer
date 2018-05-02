$(document).ready(function(){
	$('#username').click(function(event) {
		$.post('/goauth2', function(data) {		
			if (!data) {
				console.log('could not create new chat room')
				return
			}
		})
	})
})