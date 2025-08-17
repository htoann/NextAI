(function () {
  const conversationId = '689a07798dc0b128b02b452f';

  // Floating toggle button
  const toggleBtn = document.createElement('div');
  toggleBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="28" height="28">
      <path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
    </svg>`;
  toggleBtn.style.cssText = `
    position: fixed; bottom: 24px; right: 24px; width: 60px; height: 60px;
    background: linear-gradient(135deg, #8231D3, #5b1b97);
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    cursor: pointer; box-shadow: 0 8px 20px rgba(0,0,0,0.25);
    z-index: 9999; transition: transform 0.25s ease;
    animation: pulse 1.8s infinite;
  `;
  toggleBtn.addEventListener('mouseenter', () => (toggleBtn.style.transform = 'scale(1.15)'));
  toggleBtn.addEventListener('mouseleave', () => (toggleBtn.style.transform = 'scale(1)'));
  document.body.appendChild(toggleBtn);

  // Chat widget
  const widget = document.createElement('div');
  widget.style.cssText = `
    width: 400px; height: 560px; position: fixed; bottom: 100px; right: 24px;
    border-radius: 22px; box-shadow: 0 16px 40px rgba(0,0,0,0.28);
    font-family: "Segoe UI", Arial, sans-serif; display: flex; flex-direction: column;
    background: #fff; overflow: hidden; z-index: 9999; transform: scale(0);
    transform-origin: bottom right; transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
  `;
  widget.innerHTML = `
    <div style="background:linear-gradient(135deg,#8231D3,#5b1b97);color:white;
      padding:16px 18px;font-size:16px;font-weight:600;display:flex;align-items:center;
      justify-content:space-between;box-shadow:0 2px 6px rgba(0,0,0,0.25)">
      <span style="display:flex;align-items:center;gap:6px">
        <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="20" height="20">
          <path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
        </svg>
        Chat Assistant
      </span>
      <span id="chat-close" style="cursor:pointer;display:flex;align-items:center;opacity:0.85;transition:opacity 0.2s">
        <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="24" height="24">
          <path d="M12 2a10 10 0 1010 10A10.011 10.011 0 0012 2zm3.71 13.29a1 1 0 01-1.42 1.42L12 13.41l-2.29 2.3a1 1 0 01-1.42-1.42L10.59 12 8.29 9.71a1 1 0 011.42-1.42L12 10.59l2.29-2.3a1 1 0 011.42 1.42L13.41 12z"/>
        </svg>
      </span>
    </div>
    <div id="chat-messages" style="flex:1;padding:16px;overflow-y:auto;
      font-size:14px;line-height:1.5;background:#f9fafb;scrollbar-width:thin;
      scrollbar-color:#d1d5db transparent"></div>
    <div style="display:flex;gap:8px;border-top:1px solid #e5e7eb;background:#fff;padding:10px 12px">
      <input id="chat-input" type="text" placeholder="Type a message..."
        style="flex:1;border:1px solid #d1d5db;border-radius:20px;padding:10px 14px;outline:none;font-size:14px;
        transition:border 0.2s, box-shadow 0.2s"/>
      <button id="chat-send"
        style="border:none;background:linear-gradient(135deg,#8231D3,#5b1b97);color:white;
        padding:0 14px;cursor:pointer;border-radius:20px;box-shadow:0 3px 8px rgba(0,0,0,0.15);
        display:flex;align-items:center;justify-content:center;transition:transform 0.2s ease">
        <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="22" height="22">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
        </svg>
      </button>
    </div>
  `;
  document.body.appendChild(widget);

  const messagesBox = widget.querySelector('#chat-messages');
  const input = widget.querySelector('#chat-input');
  const sendBtn = widget.querySelector('#chat-send');
  const closeBtn = widget.querySelector('#chat-close');

  const addMessage = (text, sender, createdAt) => {
    const div = document.createElement('div');
    div.style.maxWidth = '75%';
    div.style.padding = '10px 14px';
    div.style.borderRadius = '18px';
    div.style.wordWrap = 'break-word';
    div.style.fontSize = '14px';
    div.style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)';
    div.style.animation = 'fadeInUp 0.25s ease';
    div.style.display = 'flex';
    div.style.flexDirection = 'column';

    const textNode = document.createElement('div');
    textNode.textContent = text;
    div.appendChild(textNode);

    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.margin = '8px 0';

    const timeString = new Date(createdAt || Date.now()).toLocaleString();
    wrapper.title = timeString;

    if (sender === 'user') {
      wrapper.style.justifyContent = 'flex-end';
      div.style.background = 'linear-gradient(135deg,#8231D3,#5b1b97)';
      div.style.color = 'white';
      div.style.borderBottomRightRadius = '6px';
    } else {
      wrapper.style.justifyContent = 'flex-start';
      div.style.background = '#e5e7eb';
      div.style.color = '#111827';
      div.style.borderBottomLeftRadius = '6px';
    }

    wrapper.appendChild(div);
    messagesBox.appendChild(wrapper);
    messagesBox.scrollTop = messagesBox.scrollHeight;
  };

  const showTyping = () => {
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing';
    typingDiv.style.cssText = `
      margin:8px 0; padding:10px 14px; background:#e5e7eb; color:#111827;
      border-radius:18px; display:inline-block; animation: fadeInUp 0.25s ease;
    `;
    typingDiv.innerHTML = `<span class="dot"></span><span class="dot"></span><span class="dot"></span>`;
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.justifyContent = 'flex-start';
    wrapper.appendChild(typingDiv);
    messagesBox.appendChild(wrapper);
    messagesBox.scrollTop = messagesBox.scrollHeight;
  };

  const removeTyping = () => {
    const typingDiv = document.getElementById('typing');
    if (typingDiv) typingDiv.parentElement.remove();
  };

  const sendMessage = () => {
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, 'user', Date.now());
    input.value = '';
    showTyping();

    fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: { content: text, conversation: conversationId, owner: 'User' },
      }),
    })
      .then((res) => res.text())
      .then((data) => {
        removeTyping();
        addMessage(data || 'No response', 'bot', Date.now());
      })
      .catch((err) => {
        removeTyping();
        addMessage('Error: ' + err.message, 'bot', Date.now());
      });
  };

  const showLoading = () => {
    messagesBox.innerHTML = '';
    const loadingDiv = document.createElement('div');
    loadingDiv.style.cssText = `
      display: flex; align-items: center; justify-content: center;
      height: 100%; color:#666; font-size:14px; text-align:center;
    `;
    loadingDiv.textContent = 'Loading messages...';
    loadingDiv.id = 'loading-messages';
    messagesBox.appendChild(loadingDiv);
  };

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
  closeBtn.addEventListener('click', () => (widget.style.transform = 'scale(0)'));

  toggleBtn.addEventListener('click', () => {
    const isOpen = widget.style.transform === 'scale(1)';
    widget.style.transform = isOpen ? 'scale(0)' : 'scale(1)';

    if (!isOpen) {
      showLoading();
      fetch(`/api/conversations/${conversationId}/messages`)
        .then((res) => res.json())
        .then((data) => {
          messagesBox.innerHTML = '';
          (data || []).forEach((msg) => {
            const sender = msg.owner === 'User' ? 'user' : 'bot';
            addMessage(msg.content, sender, msg.createdAt);
          });
        })
        .catch(() => {
          messagesBox.innerHTML = '';
          const errorDiv = document.createElement('div');
          errorDiv.style.cssText = 'padding:12px 16px; color:red; text-align:center;';
          errorDiv.textContent = 'Failed to load messages.';
          messagesBox.appendChild(errorDiv);
        });
    }
  });

  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(130,49,211,0.5); }
      70% { box-shadow: 0 0 0 20px rgba(130,49,211,0); }
      100% { box-shadow: 0 0 0 0 rgba(130,49,211,0); }
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .dot { height:7px;width:7px;margin:0 2px;background:#666;border-radius:50%;
      display:inline-block; animation: blink 1.4s infinite both; }
    .dot:nth-child(2){ animation-delay:0.2s; }
    .dot:nth-child(3){ animation-delay:0.4s; }
    @keyframes blink {
      0%,80%,100% { transform:scale(0.6); opacity:0.4; }
      40% { transform:scale(1); opacity:1; }
    }
    #chat-input:focus { border-color:#8231D3; box-shadow:0 0 0 2px rgba(130,49,211,0.2); }
    #chat-send:hover { transform: scale(1.1); }
    #chat-close:hover { opacity:1; }
  `;
  document.head.appendChild(style);
})();
