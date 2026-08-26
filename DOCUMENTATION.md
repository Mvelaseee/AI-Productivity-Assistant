# AI-Powered Workplace Productivity Assistant — Documentation

## Problem Statement

Professionals across industries lose significant time to repetitive workplace tasks: reading through messy meeting notes to extract what actually needs to happen next, figuring out how to prioritize a growing task list, and drafting routine written responses. This project builds an AI-driven assistant that automates three of these processes in a single, connected workflow.

## Solution Overview

The assistant is a browser-based tool with three integrated features, each backed by a live call to Claude (Anthropic's LLM) rather than static or mocked output:

1. **Meeting Notes Summarizer** — converts raw, unstructured meeting notes into a consistent structure: key points, decisions made, and action items (with owner and deadline called out explicitly, or flagged as "unspecified" if the notes don't state one).
2. **AI Task Planner** — takes a list of tasks (including action items copied straight from the summarizer output) plus a time horizon and any constraints, and returns a priority ranking, a time-blocked schedule, and short optimization tips.
3. **AI Chatbot Interface** — a general workplace assistant for ad-hoc requests (drafting emails, quick questions), scoped to redirect sensitive topics (legal, medical, financial) to a qualified professional.

The three features are designed to work as a pipeline rather than three separate tools: notes go in, structured action items come out, those items feed the planner, and the chatbot can be used to query or refine either output — modeling how a real workplace assistant would be used across a day.

## Tools Used

- **Claude (Anthropic API, model: claude-sonnet-4-6)** — powers all three features via the `/v1/messages` endpoint
- **HTML/CSS/JavaScript** — single-file front end, no build step, runs in any browser
- Design informed by the CAPACITI AI Skill Accelerator brief's five core feature options

## Sample Prompts (system prompts used)

**Meeting Notes Summarizer:**
> You are a meeting notes summarizer for a workplace productivity assistant. Given raw, possibly messy meeting notes, produce a structured summary with exactly these sections: 1. Key Points... 2. Decisions Made... 3. Action Items (format each as "- [Owner]: Task (Deadline: X)"; if an owner or deadline is not stated, write "unspecified" rather than inventing one). Do not add information that is not present or reasonably implied in the notes.

**AI Task Planner:**
> You are an AI task planner... produce a prioritized, structured plan: 1. Priority order with reasons, 2. A schedule broken into the given horizon, 3. Time optimization tips. Respect any stated constraints exactly. Do not invent deadlines or urgency that wasn't stated — if urgency is unclear, say so and make a reasonable default assumption explicit.

**Assistant Chatbot:**
> You are a helpful, concise workplace productivity assistant chatbot... If asked something outside workplace productivity (legal, medical, financial advice), give general information only and note the person should confirm with a qualified professional.

Each prompt was iterated to explicitly forbid fabrication (invented deadlines, owners, or urgency) — this was the single biggest lever for output quality and trustworthiness.

## Responsible AI / Ethical Considerations

- **Anti-hallucination instructions**: all prompts instruct the model to flag missing information ("unspecified") rather than guess, reducing the risk of incorrect deadlines or owners being acted on.
- **Scope limiting**: the chatbot is explicitly instructed to avoid giving authoritative legal, medical, or financial advice.
- **Visible disclaimers**: each feature displays an in-UI disclaimer reminding the user to verify AI output before acting on it (e.g. checking action items against original notes).
- **Known limitations**: the model can still misread ambiguous notes, and prioritization logic reflects only the information given — it can't account for unstated office context or politics. Users should treat all outputs as a first draft, not a final decision.

## Challenges and Solutions

- **Challenge**: early prompt drafts caused the model to invent plausible-sounding but unstated deadlines and owners.
  **Solution**: added explicit instructions to output "unspecified" instead of guessing, verified by testing with intentionally sparse notes.
- **Challenge**: keeping the three features feeling like one product rather than three disconnected demos.
  **Solution**: designed the task planner's input to directly accept the summarizer's action-item output, and gave the chatbot context about both other features in its system prompt.
