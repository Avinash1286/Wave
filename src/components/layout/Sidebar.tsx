import React from 'react';
import { Home, MessageSquare, Users, Settings, Info, ChevronsLeft, ChevronsRight, Moon, Sun, User, Mic, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import { logoutUser } from '@/utils/auth';
import { toast } from 'sonner';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

type SidebarProps = {
  isOpen: boolean;
  closeSidebar: () => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
};

type NavItem = {
  title: string;
  path: string;
  icon: React.ElementType;
};

const navigationItems: NavItem[] = [
  { title: 'Home', path: '/', icon: Home },
  { title: 'Voice Feed', path: '/feed', icon: Mic },
  { title: 'Friends', path: '/friends', icon: Users },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar, isCollapsed, toggleCollapse }) => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logoutUser();
    toast.success('Logged out successfully');
    navigate('/');
  };

  // Close sidebar when clicking outside on mobile
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeSidebar();
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={handleBackdropClick}
        />
      )}
      
      {/* Sidebar for desktop/tablet */}
      <aside 
        className={cn(
          "fixed md:relative top-0 left-0 h-screen bg-card border-r border-border z-50 md:z-0 transition-all duration-300 ease-in-out flex flex-col md:flex",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          isCollapsed ? "w-[4.5rem]" : "w-64",
          "hidden md:flex"
        )}
      >
        <div className="p-4 h-16 flex items-center border-b border-border">
          <div className="flex items-center gap-2 w-full">
            <img
              src="/images/logo.png"
              alt="VoiceWave Logo"
              className={cn(
                "object-cover rounded-md transition-[width,height,margin] duration-300 ease-in-out",
                isCollapsed
                  ? "w-8 h-8"
                  : "h-12 w-[40%] min-w-[48px] max-w-[180px]"
              )}
              style={{
                // Center horizontally when expanded
                ...(isCollapsed
                  ? { marginLeft: 0, marginRight: 0 }
                  : { marginLeft: 'auto', marginRight: 'auto', display: 'block' })
              }}
            />
          </div>
        </div>
        
        <nav className="p-4 space-y-1 flex-1">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary font-medium" 
                  : "hover:bg-primary/5 text-foreground"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className={cn(
                "transition-opacity duration-200",
                isCollapsed ? "opacity-0 w-0" : "opacity-100"
              )}>
                {item.title}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className={cn(
            "flex items-center gap-2",
            isCollapsed ? "flex-col" : "justify-around"
          )}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-full"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/about')}>
                  <Info className="h-4 w-4 mr-2" />
                  About
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-20 -mr-4 h-8 w-8 rounded-full border shadow-md hidden md:flex"
          onClick={toggleCollapse}
        >
          {isCollapsed ? 
            <ChevronsRight className="h-4 w-4" /> : 
            <ChevronsLeft className="h-4 w-4" />
          }
        </Button>
      </aside>

      {/* Bottom navigation for mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border flex justify-around items-center h-16 md:hidden">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center flex-1 h-full text-xs gap-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
              )
            }
          >
            <item.icon className="h-6 w-6 mb-0.5" />
            <span>{item.title}</span>
          </NavLink>
        ))}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Settings className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <User className="h-4 w-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/about')}>
              <Info className="h-4 w-4 mr-2" />
              About
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </>
  );
};

export default Sidebar;
