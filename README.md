# site-words

A fun sight-word game for kids. Open `index.html` in a browser.

- Choose This week's words to practice the current short list, or Practice words to use the learned words plus this week's list.
- Look & Find: see a word, pick it from choices
- Listen & Find: hear a word, pick it
- Spell It: hear the word and tap its letters in order
- Each wrong tap lowers the points available for that word (3 → 0), so guessing does not pay
- Stars and confetti for correct answers
- Each game lasts 20 completed words. A score of 48/60 (80%) or higher wins; 60/60 earns PERFECT!, confetti, and a celebration fanfare.
- Play Again repeats the selected list.

Edit `THIS_WEEKS_WORDS` and `PREVIOUS_WORDS` in `index.html` to update the lists.

## Natural voice clips

The game can play locally generated Microsoft Azure Neural Speech clips using the `en-US-AvaNeural` voice. Without generated clips, it falls back to the browser's installed English voice.

1. Create an Azure Speech resource and note its key and region.
2. In PowerShell, set the credentials for the current terminal and generate the clips:

	```powershell
	$env:AZURE_SPEECH_KEY = "your-key"
	$env:AZURE_SPEECH_REGION = "your-region"
	node scripts/generate-voice.mjs
	```

3. Open `index.html`. Generated MP3s are stored under `audio/ava/`; the key is not saved in the project or sent to players.

Run the generator again after changing either word list. It also generates the "Try again" clip.
