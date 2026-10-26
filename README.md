# sight-words

A fun sight-word game for kids. Open `index.html` in a browser.

- Choose the current week's words to practice that week's list, or Practice words through this week to include all scheduled weeks so far.
- Look & Find: see a word, pick it from choices
- Listen & Find: hear a word, pick it
- Spell It: hear the word and tap its letters in order
- Sight Word Hangman: guess a random word from this week's list before nine incorrect guesses; the drawing adds eyes and a frown as mistakes accumulate.
- In the word-list games, each wrong answer lowers the points available for that word (3 → 0), so guessing does not pay
- Word-list games give stars and confetti for correct answers
- Each word-list game lasts 10 completed words. A score of 24/30 (80%) or higher wins; 30/30 earns PERFECT!, confetti, and a celebration fanfare.
- Hangman is a separate single-word game with Play Again and Main Menu options.
- In the word-list games, Play Again repeats the selected list.

The 44-week schedule starts Sunday, September 6, 2026. The current week is selected automatically from the date, and Practice all words includes only the scheduled weeks through the current week. Edit `WEEK_ONE_START_DATE` and `SIGHT_WORD_WEEKS` in `index.html` if the schedule changes.

Words are spoken from bundled MP3s in `audio/ava/` (voice: en-US-AvaNeural). If a clip is missing, the game falls back to the browser's built-in speech. To regenerate or add clips after editing the word lists, run `pip install edge-tts` once (free, no account or key), then `node scripts/generate-voice.mjs`. Set `USE_GENERATED_AUDIO` to `false` in `index.html` to use only browser speech.
