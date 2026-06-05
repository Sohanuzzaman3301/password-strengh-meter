---
name: playwright-mcp
description: Use when an agent should run browser automation via a local Playwright MCP server. Triggers on requests mentioning Playwright, browser automation, or end-to-end testing.
---

# Playwright MCP Skill

This skill enables agents to interact with a Playwright MCP server for browser automation tasks such as navigation, clicking, filling forms, and taking screenshots.

Use ONLY when the user explicitly requests browser automation, end-to-end testing, or Playwright-specific actions. Keep responses short and delegate execution to the MCP server.

Examples:

- "Run the login flow on /login and take a screenshot"
- "Open the homepage, click the sign up button, and fill the form"

Behavior:

- The skill maps high-level user requests to Playwright MCP actions and returns the MCP server's result or a short summary.
- Do not attempt to execute browser automation locally; always route through the configured MCP server.

Compatibility:

- Expects an MCP server named `playwright` to be configured in opencode.json under `mcp` (see examples in opencode docs).

References:

- Playwright MCP: https://playwright.dev/docs/mcp
