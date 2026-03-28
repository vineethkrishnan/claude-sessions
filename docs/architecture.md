# Architecture

**claude-sessions** follows a **vertical-slice hexagonal architecture** with a **provider-based system** for multi-agent support.

## Layer Diagram

```
┌──────────────────────────────────────────────────────────┐
│  Presenters (Ink/React)                                  │
│  ├── App, AgentSelector, SessionTable, SessionPreview    │
│  ├── Hooks (useSessions)                                 │
│  └── Formatters                                          │
├──────────────────────────────────────────────────────────┤
│  Application (Use Cases)                                 │
│  ├── ListSessionsUseCase                                 │
│  ├── GetSessionDetailUseCase                             │
│  ├── DeleteSessionUseCase                                │
│  └── ResumeSessionUseCase                                │
├──────────────────────────────────────────────────────────┤
│  Infrastructure (Providers & Adapters)                   │
│  ├── MultiAgentSessionRepository (Registry)              │
│  ├── ClaudeSessionProvider                               │
│  ├── GeminiSessionProvider                               │
│  ├── OpenAICodexProvider                                 │
│  ├── CursorSessionProvider                               │
│  ├── FsSessionStorageAdapter                             │
│  └── JSONL / SQLite parser                               │
├──────────────────────────────────────────────────────────┤
│  Domain (Pure Business Logic)                            │
│  ├── Session entity                                      │
│  ├── SessionDetail + SessionMessage                      │
│  └── matchesFilter logic                                 │
└──────────────────────────────────────────────────────────┘
```

## Multi-Agent Provider System

The core of the multi-agent support is the `SessionProvider` interface:

![SessionProvider Interface](./assets/code/session-provider.png)

The `MultiAgentSessionRepository` acts as a registry for these providers.

![Multi-Agent Repository](./assets/code/multi-agent-repo.png)

When an agent is selected in the UI, the repository sets the corresponding provider as "active," and all subsequent use case calls are delegated to that provider.

### Example: Cursor Session Provider

Cursor is the most complex provider as it reads from an SQLite database and maps workspace hashes to project paths.

![Cursor Provider](./assets/code/cursor-provider.png)

## Directory Structure

```
src/
├── domain/session/              # Session domain module
│   ├── domain/                  # Pure business logic
│   ├── application/             # Use cases + ports
│   │   ├── ports/               # SessionProvider contract
│   │   └── ...use-case.ts
│   ├── infrastructure/          # Adapters & Providers
│   │   ├── claude-session.provider.ts
│   │   ├── gemini-session.provider.ts
│   │   ├── openai-codex.provider.ts
│   │   ├── cursor-session.provider.ts
│   │   ├── multi-agent-session-repository.adapter.ts
│   │   ├── fs-session-storage.adapter.ts
│   │   └── ...parser.ts
│   ├── presenters/              # UI layer (Ink/React)
│   │   ├── components/          # AgentSelector, Table, etc.
│   │   └── ...
│   └── session.module.ts        # Module wiring (DI)
├── common/helpers/              # Utilities
└── cli.tsx                      # Entry point
```

## Module Wiring

`session.module.ts` initializes the repository and registers all providers:

```ts
export function createSessionModule(): SessionModule {
  const multiAgentRepository = new MultiAgentSessionRepository();
  const processLauncher = new CliProcessLauncherAdapter();

  // Register all supported agent providers
  multiAgentRepository.registerProvider(new ClaudeSessionProvider(processLauncher));
  multiAgentRepository.registerProvider(new GeminiSessionProvider(processLauncher));
  multiAgentRepository.registerProvider(new OpenAICodexProvider(processLauncher));
  multiAgentRepository.registerProvider(new CursorSessionProvider(processLauncher));

  return {
    multiAgentRepository,
    listSessionsUseCase: new ListSessionsUseCase(multiAgentRepository),
    // ...
  };
}
```

Tests are co-located with source files (`*.spec.ts`).
