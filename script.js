async function callClaude(systemPrompt, userMessage) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }]
    })
  });
  if (!response.ok) throw new Error("API request failed (" + response.status + ")");
  const data = await response.json();
  const textBlock = data.content.find(b => b.type === "text");
  return textBlock ? textBlock.text : "(no response)";
}

// Tabs
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById("panel-" + tab.dataset.tab).classList.add("active");
  });
});

// --- Meeting Notes Summarizer ---
const summarizeBtn = document.getElementById("summarizeBtn");
summarizeBtn.addEventListener("click", async () => {
  const notes = document.getElementById("notesInput").value.trim();
  const errorEl = document.getElementById("summarizeError");
  const outputEl = document.getElementById("summarizeOutput");
  errorEl.textContent = "";
  if (!notes) { errorEl.textContent = "Paste some meeting notes first."; return; }

  summarizeBtn.disabled = true;
  outputEl.style.display = "block";
  outputEl.textContent = "Summarizing...";
  outputEl.classList.add("loading");

  const systemPrompt = `You are a meeting notes summarizer for a workplace productivity assistant.
Given raw, possibly messy meeting notes, produce a structured summary with exactly these sections:
1. Key Points (2-4 bullets, the core discussion topics)
2. Decisions Made (bullets, or "None recorded" if none are clear)
3. Action Items (format each as "- [Owner]: Task (Deadline: X)"; if an owner or deadline is not stated, write "unspecified" rather than inventing one)
Be concise. Do not add information that is not present or reasonably implied in the notes. If the notes are too sparse to extract something, say so plainly instead of guessing.`;

  try {
    const result = await callClaude(systemPrompt, notes);
    outputEl.classList.remove("loading");
    outputEl.textContent = result;
  } catch (e) {
    outputEl.style.display = "none";
    errorEl.textContent = "Something went wrong generating the summary. Try again.";
  } finally {
    summarizeBtn.disabled = false;
  }
});

// --- Task Planner ---
const planBtn = document.getElementById("planBtn");
planBtn.addEventListener("click", async () => {
  const tasks = document.getElementById("tasksInput").value.trim();
  const horizon = document.getElementById("planHorizon").value;
  const context = document.getElementById("planContext").value.trim();
  const errorEl = document.getElementById("planError");
  const outputEl = document.getElementById("planOutput");
  errorEl.textContent = "";
  if (!tasks) { errorEl.textContent = "Add at least one task first."; return; }

  planBtn.disabled = true;
  outputEl.style.display = "block";
  outputEl.textContent = "Building your plan...";
  outputEl.classList.add("loading");

  const systemPrompt = `You are an AI task planner for a workplace productivity assistant.
Given a raw list of tasks, a time horizon, and optional constraints, produce a prioritized, structured plan.
Output format:
1. A short "Priority order" list, ranking tasks from most to least urgent/important, with a one-line reason for each ranking.
2. A structured schedule broken into the given horizon (if "today": Morning/Afternoon/Late-day blocks; if "this week": Monday-Friday), assigning tasks to realistic slots.
3. One or two brief "Time optimization tips" relevant to this specific task list (e.g. batching similar tasks, deep work blocks).
Respect any stated constraints exactly. Do not invent deadlines or urgency that wasn't stated or reasonably implied — if urgency is unclear, say so and make a reasonable default assumption explicit.`;

  const userMessage = `Tasks:\n${tasks}\n\nHorizon: ${horizon}\n${context ? "Constraints: " + context : ""}`;

  try {
    const result = await callClaude(systemPrompt, userMessage);
    outputEl.classList.remove("loading");
    outputEl.textContent = result;
  } catch (e) {
    outputEl.style.display = "none";
    errorEl.textContent = "Something went wrong generating the plan. Try again.";
  } finally {
    planBtn.disabled = false;
  }
});

// --- Chatbot ---
const chatLog = document.getElementById("chatLog");
const chatInput = document.getElementById("chatInput");
const chatSendBtn = document.getElementById("chatSendBtn");
const chatError = document.getElementById("chatError");
let chatHistory = [];

function addMsg(role, text) {
  const div = document.createElement("div");
  div.className = "msg " + (role === "user" ? "user" : "bot");
  div.textContent = text;
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
}

async function sendChat() {
  const text = chatInput.value.trim();
  chatError.textContent = "";
  if (!text) { chatError.textContent = "Type a message first."; return; }

  addMsg("user", text);
  chatHistory.push({ role: "user", content: text });
  chatInput.value = "";
  chatSendBtn.disabled = true;

  const thinkingDiv = document.createElement("div");
  thinkingDiv.className = "msg bot loading";
  thinkingDiv.textContent = "Thinking...";
  chatLog.appendChild(thinkingDiv);
  chatLog.scrollTop = chatLog.scrollHeight;

  const systemPrompt = `You are a helpful, concise workplace productivity assistant chatbot embedded in an internal tool.
You help with drafting emails, quick research summaries, task and scheduling questions, and general workplace productivity questions.
Keep answers practical and to the point. If asked something outside workplace productivity (legal, medical, financial advice), give general information only and note the person should confirm with a qualified professional.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system: systemPrompt,
        messages: chatHistory
      })
    });
    if (!response.ok) throw new Error("API request failed");
    const data = await response.json();
    const textBlock = data.content.find(b => b.type === "text");
    const reply = textBlock ? textBlock.text : "(no response)";
    thinkingDiv.remove();
    addMsg("bot", reply);
    chatHistory.push({ role: "assistant", content: reply });
  } catch (e) {
    thinkingDiv.remove();
    chatError.textContent = "Something went wrong. Try again.";
  } finally {
    chatSendBtn.disabled = false;
  }
}

chatSendBtn.addEventListener("click", sendChat);
chatInput.addEventListener("keydown", (e) => { if (e.key === "Enter") sendChat(); });
