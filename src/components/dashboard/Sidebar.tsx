
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Home,
  Calendar,
  Users,
  User,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  Clock,
  AlignJustify,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

type NavigationItem = {
  name: string;
  href: string;
  icon: React.ElementType;
  permission?: 'supreme' | 'admin' | 'user';
};

// Mock para simular permissões do usuário
const userPermission = 'supreme'; // Pode ser 'supreme', 'admin', 'user'

const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Pré-Inscrições', href: '/pre-inscricoes', icon: UserPlus },
  { name: 'Surfistas', href: '/surfistas', icon: User },
  { name: 'Apoio', href: '/apoio', icon: Users },
  { name: 'Marujos', href: '/marujos', icon: Users },
  { name: 'Agenda', href: '/agenda', icon: Calendar },
  { name: 'Cronograma', href: '/cronograma', icon: Clock },
  { name: 'Usuários', href: '/usuarios', icon: Users, permission: 'supreme' },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={cn(
      "h-screen bg-white dark:bg-sidebar sticky top-0 flex flex-col border-r transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center p-4">
        {!collapsed && (
          <div className="flex-1">
            <h1 className="text-ocean-600 dark:text-ocean-400 text-lg font-bold">Onda Xangri-lá</h1>
            <p className="text-xs text-muted-foreground">Dashboard 2025</p>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="ml-auto"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <Separator className="my-2" />

      <div className="flex-1 overflow-y-auto py-2">
        <nav className="px-2 space-y-1">
          {navigation.filter(item => 
            !item.permission || item.permission === userPermission
          ).map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all",
                  isActive
                    ? "bg-ocean-500 text-white"
                    : "text-gray-700 hover:bg-ocean-100 dark:text-gray-300 dark:hover:bg-ocean-900/20"
                )}
              >
                <item.icon className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4">
        <div className={cn(
          "rounded-lg bg-ocean-50 dark:bg-ocean-900/20 p-3",
          collapsed ? "items-center justify-center" : ""
        )}>
          {!collapsed ? (
            <>
              <p className="text-xs font-medium text-ocean-600 dark:text-ocean-400">Retiro 2025</p>
              <p className="text-xs text-muted-foreground">18-20 de julho</p>
            </>
          ) : (
            <BarChart className="h-5 w-5 mx-auto text-ocean-600 dark:text-ocean-400" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
