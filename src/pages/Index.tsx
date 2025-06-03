
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, Waves, LifeBuoy, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from '@/components/dashboard/Sidebar';
import { Alert, AlertDescription } from "@/components/ui/alert";

const Index = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <main className="container py-6">
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <AlertDescription className="text-orange-800">
              🚧 <strong>Site em atualização!</strong> Site provisório: 
              <a 
                href="https://onda-xangrila-dashboards-view.lovable.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="ml-1 underline hover:text-orange-600"
              >
                https://onda-xangrila-dashboards-view.lovable.app/
              </a>
            </AlertDescription>
          </Alert>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Retiro Onda Xangri-lá 2025
              </h1>
              <p className="text-muted-foreground">
                Sistema de gerenciamento do Retiro Onda Xangri-lá 2025
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Link to="/agenda">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-ocean-600" />
                    Agenda
                  </CardTitle>
                  <CardDescription>
                    Gerencie eventos e compromissos do retiro
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link to="/pre-inscricoes">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5 text-sunset-600" />
                    Pré-Inscrições
                  </CardTitle>
                  <CardDescription>
                    Visualize as pré-inscrições recebidas
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link to="/surfistas">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Waves className="mr-2 h-5 w-5 text-ocean-600" />
                    Surfistas
                  </CardTitle>
                  <CardDescription>
                    Gerencie as fichas dos surfistas
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link to="/apoio">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LifeBuoy className="mr-2 h-5 w-5 text-sunset-600" />
                    Equipe de Apoio
                  </CardTitle>
                  <CardDescription>
                    Gerencie a equipe de apoio
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link to="/marujos">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Crown className="mr-2 h-5 w-5 text-ocean-600" />
                    Marujos
                  </CardTitle>
                  <CardDescription>
                    Gerencie os marujos do retiro
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link to="/usuarios">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5 text-purple-600" />
                    Usuários
                  </CardTitle>
                  <CardDescription>
                    Gerencie usuários do sistema
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
