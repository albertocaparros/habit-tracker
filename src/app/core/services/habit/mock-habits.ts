import { Habit } from '../../models';

export const mockHabits: Habit[] = [
  {
    id: 'habit-1',
    name: 'Daily Meditation',
    icon: 'self_improvement',
    description: '10 minutes of mindfulness',
    createdAt: '2025-08-01',
    archived: false,
  },
  {
    id: 'habit-2',
    name: 'Drink Water',
    icon: 'local_drink',
    description: '8 glasses per day',
    createdAt: '2025-08-05',
    archived: false,
  },
];
