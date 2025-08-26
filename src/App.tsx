import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import Home from './pages/Home';
import TaskDetails from './pages/TaskDetails';
import Settings from './pages/Settings';
import CompletedTasks from './pages/CompletedTasks';
import { TaskProvider } from './context/TaskContext';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="todo-theme">
      <TaskProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/task/:id" element={<TaskDetails />} />
            <Route path="/completed" element={<CompletedTasks />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Router>
        <Toaster />
      </TaskProvider>
    </ThemeProvider>
  );
}

export default App;
