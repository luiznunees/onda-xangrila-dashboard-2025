
import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Plus, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface Usuario {
  id: string;
  nome_completo: string;
  email: string;
  permissao: string;
}

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | undefined>();
  const [formData, setFormData] = useState({
    nome_completo: '',
    email: '',
    permissao: 'user'
  });
  const { toast } = useToast();

  const handleSaveUser = () => {
    if (editingUser) {
      // Editar usuário
      setUsuarios(usuarios.map(u => 
        u.id === editingUser.id 
          ? { ...editingUser, ...formData }
          : u
      ));
      toast({
        title: "Usuário atualizado!",
        description: "As alterações foram salvas com sucesso.",
      });
    } else {
      // Criar novo usuário
      const newUser: Usuario = {
        id: `user_${Date.now()}`,
        ...formData
      };
      setUsuarios([...usuarios, newUser]);
      toast({
        title: "Usuário criado!",
        description: "O novo usuário foi adicionado com sucesso.",
      });
    }
    
    setShowUserForm(false);
    setEditingUser(undefined);
    setFormData({ nome_completo: '', email: '', permissao: 'user' });
  };

  const handleEditUser = (user: Usuario) => {
    setEditingUser(user);
    setFormData({
      nome_completo: user.nome_completo,
      email: user.email,
      permissao: user.permissao
    });
    setShowUserForm(true);
  };

  const handleDeleteUser = (userId: string) => {
    setUsuarios(usuarios.filter(u => u.id !== userId));
    toast({
      title: "Usuário excluído",
      description: "O usuário foi removido com sucesso.",
    });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <main className="container py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Usuários</h1>
            <Button onClick={() => {
              setEditingUser(undefined);
              setFormData({ nome_completo: '', email: '', permissao: 'user' });
              setShowUserForm(true);
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Usuário
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Gerenciamento de Usuários ({usuarios.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {usuarios.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum usuário encontrado.</p>
              ) : (
                <div className="space-y-4">
                  {usuarios.map((usuario) => (
                    <div key={usuario.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{usuario.nome_completo}</h4>
                          <p className="text-sm text-muted-foreground">{usuario.email}</p>
                          <p className="text-xs text-muted-foreground">Permissão: {usuario.permissao}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditUser(usuario)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteUser(usuario.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      <Dialog open={showUserForm} onOpenChange={setShowUserForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                value={formData.nome_completo}
                onChange={(e) => setFormData({ ...formData, nome_completo: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="permissao">Permissão</Label>
              <select
                id="permissao"
                value={formData.permissao}
                onChange={(e) => setFormData({ ...formData, permissao: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="user">Usuário</option>
                <option value="admin">Admin</option>
                <option value="supreme">Supreme</option>
              </select>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowUserForm(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleSaveUser}>
              {editingUser ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Usuarios;
