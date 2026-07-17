# FutureProof: AI Career Risk Explorer

FutureProof is a user-friendly, educational website that estimates how strongly AI may affect the **tasks** within any career. Users can enter any job title and optionally describe its day-to-day responsibilities.

## What the score means

The 0–100 score estimates task exposure to AI—not the probability that an entire job will disappear. It compares the role against 22 factors:

- 11 areas where AI tends to be strong, including large-scale information processing, routine writing, pattern recognition, classification, summarization, repetitive digital work, standardized analysis, document search, translation, first drafts, and short-term prediction.
- 11 areas where humans tend to be strong, including trust, persuasion, judgment, leadership, problem framing, ambiguity, ethics, coordination, strategy, emotional situations, and physical work.

The analyzer works for any job title. Recognized career families provide a researched starting profile; the user's task description then adjusts the score and explanations. Results are intentionally capped at 8–92 because virtually every job contains both automatable and human-led tasks.

## Run locally

No installation or API key is required. Open `index.html` in a browser, or run a simple local server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publish with GitHub Pages

1. Merge the pull request into `main`.
2. Open the repository's **Settings** → **Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select `main` and `/ (root)`, then click **Save**.

GitHub will display the public website URL after deployment finishes.

## Privacy and limitations

- The site processes entries entirely in the visitor's browser and sends them nowhere.
- No secret credentials are included in the frontend.
- Scores are explainable educational estimates, not employment forecasts or career advice.
