
# Mid QA Engineer — Technical Assignment

Welcome! This assignment is designed to evaluate your practical QA automation and problem-solving skills.
You’ll work with a small web app that visualizes simple network metrics. Focus on quality, clarity, and reasoning over quantity.

⏱️ **Estimated time:** ~2 hours  
🎯 **Goal:** Assess readiness for a mid-level role progressing toward senior QA responsibilities.

---

## 🚀 Quick Start

Start from forking this repository.

**Requirements:** Node.js 18+

```bash
npm ci
npm run start
```

Open [http://localhost:5174](http://localhost:5174) in your browser.

### Available commands

| Command | Description |
|----------|--------------|
| `npm run start` | Run the Express app with REST + GraphQL mock APIs |
| `npm test` | Run Jest unit tests |
| `npm run cypress` | Open Cypress UI for E2E testing |
| `npm run cypress:ci` | Run Cypress tests in headless mode |

---

## 🧩 Tasks

### Core A — E2E Testing (Cypress)

Create or extend E2E tests in `cypress/e2e/app.cy.ts` to verify:

1. The dashboard renders correctly with default data.  
2. Selecting another metric (e.g., *Upload*) updates the chart with new values.  
3. If the REST request fails once, the app retries and successfully loads data.  
4. Add a test that detects and prevents XSS (there’s an intentional bug to find).  

Focus on reliability and determinism (e.g., mock network or time where needed).

---

### Core B — Unit & Integration (Jest + TypeScript)

1. Review `movingAverage()` in `src/metrics.ts` — it contains subtle logic bugs.  
2. Write unit tests in `src/metrics.test.ts` that expose those issues.  
3. Fix the implementation.  
4. Add one or more parameterized (table-driven) tests to show robustness.  

---

### Core C — API Testing

Use either **Postman** (collection provided) or **Cypress API tests** to:

1. Validate both REST (`/api/metrics`) and GraphQL (`/graphql`) endpoints.  
2. Include a negative test (invalid `metric`).  
3. Investigate an intermittent 500 error for `metric=upload`, document the cause in `REPORT.md`.  

---

### Stretch Goals (Optional)

#### Performance
Run [Lighthouse](https://developers.google.com/web/tools/lighthouse) locally and record key scores. Suggest one improvement.

#### SQL Reasoning
Write a PostgreSQL query in `sql/tasks.sql` returning:
- Daily average download speed
- 95th percentile latency
for the last 7 days.

#### Security
Identify the XSS vulnerability in the frontend and propose a code-level mitigation (plus test).

#### AI Testing (Bonus Thought Exercise)
Imagine a future feature that uses an LLM to “explain” chart data. Write a short plan in `REPORT.md` on how you would test it.

---

## 📝 Deliverables

1. For of this repository with your test code (Cypress + Jest).  
2. Updated or fixed implementation if applicable.  
3. `REPORT.md` — your summary including:
   - Decisions, trade-offs, assumptions
   - Root cause of the intermittent issue
   - Improvement ideas (performance, security, CI, etc.)

---

## 💡 Tips

- Keep your commits atomic and meaningful.  
- Prioritize test quality over coverage.  
- You can use AI tools for brainstorming, but write your own code.
- Document your reasoning — it’s part of what we evaluate.

Good luck, and have fun! 🚀
