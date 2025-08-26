import { useState } from 'react';
import { Filter } from 'lucide-react';
import { TaskCard } from './TaskCard';
import { useTaskContext, Priority, Status } from '@/context/TaskContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface TaskListProps {
  status: Status;
  cardVariant?: 'standard' | 'neumorphic' | 'glass';
}

export function TaskList({ status, cardVariant = 'standard' }: TaskListProps) {
  const { tasks } = useTaskContext();
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredTasks = tasks
    .filter((task) => task.status === status)
    .filter((task) => priorityFilter === 'all' || task.priority === priorityFilter)
    .filter(
      (task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.bulletPoints.some((bp) =>
          bp.text.toLowerCase().includes(searchQuery.toLowerCase())
        )
    )
    .sort((a, b) => {
      // Sort by priority (high > medium > low)
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      
      if (priorityDiff !== 0) return priorityDiff;
      
      // Then sort by creation date (newest first)
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className={showFilters ? 'bg-muted' : ''}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {showFilters && (
        <div className="p-4 bg-muted/30 rounded-md">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Priority:</span>
            <Select
              value={priorityFilter}
              onValueChange={(value) => setPriorityFilter(value as Priority | 'all')}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {filteredTasks.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          {searchQuery || priorityFilter !== 'all' ? 
            "No tasks match your filters" : 
            status === 'pending' ? 
              "No pending tasks. Add a new task to get started!" : 
              "No completed tasks yet"}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} variant={cardVariant} />
          ))}
        </div>
      )}
    </div>
  );
}
