export const chatboxSnippet = `(function () {
  // Floating toggle button
  const toggleBtn = document.createElement("div");
  toggleBtn.innerHTML = "💬";
  toggleBtn.style.cssText = \`
    position: fixed; bottom: 24px; right: 24px; width: 60px; height: 60px;
    background: linear-gradient(135deg, #8231D3, #5e2399);
    color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 26px; cursor: pointer; box-shadow: 0 8px 20px rgba(0,0,0,0.25);
    z-index: 9999; transition: transform 0.25s ease, box-shadow 0.25s ease;
    animation: pulse 1.8s infinite;
  \`;
  toggleBtn.onmouseenter = () => (toggleBtn.style.transform = "scale(1.1)");
  toggleBtn.onmouseleave = () => (toggleBtn.style.transform = "scale(1)");
  document.body.appendChild(toggleBtn);

  // Chat widget container
  const widget = document.createElement("div");
  widget.style.cssText = \`
    width: 380px; height: 520px; position: fixed; bottom: 100px; right: 24px;
    border-radius: 20px; box-shadow: 0 12px 40px rgba(0,0,0,0.25);
    font-family: "Segoe UI", Arial, sans-serif; display: flex; flex-direction: column;
    background: #fff; overflow: hidden; z-index: 9999; transform: scale(0);
    transform-origin: bottom right; transition: transform 0.3s ease-in-out;
  \`;
  widget.innerHTML = \`
    <div style="background:linear-gradient(135deg,#8231D3,#5e2399);color:white;
      padding:14px 16px;font-size:15px;font-weight:600;display:flex;align-items:center;
      justify-content:space-between;box-shadow:0 2px 6px rgba(0,0,0,0.2)">
      <span>💬 Chat Assistant</span>
      <span style="cursor:pointer;font-size:18px;" id="chat-close">✖</span>
    </div>
    <div id="chat-messages" style="flex:1;padding:16px;overflow-y:auto;
      font-size:14px;line-height:1.5;background:#f9fafb;scrollbar-width:thin;
      scrollbar-color:#d1d5db transparent"></div>
    <div style="display:flex;border-top:1px solid #e5e7eb;background:#fff;padding:8px 10px">
      <input id="chat-input" type="text" placeholder="Type a message..."
        style="flex:1;border:1px solid #d1d5db;border-radius:18px;padding:10px 14px;outline:none;font-size:14px;
        margin-right:8px;transition:border 0.2s"/>
      <button id="chat-send"
        style="border:none;background:linear-gradient(135deg,#8231D3,#5e2399);color:white;
        padding:0 18px;cursor:pointer;font-size:16px;border-radius:18px;box-shadow:0 2px 6px rgba(0,0,0,0.15);
        transition:background 0.25s">
        ➤
      </button>
    </div>
  \`;
  document.body.appendChild(widget);

  const messages = widget.querySelector("#chat-messages");
  const input = widget.querySelector("#chat-input");
  const sendBtn = widget.querySelector("#chat-send");
  const closeBtn = widget.querySelector("#chat-close");

  function addMessage(text, sender) {
    const div = document.createElement("div");
    div.style.maxWidth = "75%";
    div.style.padding = "10px 14px";
    div.style.borderRadius = "18px";
    div.style.wordWrap = "break-word";
    div.style.fontSize = "14px";
    div.style.boxShadow = "0 2px 6px rgba(0,0,0,0.08)";

    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.margin = "8px 0";

    if (sender === "user") {
      wrapper.style.justifyContent = "flex-end";
      div.style.background = "linear-gradient(135deg,#8231D3,#5e2399)";
      div.style.color = "white";
      div.style.borderBottomRightRadius = "6px";
    } else {
      wrapper.style.justifyContent = "flex-start";
      div.style.background = "#e5e7eb";
      div.style.color = "#111827";
      div.style.borderBottomLeftRadius = "6px";
    }

    div.textContent = text;
    wrapper.appendChild(div);
    messages.appendChild(wrapper);
    messages.scrollTop = messages.scrollHeight;
  }

  function showTyping() {
    const typingDiv = document.createElement("div");
    typingDiv.id = "typing";
    typingDiv.style.cssText = \`
      margin:8px 0; padding:10px 14px; background:#e5e7eb; color:#111827;
      border-radius:18px; display:inline-block;
    \`;
    typingDiv.innerHTML = \`<span class="dot"></span><span class="dot"></span><span class="dot"></span>\`;
    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.justifyContent = "flex-start";
    wrapper.appendChild(typingDiv);
    messages.appendChild(wrapper);
    messages.scrollTop = messages.scrollHeight;
  }
  function removeTyping() {
    const typingDiv = document.getElementById("typing");
    if (typingDiv) typingDiv.parentElement.remove();
  }

  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, "user");
    input.value = "";
    showTyping();
    setTimeout(() => {
      removeTyping();
      addMessage("Echo: " + text, "bot");
    }, 1000);
  }

  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
  closeBtn.addEventListener("click", () => (widget.style.transform = "scale(0)"));
  toggleBtn.addEventListener("click", () => {
    widget.style.transform =
      widget.style.transform === "scale(1)" ? "scale(0)" : "scale(1)";
  });

  const style = document.createElement("style");
  style.innerHTML = \`
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(130,49,211,0.5); }
      70% { box-shadow: 0 0 0 18px rgba(130,49,211,0); }
      100% { box-shadow: 0 0 0 0 rgba(130,49,211,0); }
    }
    .dot { height:6px;width:6px;margin:0 2px;background:#555;border-radius:50%;
      display:inline-block; animation: blink 1.4s infinite both; }
    .dot:nth-child(2){ animation-delay:0.2s; }
    .dot:nth-child(3){ animation-delay:0.4s; }
    @keyframes blink {
      0%,80%,100% { transform:scale(0.6); opacity:0.4; }
      40% { transform:scale(1); opacity:1; }
    }
    #chat-input:focus { border-color:#8231D3; }
  \`;
  document.head.appendChild(style);
})();`;
