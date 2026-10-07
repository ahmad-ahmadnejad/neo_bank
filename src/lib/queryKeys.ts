export const queryKeys = {
  profile: {
    all: ['profile'] as const,
  },
  dashboardStats: ['dashboard_stats'] as const,
  cards: {
    all: ['cards'] as const,
    detail: (id: string) => ['cards', id] as const,
  },
  transactions: {
    all: ['transactions'] as const,
    search: (query: string) => ['transactions', 'search', query] as const,
  },
  reminders: {
    all: ['reminders'] as const,
  },
} as const;
