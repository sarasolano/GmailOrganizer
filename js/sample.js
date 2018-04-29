$(document).ready(function(){
	$('#user').click(function(event) {
		$.post('/goauth2', function(data) {		
			if (!data) {
				console.log('could not create new chat room')
				return
			}
		})
	})
})