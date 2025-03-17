import { showNotification } from "./components/notifications.js";
import { setMessage } from "./components/setMessage.js";
import { GetUsers } from "./users.js";
import { ws } from "./ws.js";
export function Chat() {
    const usersBtn = document.getElementById("users-btn");
    if (usersBtn) {
        usersBtn.addEventListener('click', async () => {
            let usersContainer = document.querySelector('.users-container');
            if (!usersContainer) {
                usersContainer = document.createElement('div');
                usersContainer.classList.add("users-container");
                const closeButton = document.createElement('button');
                closeButton.innerHTML = "✖";
                closeButton.addEventListener('click', () => usersContainer.remove());
                usersContainer.appendChild(closeButton);

                const users = await GetUsers();

                users.forEach(user => {
                    const userBtn = document.createElement('button');
                    userBtn.textContent = user.username;
                    userBtn.classList.add("user-btn");
                    userBtn.addEventListener('click', () => openChat(user));
                    usersContainer.appendChild(userBtn);
                });
                document.body.append(usersContainer);
            } else {
                usersContainer.remove();
            }
        });
    }
}

export function openChat(user) {
    const usersContainer = document.querySelector('.users-container');
    usersContainer.remove()
    if (document.getElementById(`chat-${user.username}`)) return;

    const existingChatBox = document.querySelector('.chat-box');
    if (existingChatBox) {
        existingChatBox.remove();
    }

    const chatBox = document.createElement('div');
    chatBox.classList.add("chat-box");
    chatBox.id = `chat-${user.username}`;

    const chatHeader = document.createElement('div');
    chatHeader.classList.add("chat-box-header");
    chatHeader.innerHTML = `<span>${user.username}</span>`;

    const closeButton = document.createElement('button');
    closeButton.innerHTML = "✖";
    closeButton.addEventListener('click', () => chatBox.remove());
    chatHeader.appendChild(closeButton);

    const chatMessages = document.createElement('div');
    chatMessages.classList.add("chat-box-messages");
    chatMessages.addEventListener('scroll', () => {
        if (chatMessages.scrollTop === 0) {
            GetMessages(user.username, chatMessages, true)
        }
    })

    const chatInput = document.createElement('textarea');
    chatInput.classList.add("chat-box-input");
    chatInput.setAttribute("placeholder", "Type a message...");
    chatInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendingMessage(user);
        }
    });

    const sendBtn = document.createElement('button')
    sendBtn.id = `send-btn-chat-${user.username}`
    sendBtn.textContent = 'Send'
    sendBtn.addEventListener('click', () => {
        sendingMessage(user);
    }
    );
    chatBox.appendChild(chatHeader);
    chatBox.appendChild(chatMessages);
    chatBox.appendChild(chatInput);
    chatBox.appendChild(sendBtn);
    GetMessages(user.username, chatMessages)
    document.body.appendChild(chatBox);
}

export function sendingMessage(user) {
    const messageInput = document.querySelector(`#chat-${user.username} .chat-box-input`);
    const message = messageInput.value.trim();
    if (!message) {
        showNotification('Message cannot be empty', 'error');
        return;
    }

    const recipient = user.username;
    const messageData = {
        type: 'message',
        receiver: recipient,
        content: message,
        timestamp: new Date().toISOString()
    };

    ws.send(JSON.stringify(messageData));

    // const chatMessages = document.querySelector(`#chat-${user.username} .chat-box-messages`);
    // const messageElement = document.createElement('p');
    // const time = document.createElement('sub')
    // const date = new Date(messageData.timestamp);
    // const formattedTime = date.toLocaleString();
    // time.textContent = formattedTime
    // messageElement.textContent = `${message}`;
    // messageElement.classList.add('sent-message')
    // time.classList.add('sent-time')
    // chatMessages.appendChild(messageElement);
    // chatMessages.appendChild(time)
    messageInput.value = '';
    // chatMessages.scrollTop = chatMessages.scrollHeight
}


export let offset = 0
export function GetMessages(receiver, chatContainer, scroll) {
    // const limit = 10
    const senderID = localStorage.getItem("xyz")
    const scrollPosition = chatContainer.scrollTop;
    const oldScrollHeight = chatContainer.scrollHeight;
    console.log(senderID);
    fetch(`/api/chat/messages?sender=${senderID}&receiver=${receiver}&offset=${offset}`, { credentials: "include" })
        .then(response => {
            if (!response.ok) {
                throw new Error('Problem fetching messages: ' + response.status);
            }
            return response.json();
        })
        .then(messages => {
            console.log('Old messages:', messages);
            if (!messages) {
                const messageElement = document.createElement('p');
                messageElement.textContent = `No messages yet!`;
                chatContainer.appendChild(messageElement);
                return;
            }
            messages.forEach(msg => {
                setMessage(chatContainer, msg, receiver, true)
                offset += 1
            });

            if (!scroll) {
                chatContainer.scrollTop = chatContainer.scrollHeight;
                console.log(chatContainer.scrollTop);
                
            } else {
                const newScrollHeight = chatContainer.scrollHeight;
                const scrollHeightDiff = newScrollHeight - oldScrollHeight;
                chatContainer.scrollTop = scrollPosition + scrollHeightDiff;
            }
        })
        .catch(error => console.error('Problem fetching messages:', error));

}

const throttle = (func, num) => {
    let wait = false;
    return (...args) => {
        if (!wait) {
            func(...args)
            wait = true
        }
        setTimeout(() => {
            wait = false
        }, num)
    }
}