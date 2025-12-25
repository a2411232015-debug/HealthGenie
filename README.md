# HealthGenie AI

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

Running and deploying your AI Studio app.

View your app in AI Studio: [https://ai.studio/apps/drive/1fJ57_Dt0N3DUNPjbnyaP5KdvB2zwXq2W](https://ai.studio/apps/drive/1fJ57_Dt0N3DUNPjbnyaP5KdvB2zwXq2W)

## 快速開始 (Quick Start)

**Prerequisites:** Node.js (v18 or higher recommended)

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd HealthGenie
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env.local` file in the root directory and add your Gemini API key:
    ```env
    VITE_GEMINI_API_KEY=your_api_key_here
    ```

4.  **Run Locally:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) (or the port shown in terminal) to view it in the browser.

## Deployment

This project is configured to deploy to **GitHub Pages** automatically using GitHub Actions.

1.  Go to your repository **Settings** > **Pages**.
2.  Under **Build and deployment**, select **GitHub Actions** as the source.
3.  Push changes to the `main` branch.
4.  The `Build and Deploy` workflow will run and deploy your app.

## Project Structure

- `src/`: Source code
- `src/components/`: React components
- `src/services/`: API services
- `src/utils/`: Utility functions
- `public/`: Static assets

## Technologies

- React 19
- Vite
- TypeScript
- Google Generative AI SDK
- Tailwind CSS (via components setup)
