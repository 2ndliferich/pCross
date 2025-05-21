# Contributor Guide

### Overview
This is not a node.js project, it is a Horizon Worlds project. Horizon Worlds api are in  horizon_core.d.ts  horizon_ui.d.ts. These rules guide the AI to consistently follow Horizon Worlds API conventions, TypeScript structure, and best practices based solely on the provided Horizon Worlds documentation and uploaded TypeScript files. Request additional or clarifying documentation from me if you encounter gaps in your knowledge.

## Dev Environment Tips
-This is a Horizon Worlds project using the Horizon API
-Use the types/horizon_core.d.ts file to get type definitions for the Horizon API
-Use the types/horizon_ui.d.ts file to get type definitions for the Horizon UI API
-Use Marie Script Test.ts as an example of how to structure your code
-Always use arrow functions (`() => {}`) instead of `.bind(this)` to preserve lexical scope.
 

## Testing Instructions
- Fix any test or type errors until the whole suite is green.
- After moving files or changing imports, run pnpm lint --filter <project_name> to be sure ESLint and TypeScript rules still pass.
- Add or update tests for the code you change, even if nobody asked.

## PR instructions
-Title format: [<project_name>] <Title>
-Body format:
- <Description of changes>
- <List of files changed>
- <List of dependencies added>
- <List of dependencies removed>