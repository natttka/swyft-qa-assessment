# REPORT
Use this file to briefly document what you did, what you skipped, and why.
Include notes for:
- E2E scenarios & flakiness controls
- API findings (incl. intermittent 500 root cause)
- Performance (Lighthouse) results & 1 improvement
- Security: XSS vector & mitigation
- SQL query reasoning
- Optional: AI feature test strategy

# XSS Prevention Note
Originally, the application used innerHTML to render metric descriptions. This allowed injected HTML/JavaScript to execute, creating an XSS vulnerability. To fix this, the rendering was changed to use textContent, which treats the description as plain text and prevents execution of malicious code.
Pros: Completely safe against script injection.
Cons: Any intended formatting (e.g. <b>bold</b>) is displayed literally as tags.
Alternative approach: If limited formatting is required, a sanitizer such as DOMPurify can be used. This allows whitelisted tags (e.g. <b>, <i>) while still stripping dangerous attributes.

# E2E Scenarios & Flakiness Controls
- **Scenarios covered:**
  - Dashboard renders with default data (download metric).
  - Switching metric (e.g. latencyt) updates chart and description.
  - Retry logic: first API call fails (500), second succeeds.
  - Chart data matches API response (Chart.js config inspection).
  - XSS prevention: malicious HTML is rendered as safe text.
- **Flakiness controls:**
  - Removed caching headers ("if-none-match", "if-modified-since") to avoid stale responses (304).

## Finding - API upload error
 For metric=upload, the API consistently returns 500 with body {"error":"Intermittent failure"}.
 This occurs even after frontend retry logic.

- Root Cause
 Backend intentional simulation of intermittent failure in server.js

- Solution
 Frontend already retries once, but since backend keeps failing, user still sees error.
 Suggested improvements:
  * Fix backend logic for `upload` metric.
  * If intermittent failures are expected, implement exponential backoff with more retries or fallback message.
  * Improve error message shown to user (instead of raw "REST failed 500").

# Performance (Lighthouse)

- Results
 Performance: 82
 Accessibility: 95
 Best Practices: 100
 SEO: 100

- My observation
When I looked at the Lighthouse report, I noticed that the biggest issue for performance was loading the Chart.js library (around 70 KB). It is downloaded immediately when the page starts and blocks the first render, which delays the Largest Contentful Paint (LCP).  
Lighthouse also showed that a large part of this library is not actually used right away.

- Suggested improvement
A simple improvement would be to load Chart.js only when it is really needed to draw the chart (lazy‑loading). This way the page can show the header and description faster, and the chart can load a moment later. That should improve the Performance score and reduce the LCP time.



##  AI Testing (Bonus Thought Exercise)
In the future, the dashboard could use an AI model to explain the chart data in plain language.

- Simple Test Plan
  Check with obvious data: Give the AI very simple datasets (e.g. values always going up, always flat, or one big spike). Make sure the explanation matches the trend.
  Check with missing or strange data: Try empty data or extreme values. The AI should not invent things but say clearly that data is missing or unusual.
  Check consistency: Run the same data more than once and see if the explanation is similar each time.
  Check tone: The explanation should be clear, neutral, and easy to understand.

- Note
I  would not expect the wording to be identical every time, but the main idea (trend, spike, stable) should always be correct.
