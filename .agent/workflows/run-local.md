---
description: How to run the Virtuprose website locally
---

# Running the Virtuprose Website Locally

**IMPORTANT: This project must always run on port 3001.**

## Steps

// turbo-all

1. Navigate to the project directory:
   `/Users/muhammadzaid/Projects/New Virtprose.com`

2. Install dependencies (if needed):
   ```bash
   npm install
   ```

3. Start the development server on port 3001:
   ```bash
   npm run dev
   ```
   
   The dev script is already configured to use port 3001.

4. Access the site at: **http://localhost:3001**

## Notes

- The `package.json` dev script is set to: `PORT=3001 next dev --port 3001`
- Never change this port for local development
- If port 3001 is occupied, kill the existing process first before starting
