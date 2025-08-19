class NextAIWidget {
  constructor() {
    this.conversationId = "689a07798dc0b128b02b452f"; // Fake for now
    this.messagesBox = null;
    this.input = null;
    this.sendBtn = null;
    this.closeBtn = null;
    this.widget = null;
    this.toggleBtn = null;

    this.init();
  }

  init() {
    this.injectCSS();
    this.createToggleButton();
    this.createWidget();
    this.bindEvents();
  }

  injectCSS() {
    const widgetCSS = `
      .nextai-toggle {
        position: fixed; bottom: 24px; right: 24px; width: 60px; height: 60px;
        background: linear-gradient(135deg, #8231D3, #5b1b97);
        border-radius: 50%; display: flex; align-items: center; justify-content: center;
        cursor: pointer; box-shadow: 0 8px 20px rgba(0,0,0,0.25);
        z-index: 9999; transition: transform 0.25s ease;
        animation: pulse 1.8s infinite;
      }
      .nextai-widget {
        width: 400px; height: 560px; position: fixed; bottom: 100px; right: 24px;
        border-radius: 22px; box-shadow: 0 16px 40px rgba(0,0,0,0.28);
        font-family: "Segoe UI", Arial, sans-serif; display: flex; flex-direction: column;
        background: #fff; overflow: hidden; z-index: 9999; transform: scale(0);
        transform-origin: bottom right; transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
      }
      .nextai-header {
        background:linear-gradient(135deg,#8231D3,#5b1b97);color:white;
        padding:16px 18px;font-size:16px;font-weight:600;display:flex;align-items:center;
        justify-content:space-between;box-shadow:0 2px 6px rgba(0,0,0,0.25)
      }
      .nextai-messages {
        flex:1;padding:16px;overflow-y:auto;font-size:14px;line-height:1.5;
        background:#f9fafb;scrollbar-width:thin;scrollbar-color:#d1d5db transparent
      }
      .nextai-input {
        display:flex;gap:8px;border-top:1px solid #e5e7eb;background:#fff;padding:10px 12px
      }
      .nextai-input input {
        flex:1;border:1px solid #d1d5db;border-radius:20px;padding:10px 14px;outline:none;font-size:14px;
        transition:border 0.2s, box-shadow 0.2s;
      }
      .nextai-input input:focus { border-color:#8231D3; box-shadow:0 0 0 2px rgba(130,49,211,0.2); }
      .nextai-input button {
        border:none;background:linear-gradient(135deg,#8231D3,#5b1b97);color:white;
        padding:0 14px;cursor:pointer;border-radius:20px;box-shadow:0 3px 8px rgba(0,0,0,0.15);
        display:flex;align-items:center;justify-content:center;transition:transform 0.2s ease
      }
      .nextai-input button:hover { transform: scale(1.1); }
      #chat-close:hover { opacity:1; }
  
      /* message bubbles */
      .nextai-msg-wrapper { display:flex; margin:8px 0; }
      .nextai-msg {
        max-width:75%; padding:10px 14px; border-radius:18px;
        word-wrap:break-word; font-size:14px;
        box-shadow:0 2px 6px rgba(0,0,0,0.08); animation:fadeInUp 0.25s ease;
        display:flex; flex-direction:column;
      }
      .nextai-msg.user {
        margin-left:auto; background:linear-gradient(135deg,#8231D3,#5b1b97); color:white;
        border-bottom-right-radius:6px;
      }
      .nextai-msg.ai {
        margin-right:auto; background:#e5e7eb; color:#111827;
        border-bottom-left-radius:6px;
      }
  
      /* typing */
      .nextai-typing { margin:8px 0; }
      .nextai-typing .bubble {
        padding:10px 14px; background:#e5e7eb; color:#111827;
        border-radius:18px; display:inline-block; animation: fadeInUp 0.25s ease;
      }
  
      /* loading + error */
      .nextai-loading, .nextai-error {
        display:flex; align-items:center; justify-content:center;
        height:100%; font-size:14px; text-align:center;
      }
      .nextai-loading { color:#666; }
      .nextai-error { color:red; padding:12px 16px; }
  
      /* animations */
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
    `;

    const createHTML = (html) =>
      (window.trustedTypes?.createPolicy("nextai-widget", { createHTML: (s) => s }) || { createHTML: (s) => s }).createHTML(html);

    const style = document.createElement("style");
    style.innerHTML = createHTML(widgetCSS);
    document.head.appendChild(style);

    this.createHTML = createHTML;
  }

  createToggleButton() {
    this.toggleBtn = document.createElement("div");
    this.toggleBtn.className = "nextai-toggle";
    this.toggleBtn.innerHTML = this.createHTML(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="28" height="28">
        <path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
      </svg>`);

    this.toggleBtn.addEventListener("mouseenter", () => (this.toggleBtn.style.transform = "scale(1.15)"));
    this.toggleBtn.addEventListener("mouseleave", () => (this.toggleBtn.style.transform = "scale(1)"));
    this.toggleBtn.addEventListener("click", () => this.toggleWidget());

    document.body.appendChild(this.toggleBtn);
  }

  createWidget() {
    this.widget = document.createElement("div");
    this.widget.className = "nextai-widget";
    this.widget.innerHTML = this.createHTML(`
      <div class="nextai-header">
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
      <div id="chat-messages" class="nextai-messages"></div>
      <div class="nextai-input">
        <input id="chat-input" type="text" placeholder="Type a message..."/>
        <button id="chat-send">
          <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="22" height="22">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
    `);

    document.body.appendChild(this.widget);

    this.messagesBox = this.widget.querySelector("#chat-messages");
    this.input = this.widget.querySelector("#chat-input");
    this.sendBtn = this.widget.querySelector("#chat-send");
    this.closeBtn = this.widget.querySelector("#chat-close");
  }

  bindEvents() {
    this.sendBtn.addEventListener("click", () => this.sendMessage());
    this.input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.sendMessage();
    });
    this.closeBtn.addEventListener("click", () => (this.widget.style.transform = "scale(0)"));
  }

  toggleWidget() {
    const isOpen = this.widget.style.transform === "scale(1)";
    this.widget.style.transform = isOpen ? "scale(0)" : "scale(1)";
    if (!isOpen) this.loadMessages();
  }

  addMessage(text, sender, createdAt) {
    const div = document.createElement("div");
    div.className = `nextai-msg ${sender === "User" ? "user" : "ai"}`;
    div.textContent = text;

    const wrapper = document.createElement("div");
    wrapper.className = "nextai-msg-wrapper";
    wrapper.title = new Date(createdAt || Date.now()).toLocaleString();

    wrapper.appendChild(div);
    this.messagesBox.appendChild(wrapper);
    this.messagesBox.scrollTop = this.messagesBox.scrollHeight;
  }

  showTyping() {
    const typingDiv = document.createElement("div");
    typingDiv.id = "typing";
    typingDiv.className = "nextai-typing";
    typingDiv.innerHTML = this.createHTML(`
      <div class="bubble"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>
    `);
    this.messagesBox.appendChild(typingDiv);
    this.messagesBox.scrollTop = this.messagesBox.scrollHeight;
  }

  removeTyping() {
    const typingDiv = document.getElementById("typing");
    if (typingDiv) typingDiv.remove();
  }

  sendMessage() {
    const text = this.input.value.trim();
    if (!text) return;

    this.addMessage(text, "User", Date.now());
    this.input.value = "";
    this.showTyping();

    fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: { content: text, conversation: this.conversationId, owner: "User" },
      }),
    })
      .then((res) => res.text())
      .then((data) => {
        this.removeTyping();
        this.addMessage(data || "No response", "AI", Date.now());
      })
      .catch((err) => {
        this.removeTyping();
        this.addMessage("Error: " + err.message, "AI", Date.now());
      });
  }

  showLoading() {
    this.messagesBox.innerHTML = `<div class="nextai-loading">Loading messages...</div>`;
  }

  loadMessages() {
    this.showLoading();
    fetch(`/api/conversations/${this.conversationId}/messages`)
      .then((res) => res.json())
      .then((data) => {
        this.messagesBox.innerHTML = "";
        (data || []).forEach((msg) => {
          const sender = msg.owner === "AI" ? "AI" : "User";
          this.addMessage(msg.content, sender, msg.createdAt);
        });
      })
      .catch(() => {
        this.messagesBox.innerHTML = `<div class="nextai-error">Failed to load messages.</div>`;
      });
  }
}

(() => {
  new NextAIWidget();
})();
