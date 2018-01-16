angular.module('aics')
    .component('dashboard', {
        templateUrl: './assets/js/aics/dashboard/dashboard.template.html',
        controller: function DashBoardController($scope, $timeout, sharedService) {

            // TODO: this should be false by default
            // keep it to true until you implement the flows
            // so you can see the chatbox in the meantime
            $scope.inConversation = true;
            $scope.messages = [];
            $scope.engagedUser = {
                name: 'Ruimin Zhao',
                userId: 'rz2390'
            };

            var socket = io();
            var agentId = sharedService.getProfile().agentId;
            var userId = $scope.engagedUser.userId;

            // send the agent profile to the chat server
            socket.emit('agentHandshake', JSON.stringify(sharedService.getProfile()));

            socket.emit('handshake', JSON.stringify($scope.engagedUser));

            socket.on(agentId, function(message) {
                console.log('received message from user');

                try {
                    let json = JSON.parse(message);

                    $scope.messages.push({
                        text: json.text,
                        position: 'right'
                    });

                    $scope.$apply();
                } catch (error) {
                    console.log('message format error', error);
                }
            });

            socket.on(userId, function(msg){
                console.log('message in dashboard' + msg);
                $scope.messages.push({
                    text: msg,
                    position: 'right'
                })
                $scope.$apply();
            });

            const sendMessage = function(message) {
                console.log('sending message');

                $scope.messages.push({
                    text: message,
                    position: 'left'
                });
                if ($scope.engagedUserId) {
                    socket.emit(agentId, message);
                }
                socket.emit(userId, message);
            };

            $scope.keyListener = function(keyEvent) {
                if (keyEvent.which !== 13) {
                    return;
                }

                const message = $('.chat-input').val();
                $('.chat-input').val('');

                sendMessage(message);
            };

            $scope.sendButtonPressed = function() {
                console.log('send button pressed');

                const message = $('.chat-input').val();
                $('.chat-input').val('');

                sendMessage(message);
            };
        }
    });
