
# AGENTS.md — Codex Development Instructions

## 1. Primary Rule: Follow the User's Prompt

- Implement ONLY what the user's current prompt explicitly requests.
- Do not add features, pages, components, integrations, documentation, or functionality beyond the prompt.
- Do not assume previously discussed features are required for the current task.
- If a necessary requirement is unclear, ask a concise question rather than inventing features.
- Make only the changes necessary to fulfill the prompt.
- Preserve existing working functionality.
- Do not automatically proceed to another development phase.

## 2. Technology Stack

Use the following technologies unless the user explicitly requests otherwise:

- HTML5 — Page structure and semantic markup.
- Tailwind CSS v4 — Frontend styling.
- Vanilla JavaScript (ES6+) — Application logic and interactions.
- Git and GitHub — Version control when requested.

Tailwind CSS v4 browser CDN:

<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>

Do not introduce additional frameworks, backend technologies, databases, build tools, or libraries unless requested or approved.

## 3. Read and Use Installed Skills

Before starting any task:

1. Check which relevant Codex skills are installed.
2. Read the relevant skill's SKILL.md file.
3. Follow its instructions while completing the user's prompt.
4. Use only skills relevant to the requested task.
5. Do not install missing skills without permission.

### Preferred Skills

**frontend-design**
- Use for requested frontend design and styling tasks.
- Follow its SKILL.md instructions.

**web-design-guidelines**
- Use for requested UI reviews, accessibility, and usability guidance.
- Follow its SKILL.md instructions.

**playwright-cli**
- Use for requested browser testing and verification.
- Follow its SKILL.md instructions.

### Important Skill Rules

- Skills guide HOW to implement the user's request.
- Skills do not authorize adding extra features.
- Do not force unrelated skills into a task.
- If a skill is unavailable, report it briefly and continue when possible.
- User instructions and AGENTS.md take priority over conflicting third-party skill suggestions.

## 4. Implementation Standards

- Write clean, readable, maintainable code.
- Use semantic HTML and accessible controls when applicable.
- Use Tailwind CSS v4 for styling.
- Use Vanilla JavaScript for requested functionality.
- Follow the existing project structure.
- Avoid unnecessary files and dependencies.
- Do not refactor unrelated code.
- Test the behavior relevant to the requested change.
- Never claim tests passed unless they were executed.

## 5. Git and Submission Restrictions

- Do not commit, push, publish, deploy, or create pull requests unless explicitly instructed.
- Never submit the project or examination requirements.
- Do not upload files or links to school portals, LMS platforms, or instructors.
- The students are responsible for final submission.
- Do not claim any work was submitted.

## 6. Response After Each Task

Briefly report:

- What was changed.
- Files modified.
- Tests actually performed.
- Any issues or blockers.

Stop after completing the requested task and wait for the next prompt.
