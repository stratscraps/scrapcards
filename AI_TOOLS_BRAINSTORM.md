# AI Tools Brainstorm for StratScraps

## Context

StratScraps is a newsletter and personal brand about strategy, advertising, and creative thinking. The current project is a Strategy Inspiration Generator: a minimalist static site that randomizes curated strategic quotes and visual frameworks. The work is built on a philosophy of "Clarity. Brevity. Novelty." and a belief that diagnosis matters more than solutions.

The question: what AI-powered tools would add the most value to this kind of work?

---

## 10 High-Value AI Tools (Ranked by Effort-to-Value)

### 1. The Collision Engine (Forced Juxtaposition)
Show 2-3 random items simultaneously. An LLM generates a one-sentence "collision note" about what they reveal when placed next to each other — the tension, the hidden agreement, the provocation. Mechanizes a cognitive style of thinking in intersections ("irrefutable and reckless"). **Directly extends the existing site with a "Collide" button.** Low build effort.

### 2. The Brief Antagonist
Paste in a brief or positioning statement. AI responds not with improvements but with the three strongest *attacks* on it — from three voices: "The Client Who Has Seen This Before," "The Competitor Who Would Exploit This," and "The Consumer Who Doesn't Care." Most AI tools help you build; this one helps you break. Serves the ethos of honesty over polish ("Write it ugly before anything else," "How would you write your brief if you could do it anonymously?").

### 3. The Diagnosis Machine
Paste a messy problem description. Get back three fundamentally *different* diagnoses of the same situation — not solutions, just frames. Each labeled with its implicit assumption and what it would mean for the strategic direction. Operationalizes "Diagnosis -> Guiding Policy -> Coherent Actions" and the belief that "your definition of the problem is more important than your definition of the answer."

### 4. The Sacred Cow Identifier
Describe a brand or category. Get back 5-7 unspoken *conventions* nobody questions — the visual language, messaging tropes, pricing structures, channel choices. For each: risk and reward of breaking it, plus a real example of a brand that did. Turns a multi-day competitive audit into a fast first draft of "what's the water the fish are swimming in."

### 5. The "Simplify, Then Exaggerate" Rewriter
Paste any strategic writing. Two explicit passes: Pass 1 (Simplify) strips to the essential claim, showing the diff. Pass 2 (Exaggerate) pushes the simplified version to its most provocative form, showing the diff. You see the three-stage transformation. Not "rewrite this better" — it's a named intellectual operation made visible.

### 6. The Analogy Finder (Cross-Domain Pattern Matcher)
Describe a strategic challenge. Get back 3-5 structural analogs from completely different domains — military history, ecology, sports, architecture, restaurant culture. Not surface metaphors but genuine structural matches with explanations of *why the dynamics are similar*. LLMs are uniquely good at this because they've ingested text from every field; human strategists are typically trapped in their industry's reference class.

### 7. The Semantic Mapper (Quote Constellation)
Generate embeddings for all quotes, render an interactive 2D map where quotes cluster by *meaning*. See the topology of your own thinking — where attention clusters, where gaps exist, which quotes are redundant, which is the most isolated outlier. Pre-computable at build time, served as a static page. Medium effort, high wow-factor.

### 8. The Newsletter Seam Detector
Feed in a week's accumulated links, quotes, and rough notes. AI identifies the non-obvious thematic *seams* running through the material — the connections that could become the through-line of a newsletter edition. Proposes 3-4 angles with suggested opening lines. Solves the hardest part of newsletter writing: the editorial decision of what the issue is actually *about*.

### 9. The Quote Sharpener (Curation Assistant)
When adding a new quote: (a) suggests the shortest version that preserves the insight, (b) checks semantic similarity against existing items and warns of duplicates, (c) identifies which cluster it belongs to and whether it strengthens an existing theme or opens a new one. Enforces "Clarity. Brevity. Novelty." on the collection itself.

### 10. The Reverse Brief
Paste a description of a finished ad or campaign. AI reverse-engineers the *brief that probably led to it* — the strategic insight, target audience, single-minded proposition, mandatories, and tensions. Then identifies what the brief got right and where it probably left gaps. Turns passive case study consumption into active strategic exercise.

---

## Architecture Pattern (All Tools)

All LLM-powered tools follow the same pattern:
- **Frontend:** Vanilla JS pages using the existing design system (IBM Plex Mono, CSS variables, minimalist layout)
- **Backend:** Netlify Functions (serverless) to hold the API key and proxy LLM requests
- **API:** Claude API (or similar) with tightly constrained system prompts
- **No framework migration needed** — extends the existing static site approach

Tools 7 and 9 share embedding infrastructure and could be built together.

## Recommended Build Order

1. **Collision Engine** — lowest effort, directly extends existing site, immediate value
2. **Brief Antagonist + Diagnosis Machine** — highest client-facing value, similar architecture
3. **Semantic Mapper + Quote Sharpener** — highest curation value, share embedding infra
4. **Everything else** — in whatever order matches current needs
