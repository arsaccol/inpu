# Repository instructions

## Static-first diagnosis

- Diagnose reported problems from the user's description, source code, and configuration files.
- Treat runtime behavior reported by the user as the authoritative observation. Do not independently reproduce, probe, or supplement that behavior unless the user explicitly asks for runtime investigation in the current request.
- Do not start or execute the application, run behavioral or integration tests, make HTTP requests (including with `curl`), use a browser, inspect live ports or processes, or contact deployed/local endpoints for debugging unless the user explicitly requests that specific kind of investigation.
- When static evidence does not establish a single cause, present the supported hypotheses and say what additional observation the user would need to provide. Do not resolve the uncertainty by running the software.
- Read-only source and configuration inspection is allowed. After making requested code changes, non-behavioral static validation such as type-checking, linting, or compilation is allowed; do not run the application or behavioral tests unless explicitly requested.
- Never claim that behavior was reproduced or verified unless the user explicitly requested runtime investigation and it was actually performed.
