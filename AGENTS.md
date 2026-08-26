# Repository instructions

## Static-first diagnosis

- Diagnose reported problems from the user's description, source code, and configuration files.
- Treat runtime behavior reported by the user as the authoritative observation. Do not independently reproduce, probe, or supplement that behavior unless the user explicitly asks for runtime investigation in the current request.
- Do not start or execute the application, run behavioral or integration tests, make HTTP requests (including with `curl`), use a browser, inspect live ports or processes, or contact deployed/local endpoints for debugging unless the user explicitly requests that specific kind of investigation.
- When static evidence does not establish a single cause, present the supported hypotheses and say what additional observation the user would need to provide. Do not resolve the uncertainty by running the software.
- Read-only source and configuration inspection is allowed. After making requested code changes, non-behavioral static validation such as type-checking, linting, or compilation is allowed; do not run the application or behavioral tests unless explicitly requested.
- Never claim that behavior was reproduced or verified unless the user explicitly requested runtime investigation and it was actually performed.

## Release-note-aware git writing

- Write commit messages and pull request titles with the release-note workflow in mind.
- Describe the purpose and meaningful effect of a change in language that non-technical readers can follow, especially when it affects users or deployment behavior.
- Retain technical vocabulary and implementation detail when they are necessary for accuracy; clarity does not require removing useful technical context.
- Avoid opaque shorthand or purely internal phrasing when a concise explanation of the change would make the resulting release notes more informative.
