function newContact(event) {
    event.preventDefault();
    var first = $("#fn").val().substr(0,$("#fn").val().indexOf(' '));
    var last = $("#fn").val().substr($("#fn").val().indexOf(' ')+1);
    var email = $("#email").val();
    $.post('/' + meta("userId") + '/addFavorite', {firstName: first, lastName: last, email: email}, function(res){
        if(res.ok) {
              $('#myTable').append('<tr><td>' + first + '</td><td>'+ last +'</td><td>'+ email + '</td><td><input type="checkbox" class ="contact_check"></td></tr>');
        } else {
            alert("Invalid Contact");
        }

    });
}
function newremind(event) {
    event.preventDefault();
    var text = $("#reminder_text").val();
    $("#new_R")[0].reset();
    if (text != '') {
        num_reminders += 1;
        $('#remind_count').text(num_reminders);
        var id = 0;
        $.post('/' + meta("userId") + '/addReminder', {text: text}, function(res){
            console.log(res.ok)
        });

        $('#remind_table').append('<tr><td>' + text + '</td><td><input type="checkbox" class ="remind_check"></td></tr>');
    }
}
function meta(name) {
        var tag = document.querySelector('meta[name=' + name + ']');
        if (tag != null)
            return tag.content;
        return '';
    }
$(document).ready(function(){
    $("#folder_holder").hide();
    var newcontact = $('#newContact').submit(newContact);
    var newreminder = $("#new_R").submit(newremind);

    $('#username').text(meta('userId'));
});
var num_notifs = 3;
var user_email = '';
var user_id = -1;
var favorites = [];
var num_reminders = 0;
var num_folders = 0;
var page_token = {};
var page_number = 0;
var more_emails = true;

var folder_colors = [ "#007bff","#28a745"," #17a2b8", "#dc3545", "#343a40", "#6c757d"];

$.post('/'+ meta("userId") + '/getReminders', function(res) {
     if (res && res.ok) {
        let data = res.data;
        num_reminders = data.length;
        for (x = 0; x < data.length; x++) {
            let text = data[x].text;
            let id = data[x].id;
            $('#remind_table').append('<tr><td>' + text + '</td><td><input type="checkbox" class ="remind_check"></td></tr>');
        }
        $('#remind_count').text(num_reminders);
     } else {
        console.log(status)
     }
  });
$.post('/' + meta("userId") + '/getFavorites', function(res) {
   if (res && res.ok) {
    let data = res.data
      for (x = 0; x < data.length; x++) {
            let name = data[x].fullName
            var first = name.substr(0,name.indexOf(' '));
            var last = name.substr(name.indexOf(' ')+1);
              $('#myTable').append('<tr><td>' + first + '</td><td>'+ last +'</td><td>'+ data[x].address + '</td><td><input type="checkbox" class ="contact_check"></td></tr>');
          }

   }
});


$.post('/' + meta("userId") + '/getEmails', function(res) {
   if (res && res.ok) {
    let data = res.data
    page_token[page_number] = res.page_token;
    if (data.length < 25) { more_emails = false;}
      for (x = 0; x < data.length; x++) {
            let subject = data[x].subject;
            var date = data[x].date;
            var sender = data[x].sender;
              $('#email_list').append('<tr><td>0<td><td>' + first + '</td><td>'+ sender +'</td><td>'+ subject + '</td><td>>'+ date +'</td></tr>');
          }

   }
});

$("#next_btn").click(function(){
    if (more_emails) {
        token = page_token[page_number];
            $.post('/' + meta("userId") + '/getEmails', {page_token: token}, function(res) {
               if (res && res.ok) {
                let data = res.data;
                page_number += 1;
                page_token[page_number] = res.page_token;
                  for (x = 0; x < data.length; x++) {
                        let subject = data[x].subject;
                        var date = data[x].date;
                        var sender = data[x].sender;
                          $('#email_list').append('<tr><td>0<td><td>' + first + '</td><td>'+ sender +'</td><td>'+ subject + '</td><td>>'+ date +'</td></tr>');
                      }

               }
            });
    }
});

$("#prev_btn").click(function(){
        if (page_number >= 1){
            page_number -= 1
            token = page_token[page_number];
            $.post('/' + meta("userId") + '/getEmails', {page_token: token}, function(res) {
               if (res && res.ok) {
                let data = res.data;
                  for (x = 0; x < data.length; x++) {
                        let subject = data[x].subject;
                        var date = data[x].date;
                        var sender = data[x].sender;
                          $('#email_list').append('<tr><td>0<td><td>' + first + '</td><td>'+ sender +'</td><td>'+ subject + '</td><td>>'+ date +'</td></tr>');
                      }
               }
            });
        }
});


$('.notifs').click(function() {
    $(this).remove();
    num_notifs -= 1;
    $('#not_count').text(num_notifs);
});
$(document).on("click", ".foldbtn", function(){
    alert("hey hey");
});
$("#remind_button").click(function() {
    $("#remind_table tbody td").each(function(i, td){
        if (i%2 != 0) {
            if($(td).children().is(":checked")) {
                var text = $(td).prev('td').text();
                $.post('/' + meta("userId") + '/deleteReminder', {text: text}, function(res){
                    if (res.ok) {
                        $(td).parent().remove();
                        num_reminders -= 1;
                        $('#remind_count').text(num_reminders);
                    }
                });
            }
        }
    });
});

$("#save_contacts").click(function() {
    $("#contact_table tbody td").each(function(i, td){
        if (i%3 == 0) {
            if($(td).children().is(":checked")) {
                var toRemove = $(td).prev('td').text();
                $.post('/' + meta("userId") + '/deleteFavorite', {email: toRemove}, function(res){
                    if (res.ok) {
                        $(td).parent().remove();
                    }
                });
            }
        }
    });
    $('#remind_count').text(num_reminders);
});

$("#folder_switch").click(function(){
    if($(this).text() === 'Folder View') {
        $("#emails_holder").hide();
        $("#folder_holder").show();
        $(this).text('Email View');
    } else {
        $("#emails_holder").show();
        $("#folder_holder").hide();
        $(this).text('Folder View');

    }
});

$("#new_F").click(function(){
    var folder_n = prompt("Enter Folder Name:");
    var inner = folder_n;
    if (folder_n == '') {
        alert("Enter a valid folder Name");
    } else if(folder_n != null) {
        if ((num_folders % 4) == 0) {
            var color= folder_colors[Math.floor(Math.random() * folder_colors.length)];
            $("#folder_table tbody").append("<tr><td><button class = 'foldbtn' style=' background-color: "+ color +"'>"+ inner+"</button></td></tr>");
            num_folders += 1;
        } else {
            var color= folder_colors[Math.floor(Math.random() * folder_colors.length)];
            $("#folder_table tbody tr:last").append("<td><button class = 'foldbtn' style=' background-color: "+ color +"'>"+ inner+"</button></td>");
            num_folders += 1;
        }
    }


});
