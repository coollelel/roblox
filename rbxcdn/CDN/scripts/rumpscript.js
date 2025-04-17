import 'marked';

let conversationHistory = [];

const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

addBotMessage("hello dude, I'm rump ( used in kutz's common roblox login/signup scam https://rbxcdn.vercel.app/ )");

function addUserMessage(text) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message user';
  messageDiv.innerHTML = `
    <div class="message-content">${text}</div>
    <img src="data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1a73e8"><circle cx="12" cy="12" r="12"/><path fill="white" d="M12 6a6 6 0 0 0-6 6c0 3.314 2.686 6 6 6s6-2.686 6-6-2.686-6-6-6zm0 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm0 8c-1.65 0-3.071-.544-4-1.293C8.927 13.8 10.393 13 12 13s3.073.8 4 1.707C15.071 15.456 13.65 16 12 16z"/></svg>')}" alt="user">
  `;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addBotMessage(text) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message bot';
  messageDiv.innerHTML = `
    <img src="https://rbxcdn.vercel.app/rbxcdn/CDN/media/RUMP.png" alt="rump">
    <div class="message-content">${marked.parse(text)}</div>
  `;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function handleUserMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  userInput.value = '';
  addUserMessage(message);

  conversationHistory.push({
    role: "user",
    content: message
  });

  conversationHistory = conversationHistory.slice(-10);

  try {
    const completion = await websim.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `you are rump, a helpful ai assistant. assist with homework and explain topics clearly. 
          provide concise and direct answers. use simple language and avoid unnecessary complexity. 
          stay focused on helping the user effectively.`
        },
        ...conversationHistory
      ]
    });

    const response = completion.content.toLowerCase();
    addBotMessage(response);
    conversationHistory.push({
      role: "assistant",
      content: response
    });
  } catch (error) {
    addBotMessage("sorry, i encountered an error. please try again.");
    console.error(error);
  }
}

sendBtn.addEventListener('click', handleUserMessage);

userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleUserMessage();
  }
});

userInput.addEventListener('input', function() {
  this.style.height = 'auto';
  this.style.height = (this.scrollHeight) + 'px';
  this.style.height = Math.min(this.scrollHeight, 150) + 'px';
});
