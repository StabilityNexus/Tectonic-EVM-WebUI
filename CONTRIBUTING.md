# Contributing to Tectonic-EVM-WebUI

First off, thank you for considering contributing to Tectonic-EVM-WebUI! It's people like you that make this project such a great tool.

## Discord Project Channel

Join our community and discuss the project, ask questions, or propose ideas on our Discord server:
- **Discord Channel**: [Tectonic-EVM-WebUI Discord Channel](https://discord.com/channels/995968619034984528/1503320626096635935)

## Development Setup

To get your local environment set up for development, follow these steps:

1. **Fork and clone the repository:**

   ```bash
   git clone https://github.com/<your-username>/Tectonic-EVM-WebUI.git
   cd Tectonic-EVM-WebUI
   git remote add upstream https://github.com/StabilityNexus/Tectonic-EVM-WebUI.git
   ```

2. **Install dependencies:**
   Ensure you have Node.js and npm installed, then run:

   ```bash
   npm install
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

   The application should now be running locally at `http://localhost:3000`.

## Coding Style

We maintain a consistent codebase to make it easier for everyone to read and contribute. Please adhere to the following guidelines:
- **Language**: TypeScript is preferred for all new logic.
- **Formatting**: We use ESLint. Ensure your code is properly formatted before committing by running `npm run lint`.
- **Components**: Use functional React components and TailwindCSS for styling.
- **Localization**: All user-visible text should be externalized using `i18n` keys (e.g., in `en.json`).

## PR Process

We use a standard fork-and-pull-request workflow:

1. **Create your branch** from `main` (`git checkout -b feature/my-new-feature`).
2. **Make your changes**, ensuring you follow the coding style.
3. **Commit your changes** with clear and descriptive commit messages (`git commit -m 'feat: Add some feature'`).
4. **Push to your fork** (`git push origin feature/my-new-feature`).
5. **Open a Pull Request** against the `main` branch of the upstream repository.
6. **Code Review**: A maintainer will review your PR. Please be responsive to feedback. Once approved, it will be merged!
