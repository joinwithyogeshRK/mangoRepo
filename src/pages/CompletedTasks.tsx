import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { TaskList } from '@/components/TaskList';
import { Button } from '@/components/ui/button';

export default function CompletedTasks() {
  const [cardVariant, setCardVariant] = useState<'standard' | 'neumorphic' | 'glass'>('standard');

  return (
    <Layout title="Completed Tasks">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Completed Tasks</h2>

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

        <TaskList status="completed" cardVariant={cardVariant} />
      </div>
    </Layout>
  );
}
