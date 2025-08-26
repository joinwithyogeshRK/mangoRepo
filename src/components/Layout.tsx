import { ReactNode } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, CheckSquare, Settings, Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: ReactNode;
  title: string;
}

export function Layout({ children, title }: LayoutProps) {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-10 bg-surface shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-primary">{title}</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>

      <footer className="sticky bottom-0 bg-surface border-t border-border">
        <div className="container mx-auto">
          <nav className="flex justify-around py-2">
            <Link to="/" className="flex flex-col items-center py-1">
              <Button
                variant={isActive('/') ? 'default' : 'ghost'}
                size="icon"
                className={isActive('/') ? 'bg-primary text-primary-foreground' : ''}
              >
                <Home className="h-5 w-5" />
              </Button>
              <span className="text-xs mt-1">Home</span>
            </Link>

            <Link to="/completed" className="flex flex-col items-center py-1">
              <Button
                variant={isActive('/completed') ? 'default' : 'ghost'}
                size="icon"
                className={isActive('/completed') ? 'bg-primary text-primary-foreground' : ''}
              >
                <CheckSquare className="h-5 w-5" />
              </Button>
              <span className="text-xs mt-1">Completed</span>
            </Link>

            <Link to="/settings" className="flex flex-col items-center py-1">
              <Button
                variant={isActive('/settings') ? 'default' : 'ghost'}
                size="icon"
                className={isActive('/settings') ? 'bg-primary text-primary-foreground' : ''}
              >
                <Settings className="h-5 w-5" />
              </Button>
              <span className="text-xs mt-1">Settings</span>
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
