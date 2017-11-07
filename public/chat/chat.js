var username = prompt('Please enter a username:')
var socket = io()
socket.on('newMsg', function(data){
	addMsg(data.username, data.msg)
})
$('input').focus()

$('button').click(sendMsg)
$(document).keyup(function(e){
	if(e.key == 'Enter'){
		sendMsg()
	}
})
function sendMsg(){
	var msg = $('input').val();
	if(msg.length > 0){
		socket.emit('newMsg', {username:username, msg:msg});
		addMsg(username, msg);
		$('input').val('')
	}
}
function addMsg(user, msg){
	$('#messages').append("<p><strong>"+user+": </strong>"+msg+"</p>")

}
