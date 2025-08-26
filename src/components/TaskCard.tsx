import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Edit, Trash, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { Task, useTaskContext } from '@/context/TaskContext';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  variant?: 'standard' | 'neumorphic' | 'glass';
}

export function TaskCard({ task, variant = 'standard' }: TaskCardProps) {
  const navigate = useNavigate();
  const { completeTask, deleteTask, toggleBulletPoint } = useTaskContext();
  const [expanded, setExpanded] = useState(false);

  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    completeTask(task.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTask(task.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/task/${task.id}`);
  };

  const handleToggleBulletPoint = (e: React.MouseEvent, bulletPointId: string) => {
    e.stopPropagation();
    toggleBulletPoint(task.id, bulletPointId);
  };

  const getCardClass = () => {
    const baseClass = cn(
      'group mb-4 cursor-pointer transition-all duration-200',
      `priority-${task.priority}`,
      task.status === 'completed' && 'status-completed'
    );

    switch (variant) {
      case 'neumorphic':
        return cn(baseClass, 'task-card-neumorphic');
      case 'glass':
        return cn(baseClass, 'task-card-glass');
      default:
        return cn(baseClass, 'task-card');
    }
  };

  const getPriorityBadge = () => {
    switch (task.priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="default" className="bg-accent text-accent-foreground">Medium</Badge>;
      case 'low':
        return <Badge variant="default" className="bg-secondary text-secondary-foreground">Low</Badge>;
      default:
        return null;
    }
  };

  return (
    <div 
      className={getCardClass()}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className={cn(
            "task-title",
            task.status === 'completed' && "line-through text-muted-foreground"
          )}>
            {task.title}
          </h3>
          <p className="task-description">{task.description}</p>
        </div>
        <div className="flex items-center space-x-1">
          {getPriorityBadge()}
          {expanded ? 
            <ChevronUp className="h-5 w-5 text-muted-foreground" /> : 
            <ChevronDown className="h-5 w-5 text-muted-foreground" />}
        </div>
      </div>

      {expanded && (
        <div className="mt-3">
          {task.bulletPoints.length > 0 && (
            <div className="bullet-list">
              {task.bulletPoints.map((bulletPoint) => (
                <div key={bulletPoint.id} className="bullet-item">
                  <Checkbox 
                    id={bulletPoint.id}
                    checked={bulletPoint.completed}
                    onCheckedChange={() => toggleBulletPoint(task.id, bulletPoint.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-0.5"
                  />
                  <label 
                    htmlFor={bulletPoint.id}
                    className={cn(
                      "text-sm", 
                      bulletPoint.completed && "line-through text-muted-foreground"
                    )}
                    onClick={(e) => handleToggleBulletPoint(e, bulletPoint.id)}
                  >
                    {bulletPoint.text}
                  </label>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between mt-4">
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleEdit}
                className="h-8 w-8"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleDelete}
                className="h-8 w-8 text-error hover:text-error hover:bg-error-muted"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            {task.status !== 'completed' && (
              <Button 
                variant="default" 
                size="sm" 
                onClick={handleComplete}
                className="bg-secondary hover:bg-secondary-600"
              >
                <Check className="h-4 w-4 mr-1" />
                Complete
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
