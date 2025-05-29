
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  PlusCircle,
  Trash,
  Edit,
  UserPlus,
  ShieldCheck,
  ShieldAlert,
  User,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type TipoPermissao = 'supreme' | 'admin' | 'user';

interface Usuario {
  id: string;
  nome_completo: string;
  email: string;
  permissao: TipoPermissao;
  ultimo_login: string | null;
  created_at: string;
}

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [novoUsuario, setNovoUsuario] = useState({
    email: '',
    senha: '',
    nome_completo: '',
    permissao: 'user' as TipoPermissao,
  });
  const [editandoUsuario, setEditandoUsuario] = useState<Usuario | null>(null);
  const [usuarioParaExcluir, setUsuarioParaExcluir] = useState<string | null>(null);
  const { toast } = useToast();

  const loadUsuarios = async () => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsuarios(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar usuários",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsuarios();
  }, []);

  // Adicionar novo usuário
  const handleAddUsuario = async () => {
    try {
      // Criar usuário no auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: novoUsuario.email,
        password: novoUsuario.senha,
        user_metadata: {
          nome_completo: novoUsuario.nome_completo,
        }
      });

      if (authError) throw authError;

      // Atualizar permissão se não for 'user'
      if (novoUsuario.permissao !== 'user') {
        const { error: updateError } = await supabase
          .from('usuarios')
          .update({ permissao: novoUsuario.permissao })
          .eq('auth_id', authData.user.id);

        if (updateError) throw updateError;
      }

      toast({
        title: "Usuário criado com sucesso!",
      });

      setNovoUsuario({ email: '', senha: '', nome_completo: '', permissao: 'user' });
      setDialogOpen(false);
      loadUsuarios();
    } catch (error: any) {
      toast({
        title: "Erro ao criar usuário",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Iniciar edição de usuário
  const handleEditInitiate = (usuario: Usuario) => {
    setEditandoUsuario(usuario);
    setEditDialogOpen(true);
  };

  // Salvar edição de usuário
  const handleSaveEdit = async () => {
    if (!editandoUsuario) return;
    
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({
          nome_completo: editandoUsuario.nome_completo,
          permissao: editandoUsuario.permissao,
        })
        .eq('id', editandoUsuario.id);

      if (error) throw error;

      toast({
        title: "Usuário atualizado com sucesso!",
      });

      setEditDialogOpen(false);
      setEditandoUsuario(null);
      loadUsuarios();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar usuário",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Iniciar exclusão de usuário
  const handleDeleteInitiate = (id: string) => {
    setUsuarioParaExcluir(id);
    setConfirmDialogOpen(true);
  };

  // Confirmar exclusão de usuário
  const handleConfirmDelete = async () => {
    if (!usuarioParaExcluir) return;
    
    try {
      const { error } = await supabase
        .from('usuarios')
        .delete()
        .eq('id', usuarioParaExcluir);

      if (error) throw error;

      toast({
        title: "Usuário excluído com sucesso!",
      });

      setConfirmDialogOpen(false);
      setUsuarioParaExcluir(null);
      loadUsuarios();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir usuário",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Renderizar badge de permissão
  const renderPermissionBadge = (permissao: TipoPermissao) => {
    switch (permissao) {
      case 'supreme':
        return (
          <Badge className="bg-purple-100 text-purple-800 flex items-center gap-1">
            <ShieldAlert className="h-3 w-3" /> Supremo
          </Badge>
        );
      case 'admin':
        return (
          <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" /> Administrador
          </Badge>
        );
      case 'user':
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <User className="h-3 w-3" /> Usuário
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <ProtectedRoute requiredPermission="supreme">
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <main className="container py-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Usuários</h1>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Novo Usuário
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Usuário</DialogTitle>
                    <DialogDescription>
                      Preencha os dados para criar um novo usuário no sistema.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="nome" className="text-right">
                        Nome
                      </Label>
                      <Input
                        id="nome"
                        value={novoUsuario.nome_completo}
                        onChange={(e) => setNovoUsuario({ ...novoUsuario, nome_completo: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={novoUsuario.email}
                        onChange={(e) => setNovoUsuario({ ...novoUsuario, email: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="senha" className="text-right">
                        Senha
                      </Label>
                      <Input
                        id="senha"
                        type="password"
                        value={novoUsuario.senha}
                        onChange={(e) => setNovoUsuario({ ...novoUsuario, senha: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="permissao" className="text-right">
                        Permissão
                      </Label>
                      <Select
                        value={novoUsuario.permissao}
                        onValueChange={(value) => setNovoUsuario({ ...novoUsuario, permissao: value as TipoPermissao })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Selecione uma permissão" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Permissões</SelectLabel>
                            <SelectItem value="user">Usuário</SelectItem>
                            <SelectItem value="admin">Administrador</SelectItem>
                            <SelectItem value="supreme">Supremo</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleAddUsuario}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Adicionar Usuário
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Lista de Usuários</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Carregando usuários...</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Permissão</TableHead>
                        <TableHead>Data de Criação</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usuarios.map((usuario) => (
                        <TableRow key={usuario.id}>
                          <TableCell className="font-medium">{usuario.nome_completo}</TableCell>
                          <TableCell>{usuario.email}</TableCell>
                          <TableCell>{renderPermissionBadge(usuario.permissao)}</TableCell>
                          <TableCell>{new Date(usuario.created_at).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleEditInitiate(usuario)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm" 
                                onClick={() => handleDeleteInitiate(usuario.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
              <CardFooter className="justify-between">
                <p className="text-sm text-muted-foreground">
                  Total de usuários: {usuarios.length}
                </p>
              </CardFooter>
            </Card>

            {/* Dialog de Edição */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Editar Usuário</DialogTitle>
                  <DialogDescription>
                    Modifique as informações do usuário.
                  </DialogDescription>
                </DialogHeader>
                {editandoUsuario && (
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-nome" className="text-right">
                        Nome
                      </Label>
                      <Input
                        id="edit-nome"
                        value={editandoUsuario.nome_completo}
                        onChange={(e) => setEditandoUsuario({ ...editandoUsuario, nome_completo: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-permissao" className="text-right">
                        Permissão
                      </Label>
                      <Select
                        value={editandoUsuario.permissao}
                        onValueChange={(value) => setEditandoUsuario({ ...editandoUsuario, permissao: value as TipoPermissao })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Selecione uma permissão" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Permissões</SelectLabel>
                            <SelectItem value="user">Usuário</SelectItem>
                            <SelectItem value="admin">Administrador</SelectItem>
                            <SelectItem value="supreme">Supremo</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveEdit}>
                    <Edit className="mr-2 h-4 w-4" />
                    Salvar Alterações
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Dialog de Confirmação de Exclusão */}
            <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirmar Exclusão</DialogTitle>
                  <DialogDescription>
                    Tem certeza de que deseja excluir este usuário? Esta ação não pode ser desfeita.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button variant="destructive" onClick={handleConfirmDelete}>
                    <Trash className="mr-2 h-4 w-4" />
                    Excluir Usuário
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Usuarios;
