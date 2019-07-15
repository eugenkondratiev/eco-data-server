                console.log("clinet.js added");

                var socket = io.connect('http://95.158.47.15:3001');

                // Посетителя просят ввести имя пользователя...
                //  var username = prompt('What\'s your username?');
                var username = "testuser";

                // Оно отправляется в сообщении типа "little_newbie" (чтобы отличать его от сообщений типа "message")
                socket.emit('little_newbie', username);

                // Диалоговое окно отображается, когда сервер отправляет нам сообщение типа "message"
                socket.on('message', function(message) {
                    console.log('The server has a message for you: ' + message);
                    //alert('The server has a message for you: ' + message);
                });

                //$(document).ready(function() {
                    
                    socket.on('newdata', function(message) {
                        //console.log('New data received: ' + message);
                        console.log( 'New data received: ' + JSON.parse(message));
                        //alert('New data received: ');
                        dataM340 = JSON.parse(message);
                        //alert(dataM340);

                        document.getElementById('value1').innerText = dataM340[25];
                        document.getElementById('value2').innerText = dataM340[8];
                    
                    // document.getElementById('value2').innerText = dataM340[1];
                    $('#value3').text(dataM340[35]);
                    // $('#value3').innerText = dataM340;
                    })
                //})

                // Когда нажимается кнопка, сообщение типа "message" отправляется на сервер
                $('#poke').click(function () {
                    socket.emit('message', 'Hi server, how are you?');
                });