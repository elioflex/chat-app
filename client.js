const socket = io();

const usernameInput = document.getElementById('usernameInput');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const messagesDiv = document.querySelector('.messages');

usernameInput.addEventListener('change', () => {
  const username = usernameInput.value.trim();
  socket.emit('setUsername', username);
  console.log(`Username set: ${username}`);
});

sendButton.addEventListener('click', () => {
  const username = usernameInput.value.trim(); // Get the entered username
  const message = messageInput.value.trim(); // Get the entered message

  if (username !== '' && message !== '') {
    socket.emit('sendMessage', { username, message }); // Emit the message to the server
    console.log(`Message sent: ${message}`);
    messageInput.value = ''; // Clear the input field
  }
});

socket.on('chatMessage', (data) => {
  const messageElement = document.createElement('div');
  messageElement.textContent = `[${data.timestamp}] ${data.username}: ${data.message}`;
  // Add a class to the message element based on the username
  messageElement.classList.add(data.username === 'yassine' ? 'own-message' : 'other-message');
  messagesDiv.appendChild(messageElement);
});
