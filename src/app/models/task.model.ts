export interface Task {
    id: number;
    project_id: number;
    title: string;
    description?: string;
    status: 'todo' | 'in_progress' | 'done';
    priority: 'low' | 'normal' | 'high';
    assignee_id?: number;
    order_index?: number;
    created_at?: string;
}