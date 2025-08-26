import { useState } from 'react';
import { Trash, Save, RefreshCw } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { useTaskContext } from '@/context/TaskContext';
import { useTheme } from '@/components/ThemeProvider';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function Settings() {
  const { tasks, addTask } = useTaskContext();
  const { theme, setTheme } = useTheme();
  const [defaultCardStyle, setDefaultCardStyle] = useState<string>('standard');
  const [confirmReset, setConfirmReset] = useState(false);
  
  const handleClearAllTasks = () => {
    localStorage.removeItem('tasks');
    window.location.reload();
    toast({
      title: "Success",
      description: "All tasks have been cleared",
    });
  };
  
  const handleAddSampleTasks = () => {
    // Add sample tasks
    addTask({
      title: "Complete project proposal",
      description: "Include all required sections and references",
      priority: "high",
      status: "pending",
      bulletPoints: [
        { id: "1", text: "Executive summary", completed: false },
        { id: "2", text: "Budget breakdown", completed: true },
        { id: "3", text: "Timeline", completed: false },
      ],
    });
    
    addTask({
      title: "Weekly grocery shopping",
      description: "Get items for the week",
      priority: "medium",
      status: "pending",
      bulletPoints: [
        { id: "1", text: "Fruits and vegetables", completed: false },
        { id: "2", text: "Dairy products", completed: false },
        { id: "3", text: "Bread and cereals", completed: false },
      ],
    });
    
    addTask({
      title: "Read new book",
      description: "Finish at least 3 chapters",
      priority: "low",
      status: "pending",
      bulletPoints: [],
    });
    
    toast({
      title: "Success",
      description: "Sample tasks added successfully",
    });
  };
  
  const handleSaveSettings = () => {
    localStorage.setItem('defaultCardStyle', defaultCardStyle);
    toast({
      title: "Success",
      description: "Settings saved successfully",
    });
  };

  return (
    <Layout title="Settings">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Settings</h2>
        
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how the app looks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select value={theme} onValueChange={(value) => setTheme(value as 'light' | 'dark' | 'system')}>
                <SelectTrigger id="theme">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="card-style">Default Card Style</Label>
              <Select value={defaultCardStyle} onValueChange={setDefaultCardStyle}>
                <SelectTrigger id="card-style">
                  <SelectValue placeholder="Select card style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="neumorphic">Neumorphic</SelectItem>
                  <SelectItem value="glass">Glass</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveSettings} className="bg-primary hover:bg-primary-600">
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>Manage your task data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">You currently have {tasks.length} tasks</p>
              
              <div className="flex flex-col space-y-2">
                <Button 
                  variant="outline" 
                  onClick={handleAddSampleTasks}
                  className="justify-start"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Add Sample Tasks
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => setConfirmReset(true)}
                  className="justify-start text-error hover:text-error hover:bg-error-muted"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Clear All Tasks
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {confirmReset && (
          <Card className="border-error">
            <CardHeader>
              <CardTitle className="text-error">Confirm Reset</CardTitle>
              <CardDescription>This action cannot be undone</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Are you sure you want to delete all tasks? This will remove all your data and cannot be undone.</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setConfirmReset(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleClearAllTasks}
              >
                Yes, Delete Everything
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </Layout>
  );
}
