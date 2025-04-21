type Todo = {
    id: string;
    title: string;
    description?: string;
    dueDate?: Date | null;
    is_completed: boolean;
    completedAt?: string | null;
  };
  