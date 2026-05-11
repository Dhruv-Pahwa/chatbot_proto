/* ===================================================
   ECHO CHATBOT WIDGET — Embeddable JavaScript
   Drop this + chatbot.css + the HTML block into any page.
   
   Config: set ECHO_CHAT_URL before loading this script
   to point to your backend, e.g.:
     window.ECHO_CHAT_URL = "https://your-server.com/chat";
   Default: "/chat" (same origin)
   =================================================== */

(function () {
    "use strict";

    const CHAT_URL = window.ECHO_CHAT_URL || "/chat";

    const fab = document.getElementById("echoFab");
    const win = document.getElementById("echoWindow");
    const closeBtn = document.getElementById("echoClose");
    const form = document.getElementById("echoForm");
    const input = document.getElementById("echoInput");
    const messages = document.getElementById("echoMessages");

    if (!fab || !win) return;

    // --- Toggle ---
    fab.addEventListener("click", () => {
        win.classList.add("open");
        fab.classList.add("hidden");
        input?.focus();
    });

    closeBtn?.addEventListener("click", () => {
        win.classList.remove("open");
        fab.classList.remove("hidden");
    });

    // --- Add message bubble ---
    function addMsg(text, isUser) {
        const div = document.createElement("div");
        div.className = "echo-msg " + (isUser ? "echo-user" : "echo-bot");
        div.innerHTML = `<div class="echo-msg-bubble">${escapeHtml(text)}</div>`;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }

    // --- Typing indicator ---
    function showTyping() {
        const div = document.createElement("div");
        div.className = "echo-msg echo-bot echo-typing-msg";
        div.innerHTML = `<div class="echo-typing"><span></span><span></span><span></span></div>`;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
        return div;
    }

    // --- Escape HTML to prevent XSS in displayed messages ---
    function escapeHtml(str) {
        const d = document.createElement("div");
        d.textContent = str;
        return d.innerHTML;
    }

    // --- Send message ---
    async function send(text) {
        text = text.trim();
        if (!text) return;

        addMsg(text, true);
        input.value = "";
        const typing = showTyping();

        try {
            const res = await fetch(CHAT_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text, context: "general" }),
            });
            const data = await res.json();
            typing.remove();
            addMsg(data.reply || "No response received.", false);
        } catch (err) {
            typing.remove();
            addMsg("Sorry, couldn't connect. Please try again.", false);
        }
    }

    // --- Form submit ---
    form?.addEventListener("submit", (e) => {
        e.preventDefault();
        send(input.value);
    });
})();
