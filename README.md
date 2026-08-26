# AI-Productivity-Assistant

An AI-powered workplace productivity assistant built for the CAPACITI AI Skill Accelerator Programme. It automates three common workplace tasks — meeting notes summarization, task planning, and general assistant chat — using live calls to Claude (Anthropic).

## Features

- **Meeting Notes Summarizer** — turns raw meeting notes into key points, decisions, and action items (with owner/deadline, or "unspecified" if not stated).
- **AI Task Planner** — turns a task list into a prioritized, time-blocked schedule with optimization tips.
- **AI Chatbot Interface** — a general workplace assistant for emails, quick questions, and follow-ups.

The three features are designed as a pipeline: summarize a meeting → feed the action items into the planner → ask the chatbot follow-up questions about either.

## How to run

This is a single self-contained HTML file — no build step or install required.

1. Download `ai-productivity-assistant.html`
2. Open it in any browser
3. Use the tabs to switch between the three features

> Note: the app calls the Anthropic API directly from the browser. If you're running this outside of the environment it was built in, you'll need to supply your own API key/proxy — see `ai-productivity-assistant.html` for the fetch call to `https://api.anthropic.com/v1/messages`.

## Project documentation

See [DOCUMENTATION.md](./DOCUMENTATION.md) for the full write-up: problem statement, solution overview, tools used, sample prompts, responsible AI considerations, and challenges/solutions.

## Built for

CAPACITI AI Skill Accelerator Programme — AI-Powered Workplace Productivity Assistant project brief.
