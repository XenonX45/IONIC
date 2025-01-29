export interface Task {
    id: number;
    title: string;
    category: string;
    status: 'À faire' | 'En cours' | 'Terminé';
    dueDate: Date;
  }