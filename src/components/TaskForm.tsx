import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useTaskContext, Priority } from '@/context/TaskContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

export function TaskForm() {
  const { addTask } = useTaskContext();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [bulletPoints, setBulletPoints] = useState<{ id: string; text: string; completed: boolean }[]>([]);
  const [newBulletPoint, setNewBulletPoint] = useState('');

  const handleAddBulletPoint = () => {
    if (newBulletPoint.trim()) {
      setBulletPoints([
        ...bulletPoints,
        {
          id: Date.now().toString(),
          text: newBulletPoint,
          completed: false,
        },
      ]);
      setNewBulletPoint('');
    }
  };

  const handleRemoveBulletPoint = (id: string) => {
    setBulletPoints(bulletPoints.filter((bp) => bp.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive",
      });
      return;
    }

    addTask({
      title,
      description,
      priority,
      status: 'pending',
      bulletPoints,
    });

    toast({
      title: "Success",
      description: "Task added successfully",
    });

    // Reset form
    setTitle('');
    setDescription('');
    setPriority('medium');
    setBulletPoints([]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-card rounded-lg shadow-sm">
      <div>
        <Input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-lg font-medium"
        />
      </div>
      
      <div>
        <Textarea
          placeholder="Task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[80px]"
        />
      </div>
      
      <div>
        <Select 
          value={priority} 
          onValueChange={(value) => setPriority(value as Priority)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high">High Priority</SelectItem>
            <SelectItem value="medium">Medium Priority</SelectItem>
            <SelectItem value="low">Low Priority</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <div className="text-sm font-medium">Bullet Points</div>
        
        {bulletPoints.map((bp) => (
          <div key={bp.id} className="flex items-center gap-2">
            <div className="flex-1 bg-muted/50 p-2 rounded-md text-sm">
              {bp.text}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveBulletPoint(bp.id)}
              className="h-8 w-8 text-muted-foreground hover:text-error"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        
        <div className="flex gap-2">
          <Input
            placeholder="Add bullet point"
            value={newBulletPoint}
            onChange={(e) => setNewBulletPoint(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddBulletPoint();
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleAddBulletPoint}
            disabled={!newBulletPoint.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Button type="submit" className="w-full bg-primary hover:bg-primary-600">
        Add Task
      </Button>
    </form>
  );
}
