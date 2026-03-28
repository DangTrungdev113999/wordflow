# Task: Implement Phase 6A Step 5 — Writing Practice + Conversation Roleplay

Read `docs/design-phase6-ai-features.md` thoroughly — Section 3.2 (Writing Practice) and Section 3.3 (Conversation Roleplay).

## What's ALREADY DONE (don't touch):
- AI Service Layer (src/services/ai/) — all working with AbortController, rate limiter, etc.
- AI Chat feature — complete
- AI Hub page — has 3 cards, Writing + Roleplay show "Sắp có" badge
- DB v4 — writingSubmissions + roleplaySessions tables ready
- Models — WritingSubmission, WritingFeedback, GrammarIssue, RoleplaySession, RoleplaySummary, RoleplayMessage all defined in db/models.ts
- promptTemplates.ts — writingFeedbackPrompt, roleplaySystemPrompt, roleplaySummaryPrompt already exist
- Routes exist in index.tsx but pages are empty dirs

## IMPLEMENT NOW:

### Feature 1: Writing Practice (Section 3.2)

**Seed Data:**
- `src/data/writing-prompts.json` — at least 15 prompts (5 per type: essay, email, description; mix A1/A2)
- Follow the WritingPrompt interface from design doc exactly

**Components & Pages:**
- `src/features/writing/hooks/useWritingPractice.ts` — submit writing, get AI feedback (JSON parse), save to IndexedDB, history
- `src/features/writing/components/PromptPicker.tsx` — grid of prompts, filter by level/type
- `src/features/writing/components/WritingEditor.tsx` — textarea with word count, min/max indicator, submit button
- `src/features/writing/components/WritingFeedback.tsx` — score breakdown (overall + 4 categories), grammar issues, improved version, encouragement
- `src/features/writing/components/WritingHistory.tsx` — list past submissions
- `src/features/writing/pages/WritingPage.tsx` — full flow: pick prompt → write → feedback → history

**Key behaviors:**
- AI returns JSON → parse with try/catch, retry once if invalid
- Score display: circular progress for overall, bar charts for categories
- Grammar issues: expandable list with original → correction + rule
- Improved version: toggle show/hide
- XP: score × 10 (max 100), +20 bonus if score >= 8
- EventBus: emit('writing:submitted', { score, wordCount })
- Check aiService.hasAnyProvider() → show AIKeyRequired if false

### Feature 2: Conversation Roleplay (Section 3.3)

**Seed Data:**
- `src/data/scenarios.json` — at least 8 scenarios (2 per category: daily, travel, work, social; mix A1/A2)
- Follow the Scenario interface from design doc exactly

**Components & Pages:**
- `src/features/roleplay/hooks/useRoleplay.ts` — scenario state, conversation, send message (in-character), generate summary at end
- `src/features/roleplay/components/ScenarioGrid.tsx` — grid of scenario cards by category
- `src/features/roleplay/components/ScenarioCard.tsx` — card with icon, title, description, level badge
- `src/features/roleplay/components/RoleplayChat.tsx` — chat UI (in-character, AI speaks first with openingLine)
- `src/features/roleplay/components/RoleplayHeader.tsx` — scenario context, turn counter, user's role, exit button
- `src/features/roleplay/components/HintButton.tsx` — reveal next suggestedPhrase (no AI call)
- `src/features/roleplay/components/RoleplaySummary.tsx` — end-of-session: goal completion, fluency, grammar corrections, useful/learn phrases
- `src/features/roleplay/pages/RoleplayPage.tsx` — scenario picker → active roleplay → summary

**Key behaviors:**
- AI speaks first with openingLine
- Max turns (8-12 per scenario), show turn counter
- Hints: cycle through suggestedPhrases
- End: after maxTurns OR user clicks "End Conversation"
- Summary: AI returns JSON → parse, show structured feedback
- XP: +50 per completed, +20 if goalCompleted, +10 if fluency >= 7
- EventBus: emit('roleplay:completed', { scenarioId, goalCompleted, fluency })
- Save session to IndexedDB (db.roleplaySessions)
- Check aiService.hasAnyProvider() → show AIKeyRequired if false

### Update AI Hub Page
- Remove "Sắp có" badges from Writing Practice and Roleplay cards
- Make them clickable links to /writing and /roleplay

### Update Routes
- Add routes: /writing, /writing/:submissionId, /roleplay, /roleplay/:scenarioId

### Update EventBus
- Add new event types for writing and roleplay events in eventBus.ts

## Design Requirements
- Design polished, production-grade UI, avoid generic AI look
- Follow existing patterns (Tailwind, lucide-react, framer-motion PageTransition)
- Mobile-first, dark mode support
- Vietnamese UI text where user-facing
- Use AbortController for all AI fetch calls (follow pattern from useAIChat)

## After implementing
- Run `pnpm build` to verify no TypeScript errors
- Fix any build errors found
