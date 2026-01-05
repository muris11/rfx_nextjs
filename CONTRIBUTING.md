# Contributing to RFX

First off, thank you for considering contributing to RFX! 🎉

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed**
- **Explain which behavior you expected to see instead**
- **Include screenshots if possible**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List some examples of how it would be used**

### Pull Requests

1. Fork the repo and create your branch from `master`
2. If you've added code that should be tested, add tests
3. Ensure the test suite passes
4. Make sure your code lints
5. Update the documentation

## Development Process

1. **Setup**
   ```bash
   git clone https://github.com/muris11/rfx_nextjs.git
   cd rfx_nextjs
   npm install
   ```

2. **Create Branch**
   ```bash
   git checkout -b feature/my-feature
   # or
   git checkout -b fix/my-bugfix
   ```

3. **Development**
   ```bash
   npm run dev
   ```

4. **Commit**
   - Use meaningful commit messages
   - Follow conventional commits format:
     - `feat:` New feature
     - `fix:` Bug fix
     - `docs:` Documentation changes
     - `style:` Code style changes
     - `refactor:` Code refactoring
     - `perf:` Performance improvements
     - `test:` Test additions or changes
     - `chore:` Build process or auxiliary tool changes

5. **Push & PR**
   ```bash
   git push origin feature/my-feature
   ```
   Then open a Pull Request on GitHub

## Style Guidelines

### TypeScript Style Guide

- Use TypeScript for all new files
- Define proper types/interfaces
- Avoid `any` type when possible
- Use meaningful variable names

### React/Next.js Guidelines

- Use functional components with hooks
- Follow React best practices
- Use Next.js conventions (App Router)
- Implement proper error boundaries

### CSS/Tailwind Guidelines

- Use Tailwind utility classes
- Follow mobile-first approach
- Use CSS variables for theming
- Maintain consistent spacing

### Component Structure

```typescript
"use client"; // if needed

import statements...

interface ComponentProps {
  // props definition
}

export default function Component({ props }: ComponentProps) {
  // hooks
  // handlers
  // render
  return (
    // JSX
  );
}
```

## Testing

- Write unit tests for utilities
- Write integration tests for critical flows
- Test on multiple browsers
- Test responsive design

## Documentation

- Update README.md if needed
- Add JSDoc comments for complex functions
- Update API documentation
- Include examples in comments

## Questions?

Feel free to open an issue with the `question` label or reach out to the maintainers.

Thank you! ❤️
