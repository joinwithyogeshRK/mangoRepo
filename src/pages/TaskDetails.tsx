import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Plus, X, Trash } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { useTaskContext, Priority } from '@/context/TaskContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

export default function TaskDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTaskById, updateTask, deleteTask } = useTaskContext();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [bulletPoints, setBulletPoints] = useState<{ id: string; text: string; completed: boolean }[]>([]);
  const [newBulletPoint, setNewBulletPoint] = useState('');

  useEffect(() => {
    if (id) {
      const task = getTaskById(id);
      if (task) {
        setTitle(task.title);
        setDescription(task.description);
        setPriority(task.priority);
        setBulletPoints([...task.bulletPoints]);
      } else {
        navigate('/');
      }
    }
  }, [id, getTaskById, navigate]);

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

  const handleRemoveBulletPoint = (bulletPointId: string) => {
    setBulletPoints(bulletPoints.filter((bp) => bp.id !== bulletPointId));
  };

  const handleToggleBulletPoint = (bulletPointId: string) => {
    setBulletPoints(
      bulletPoints.map((bp) =>
        bp.id === bulletPointId ? { ...bp, completed: !bp.completed } : bp
      )
    );
  };

  const handleSave = () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive",
      });
      return;
    }

    if (id) {
      updateTask(id, {
        title,
        description,
        priority,
        bulletPoints,
      });

      toast({
        title: "Success",
        description: "Task updated successfully",
      });

      navigate('/');
    }
  };

  const handleDelete = () => {
    if (id) {
      deleteTask(id);
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
      navigate('/');
    }
  };

  return (
    <Layout title="Task Details">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={handleDelete}
              className="text-error hover:text-error hover:bg-error-muted"
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary-600">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        <div className="space-y-4 p-4 bg-card rounded-lg shadow-sm">
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
                <Checkbox 
                  id={`bp-${bp.id}`}
                  checked={bp.completed}
                  onCheckedChange={() => handleToggleBulletPoint(bp.id)}
                  className="mt-0.5"
                />
                <div className="flex-1 bg-muted/50 p-2 rounded-md text-sm">
                  <label 
                    htmlFor={`bp-${bp.id}`}
                    className={bp.completed ? "line-through text-muted-foreground" : ""}
                  >
                    {bp.text}
                  </label>
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
        </div>
      </div>
    </Layout>
  );
}
