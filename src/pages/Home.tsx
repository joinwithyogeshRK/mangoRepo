import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { TaskForm } from '@/components/TaskForm';
import { TaskList } from '@/components/TaskList';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [cardVariant, setCardVariant] = useState<'standard' | 'neumorphic' | 'glass'>('standard');

  return (
    <Layout title="Todo App">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">My Tasks</h2>
          <Button 
            onClick={() => setShowForm(!showForm)}
            className="bg-primary hover:bg-primary-600"
          >
            {showForm ? 'Hide Form' : 'Add Task'}
          </Button>
        </div>

        {showForm && (
          <div className="animate-accordion-down">
            <TaskForm />
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <Button 
            variant={cardVariant === 'standard' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCardVariant('standard')}
            className={cardVariant === 'standard' ? 'bg-primary hover:bg-primary-600' : ''}
          >
            Standard
          </Button>
          <Button 
            variant={cardVariant === 'neumorphic' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCardVariant('neumorphic')}
            className={cardVariant === 'neumorphic' ? 'bg-primary hover:bg-primary-600' : ''}
          >
            Neumorphic
          </Button>
          <Button 
            variant={cardVariant === 'glass' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCardVariant('glass')}
            className={cardVariant === 'glass' ? 'bg-primary hover:bg-primary-600' : ''}
          >
            Glass
          </Button>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="deleted">Deleted</TabsTrigger>
          </TabsList>
          <TabsContent value="pending" className="mt-4">
            <TaskList status="pending" cardVariant={cardVariant} />
          </TabsContent>
          <TabsContent value="deleted" className="mt-4">
            <TaskList status="deleted" cardVariant={cardVariant} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
