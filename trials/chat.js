var Chat = {};

        Chat.socket = null;

        Chat.connect = (function(host) {
            if ('WebSocket' in window) {
                Chat.socket = new WebSocket(host);
            } else if ('MozWebSocket' in window) {
                Chat.socket = new MozWebSocket(host);
            } else {
                Console.log('Error: WebSocket is not supported by this browser.');
                return;
            }

            Chat.socket.onopen = function () {
                Console.log('Info: WebSocket connection opened.');
                document.getElementById('chat').onkeydown = function(event) {
                    if (event.keyCode == 13) {
                        Chat.sendMessage();
                    }
                };
            };

            Chat.socket.onclose = function () {
                document.getElementById('chat').onkeydown = null;
                Console.log('Info: WebSocket closed.');
            };

            Chat.socket.onmessage = function (message) {
                Console.log(message.data);
            };
        });

        Chat.initialize = function() {
            if (window.location.protocol == 'http:') {
                Chat.connect('ws://' + window.location.host + '/examples/websocket/chat');
                //Chat.name="meow";
                //Chat.initialize.name="meow";
            } else {
                Chat.connect('wss://' + window.location.host + '/examples/websocket/chat');
            }
        };

        Chat.sendMessage = (function() {
            var message = document.getElementById('chat').value;
            if (message != '') {
                var msg = {
    type: "message",
    text: document.getElementById("chat").value,
    id:   "ohoo",
    date: Date.now()
  };
                
                
                //Chat.socket.send(message);
                Chat.socket.send(JSON.stringify(msg));
                document.getElementById('chat').value = '';
            }
        });

        var Console = {};

        Console.log = (function(message) {
            var console = document.getElementById('chat-div');
            var p = document.createElement('p');
            p.style.wordWrap = 'break-word';
            var jsonMessage = true;
            var msg;
            
            try{
                var temp = message.substring(message.indexOf("{"),message.indexOf("}")+1);
                temp = temp.replace(/&quot;/g, '"');
                msg = JSON.parse(message.substring(message.indexOf("{"),message.indexOf("}")));
            }catch(err){
                jsonMessage = false;
            }
            if(jsonMessage){
                var timeStr = new Date(msg.date);
                p.innerHTML = msg.text + " Time " + timeStr.getUTCDate() + " Timex " + timeStr.toUTCString();
            }else{
                p.innerHTML = message;
            }
            console.appendChild(p);
            while (console.childNodes.length > 25) {
                console.removeChild(console.firstChild);
            }
            console.scrollTop = console.scrollHeight;
        });

        Chat.initialize();


        document.addEventListener("DOMContentLoaded", function() {
            // Remove elements with "noscript" class - <noscript> is not allowed in XHTML
            var noscripts = document.getElementsByClassName("noscript");
            for (var i = 0; i < noscripts.length; i++) {
                noscripts[i].parentNode.removeChild(noscripts[i]);
            }
        }, false);