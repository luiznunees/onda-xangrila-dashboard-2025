
import { useState } from 'react';
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

// Tipos
type TipoPermissao = 'supreme' | 'admin' | 'user';

interface Usuario {
  id: number;
  nome: string;
  email: string;
  permissao: TipoPermissao;
  ultimoAcesso: string;
}

// Dados de exemplo
const usuariosData: Usuario[] = [
  {
    id: 1,
    nome: 'Admin Master',
    email: 'admin@ondaxangrila.com.br',
    permissao: 'supreme',
    ultimoAcesso: '2025-05-28 10:15',
  },
  {
    id: 2,
    nome: 'Coordenador Geral',
    email: 'coordenador@ondaxangrila.com.br',
    permissao: 'admin',
    ultimoAcesso: '2025-05-27 15:30',
  },
  {
    id: 3,
    nome: 'Auxiliar 1',
    email: 'auxiliar1@ondaxangrila.com.br',
    permissao: 'user',
    ultimoAcesso: '2025-05-25 09:45',
  },
  {
    id: 4,
    nome: 'Auxiliar 2',
    email: 'auxiliar2@ondaxangrila.com.br',
    permissao: 'user',
    ultimoAcesso: '2025-05-26 14:20',
  },
];

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>(usuariosData);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [novoUsuario, setNovoUsuario] = useState<Omit<Usuario, 'id' | 'ultimoAcesso'>>({
    nome: '',
    email: '',
    permissao: 'user',
  });
  const [editandoUsuario, setEditandoUsuario] = useState<Usuario | null>(null);
  const [usuarioParaExcluir, setUsuarioParaExcluir] = useState<number | null>(null);

  // Adicionar novo usuário
  const handleAddUsuario = () => {
    const now = new Date().toLocaleString();
    setUsuarios([
      ...usuarios,
      {
        id: usuarios.length + 1,
        ...novoUsuario,
        ultimoAcesso: now,
      },
    ]);
    setNovoUsuario({ nome: '', email: '', permissao: 'user' });
    setDialogOpen(false);
  };

  // Iniciar edição de usuário
  const handleEditInitiate = (usuario: Usuario) => {
    setEditandoUsuario(usuario);
    setEditDialogOpen(true);
  };

  // Salvar edição de usuário
  const handleSaveEdit = () => {
    if (!editandoUsuario) return;
    
    setUsuarios(usuarios.map(u => 
      u.id === editandoUsuario.id ? editandoUsuario : u
    ));
    setEditDialogOpen(false);
    setEditandoUsuario(null);
  };

  // Iniciar exclusão de usuário
  const handleDeleteInitiate = (id: number) => {
    setUsuarioParaExcluir(id);
    setConfirmDialogOpen(true);
  };

  // Confirmar exclusão de usuário
  const handleConfirmDelete = () => {
    if (usuarioParaExcluir === null) return;
    
    setUsuarios(usuarios.filter(u => u.id !== usuarioParaExcluir));
    setConfirmDialogOpen(false);
    setUsuarioParaExcluir(null);
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
                      value={novoUsuario.nome}
                      onChange={(e) => setNovoUsuario({ ...novoUsuario, nome: e.target.value })}
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Permissão</TableHead>
                    <TableHead>Último Acesso</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usuarios.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell className="font-medium">{usuario.nome}</TableCell>
                      <TableCell>{usuario.email}</TableCell>
                      <TableCell>{renderPermissionBadge(usuario.permissao)}</TableCell>
                      <TableCell>{usuario.ultimoAcesso}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEditInitiate(usuario)}
                            disabled={usuario.permissao === 'supreme' && usuario.id === 1}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleDeleteInitiate(usuario.id)}
                            disabled={usuario.permissao === 'supreme' && usuario.id === 1}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="justify-between">
              <p className="text-sm text-muted-foreground">
                Total de usuários: {usuarios.length}
              </p>
              <p className="text-xs text-muted-foreground italic">
                Usuários "Supremo" têm acesso completo ao sistema
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
                      value={editandoUsuario.nome}
                      onChange={(e) => setEditandoUsuario({ ...editandoUsuario, nome: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={editandoUsuario.email}
                      onChange={(e) => setEditandoUsuario({ ...editandoUsuario, email: e.target.value })}
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
                      disabled={editandoUsuario.permissao === 'supreme' && editandoUsuario.id === 1}
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
  );
};

export default Usuarios;
