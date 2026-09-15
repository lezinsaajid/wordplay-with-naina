# Talk & Grow

Build a polished, modern web app called WordPlay.

WordPlay is a voice-first vocabulary and communication coach. It helps people improve their active vocabulary through natural conversations rather than flashcards or traditional English lessons.

The voice coach is called Naina.

IMPORTANT PRODUCT FEEL:

This should feel like a real consumer product, not an AI SaaS dashboard, language-learning classroom, or generic chatbot.

The personality should be:

warm

friendly

playful

modern

approachable

slightly witty

youthful but not childish

The visual design should feel editorial, minimal, premium, and human.

Avoid:

generic AI gradients

excessive glassmorphism

corporate blue dashboards

lots of cards

stock illustrations

robot/AI imagery

excessive animations

complicated navigation

Use plenty of whitespace, strong typography, rounded buttons, subtle borders, and a clean visual hierarchy.

APP STRUCTURE

Create these main screens:

HOME

At the top:

WordPlay

Main headline:

"You know more words than you think."

Subheadline:

"Let's get you to actually use them."

Primary CTA:

"Start talking"

Include a small label beneath it:

"4 min · Voice only"

Then a section:

"What do you feel like practising?"

Create six selectable topic pills/buttons:

Work
Confidence
Travel
Networking
Everyday
Surprise me

Below that, show a small "Your last session" section.

Example:

Your last session

3 words · 4 min

articulate
nuanced
proactive

Keep this section visually subtle.

TOPIC SELECTION / PRE-CALL STATE

When the user selects a topic, show a simple transition into the conversation.

Example:

"Alright, let's do this."

Show the selected topic.

Give a short scenario, such as:

"You've just joined a new team and you're explaining an idea to your manager."

Then show a large primary button:

"Talk to Naina"

VOICE CONVERSATION SCREEN

This is the most important screen.

Make it extremely simple.

Large central circular microphone button.

Above it:

"Naina"

Small status text:

"Listening..."

or

"Your turn"

Show a very subtle visual indication when Naina is speaking/listening.

Do NOT create a traditional chat interface with message bubbles.

This is voice-first.

Include a small exit button.

Also show a small progress indicator such as:

"2 of 3 words"

but keep it understated.

SESSION COMPLETE

After the conversation, show:

"Nice. You actually used those."

Then:

"Today's words"

Display three words:

ARTICULATE
NUANCED
PROACTIVE

For each, show a tiny status such as:

Used naturally
Getting there
Used naturally

Then show:

"One thing I noticed"

Example:

"You explain ideas naturally. Your next upgrade is replacing general words like 'good' and 'nice' with more precise ones."

Primary button:

"Another round"

Secondary option:

"Back home"

INTERACTION

Make the app feel responsive.

Buttons should have subtle hover and press states.

Topic selection should visibly activate when selected.

The Start Talking button should eventually be the entry point for the real Naina voice agent.

For now, create the frontend interaction and placeholder voice state. Do not use fake chat messages.

TECHNICAL

Use React with TypeScript.

Keep the code clean and componentized.

Make the experience responsive for desktop and mobile.

Use a modern sans-serif font.

Use accessible buttons and semantic HTML.

Do not add authentication, databases, payments, analytics, or unnecessary backend infrastructure.

This is a focused prototype.

The priority is:

beautiful UX + clear product concept + realistic voice interaction flow.

Do not add features that were not requested.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://wordplay-with-naina.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0caf073f-4efb-4c6c-9b7d-cc09c3fe5fc5).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
