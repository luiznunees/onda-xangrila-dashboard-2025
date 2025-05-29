
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, LogOut, Users, Calendar, Waves, LifeBuoy, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from '@/components/dashboard/Sidebar';

const Index = () => {
  const { user, loading, signOut, userProfile } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ocean-50 to-sunset-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-ocean-800">
              Retiro Onda Xangri-lá 2025
            </CardTitle>
            <CardDescription>
              Sistema de gerenciamento interno
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-gray-600">
              Faça login para acessar o sistema de gerenciamento do retiro.
            </p>
            <Link to="/auth" className="block">
              <Button className="w-full">
                <LogIn className="mr-2 h-4 w-4" />
                Fazer Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <main className="container py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Bem-vindo, {userProfile?.nome_completo || user.email}!
              </h1>
              <p className="text-muted-foreground">
                Sistema de gerenciamento do Retiro Onda Xangri-lá 2025
              </p>
            </div>
            <Button variant="outline" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
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

            {userProfile?.permissao === 'supreme' && (
              <Link to="/usuarios">
                <Card className="hover:shadow-md transition-shadow cursor-pointer border-purple-200">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="mr-2 h-5 w-5 text-purple-600" />
                      Usuários
                    </CardTitle>
                    <CardDescription>
                      Gerencie usuários do sistema (Supremo)
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
