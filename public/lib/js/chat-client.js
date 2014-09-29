var Chat = (function ($) {
	var FADE_TIME = 150; // ms
	var TYPING_TIMER_LENGTH = 400; // ms
	var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];

	console.log("Chat loaded");

	var chat = {};

	var settings = {
		$window: $(window),
		$usernameInput: $('#plugin_Chat .login-window input'),
		$loginForm: $('#plugin_Chat .login-window form'),
		$chatForm: $('#plugin_Chat .chat-window form'),
		$online: $('#plugin_Chat .viewport-header .online div'),
		$messages: $('#plugin_Chat .viewport-content'),
		$inputMessage: $('#plugin_Chat .chat-window input'),
		$loginPage: $('#plugin_Chat .login-window'),
		$chatPage: $('#plugin_Chat .chat-window')
	};

	chat.init = function (io, options) {

		console.info("Initialized Seminarjs Chat client");

		settings = $.extend(settings, options);

		// Prompt for setting a username
		var username;
		var connected = false;
		var typing = false;
		var lastTypingTime;
		var $currentInput = settings.$usernameInput.focus();

		settings.$loginPage.show();
		settings.$chatPage.hide();

		function addParticipantsMessage(data) {
			var message = '';
			settings.$online.text(data.numUsers + " online");
		}

		// Sets the client's username
		function setUsername() {
			username = cleanInput(settings.$usernameInput.val().trim());

			// If the username is valid
			if (username) {
				settings.$loginPage.fadeOut();
				settings.$chatPage.show();
				settings.$loginPage.off('click');
				settings.$currentInput = settings.$inputMessage.focus();

				// Tell the server your username
				socket.emit('add user', username);
			}
		}

		// Sends a chat message
		function sendMessage() {
			var message = settings.$inputMessage.val();
			// Prevent markup from being injected into the message
			message = cleanInput(message);
			// if there is a non-empty message and a socket connection
			if (message && connected) {
				settings.$inputMessage.val('');
				addChatMessage({
					username: username,
					message: message
				});
				// tell server to execute 'new message' and send along one parameter
				socket.emit('new message', message);
			}
		}

		// Log a message
		function log(message, options) {
			var $el = $('<div class="bubble log"/>').text(message);
			addMessageElement($('<div class="bubble-container" />').append($el), options);
		}

		// Adds the visual chat message to the message list
		function addChatMessage(data, options) {
			// Don't fade the message in if there is an 'X was typing'
			var $typingMessages = getTypingMessages(data);
			options = options || {};
			if ($typingMessages.length !== 0) {
				options.fade = false;
				$typingMessages.remove();
			}

			var side = 'left';
			if (data.username == username) side = 'right';

			var $usernameDiv = $('<div class="avatar avatar-' + side + '"/>')
				.text(data.username)
				.css('color', getUsernameColor(data.username));
			var $messageBodyDiv = $('<div class="bubble bubble-' + side + '">')
				.text(data.message);

			var typingClass = data.typing ? 'typing' : '';
			var $messageDiv = $('<div class="bubble-container"/>')
				.data('username', data.username)
				.addClass(typingClass)
				.append($usernameDiv, $messageBodyDiv);

			addMessageElement($messageDiv, options);
		}

		// Adds the visual chat typing message
		function addChatTyping(data) {
			data.typing = true;
			data.message = 'Escribiendo...';
			addChatMessage(data);
		}

		// Removes the visual chat typing message
		function removeChatTyping(data) {
			getTypingMessages(data).fadeOut(function () {
				$(this).remove();
			});
		}

		// Adds a message element to the messages and scrolls to the bottom
		// el - The element to add as a message
		// options.fade - If the element should fade-in (default = true)
		// options.prepend - If the element should prepend
		//   all other messages (default = false)
		function addMessageElement(el, options) {
			var $el = $(el);

			// Setup default options
			if (!options) {
				options = {};
			}
			if (typeof options.fade === 'undefined') {
				options.fade = true;
			}
			if (typeof options.prepend === 'undefined') {
				options.prepend = false;
			}

			// Apply options
			if (options.fade) {
				$el.hide().fadeIn(FADE_TIME);
			}
			if (options.prepend) {
				settings.$messages.prepend($el);
			} else {
				settings.$messages.append($el);
			}
			settings.$messages[0].scrollTop = settings.$messages[0].scrollHeight;
		}

		// Prevents input from having injected markup
		function cleanInput(input) {
			return $('<div/>').text(input).text();
		}

		// Updates the typing event
		function updateTyping() {
			if (connected) {
				if (!typing) {
					typing = true;
					socket.emit('typing');
				}
				lastTypingTime = (new Date()).getTime();

				setTimeout(function () {
					var typingTimer = (new Date()).getTime();
					var timeDiff = typingTimer - lastTypingTime;
					if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
						socket.emit('stop typing');
						typing = false;
					}
				}, TYPING_TIMER_LENGTH);
			}
		}

		// Gets the 'X is typing' messages of a user
		function getTypingMessages(data) {
			return $('.typing').filter(function (i) {
				return $(this).data('username') === data.username;
			});
		}

		// Gets the color of a username through our hash function
		function getUsernameColor(username) {
			// Compute hash code
			var hash = 7;
			for (var i = 0; i < username.length; i++) {
				hash = username.charCodeAt(i) + (hash << 5) - hash;
			}
			// Calculate color
			var index = Math.abs(hash % COLORS.length);
			return COLORS[index];
		}

		settings.$loginForm.on('submit', function (e) {
			e.preventDefault();
			setUsername();
		});

		settings.$chatForm.on('submit', function (e) {
			e.preventDefault();
			sendMessage();
			socket.emit('stop typing');
			typing = false;
		});

		settings.$inputMessage.on('input', function () {
			updateTyping();
		});

		// Click events

		// Focus input when clicking anywhere on login page
		settings.$loginPage.click(function () {
			$currentInput.focus();
		});

		// Focus input when clicking on the message input's border
		settings.$inputMessage.click(function () {
			settings.$inputMessage.focus();
		});

		// Socket events

		// Whenever the server emits 'login', log the login message
		socket.on('login', function (data) {
			connected = true;
			addParticipantsMessage(data);
		});

		// Whenever the server emits 'new message', update the chat body
		socket.on('new message', function (data) {
			addChatMessage(data);
		});

		// Whenever the server emits 'user joined', log it in the chat body
		socket.on('user joined', function (data) {
			log(data.username + ' se ha unido');
			addParticipantsMessage(data);
		});

		// Whenever the server emits 'user left', log it in the chat body
		socket.on('user left', function (data) {
			log(data.username + ' se ha desconectado');
			addParticipantsMessage(data);
			removeChatTyping(data);
		});

		// Whenever the server emits 'typing', show the typing message
		socket.on('typing', function (data) {
			addChatTyping(data);
		});

		// Whenever the server emits 'stop typing', kill the typing message
		socket.on('stop typing', function (data) {
			removeChatTyping(data);
		});

	}

	return chat;

}(jQuery));