
// Este arquivo contém dados mockados para o dashboard
// Posteriormente, estes dados serão substituídos por chamadas reais ao Supabase

export const mockDashboardData = {
  totais: {
    preInscricoes: 150,
    surfistas: 80,
    apoio: 30,
    marujos: 20,
  },
  
  distribuicao: [
    { name: 'Surfistas', value: 80, color: '#0369a1' },
    { name: 'Apoio', value: 30, color: '#38bdf8' },
    { name: 'Marujos', value: 20, color: '#f97316' },
  ],
  
  // Dados para o gráfico de tendência de pré-inscrições
  tendenciasPreInscricoes: [
    { name: '01/05', inscricoes: 3 },
    { name: '08/05', inscricoes: 8 },
    { name: '15/05', inscricoes: 12 },
    { name: '22/05', inscricoes: 18 },
    { name: '29/05', inscricoes: 25 },
    { name: '05/06', inscricoes: 38 },
    { name: '12/06', inscricoes: 50 },
  ],
  
  // Dados para os gráficos de surfistas
  surfistas: {
    nivel: [
      { name: 'Iniciante', value: 25 },
      { name: 'Intermediário', value: 40 },
      { name: 'Avançado', value: 15 },
    ],
    genero: [
      { name: 'Feminino', value: 35 },
      { name: 'Masculino', value: 45 },
    ],
    idade: [
      { name: 'Até 18', value: 10 },
      { name: '19-25', value: 25 },
      { name: '26-35', value: 30 },
      { name: '36+', value: 15 },
    ],
    pagamento: [
      { name: 'Pago', value: 60 },
      { name: 'Pendente', value: 20 },
    ],
    interesses: [
      { name: 'Aulas Extras', value: 40 },
      { name: 'Fotografia', value: 35 },
      { name: 'Yoga', value: 25 },
      { name: 'Meditação', value: 20 },
      { name: 'Competição', value: 15 },
    ],
  },
  
  // Dados para os gráficos de apoio
  apoio: {
    funcoes: [
      { name: 'Recepção', value: 8 },
      { name: 'Alimentação', value: 10 },
      { name: 'Limpeza', value: 6 },
      { name: 'Organização', value: 6 },
    ],
    disponibilidade: [
      { name: 'Sexta', value: 25 },
      { name: 'Sábado', value: 28 },
      { name: 'Domingo', value: 22 },
    ],
  },
  
  // Dados para os gráficos de marujos
  marujos: {
    especialidades: [
      { name: 'Instrutor de Surf', value: 8 },
      { name: 'Segurança Aquática', value: 7 },
      { name: 'Primeiros Socorros', value: 5 },
    ],
    certificacoes: [
      { name: 'Com Certificação', value: 15 },
      { name: 'Sem Certificação', value: 5 },
    ],
  },
};

// Tabelas simulando o Supabase
export const mockTables = {
  preInscricoes: [
    { id: 1, nome: "Ana Silva", email: "ana@email.com", telefone: "(51) 91234-5678", interesse: "surfista", dataInscricao: "2025-05-01" },
    { id: 2, nome: "João Santos", email: "joao@email.com", telefone: "(51) 92345-6789", interesse: "apoio", dataInscricao: "2025-05-05" },
    { id: 3, nome: "Maria Oliveira", email: "maria@email.com", telefone: "(51) 93456-7890", interesse: "marujo", dataInscricao: "2025-05-10" },
    { id: 4, nome: "Pedro Costa", email: "pedro@email.com", telefone: "(51) 94567-8901", interesse: "surfista", dataInscricao: "2025-05-12" },
    { id: 5, nome: "Carla Martins", email: "carla@email.com", telefone: "(51) 95678-9012", interesse: "surfista", dataInscricao: "2025-05-15" },
    { id: 6, nome: "Lucas Mendes", email: "lucas@email.com", telefone: "(51) 96789-0123", interesse: "apoio", dataInscricao: "2025-05-18" },
    { id: 7, nome: "Julia Lima", email: "julia@email.com", telefone: "(51) 97890-1234", interesse: "marujo", dataInscricao: "2025-05-20" },
    { id: 8, nome: "Rafael Alves", email: "rafael@email.com", telefone: "(51) 98901-2345", interesse: "surfista", dataInscricao: "2025-05-22" },
    { id: 9, nome: "Fernanda Sousa", email: "fernanda@email.com", telefone: "(51) 99012-3456", interesse: "surfista", dataInscricao: "2025-05-25" },
    { id: 10, nome: "Bruno Castro", email: "bruno@email.com", telefone: "(51) 90123-4567", interesse: "apoio", dataInscricao: "2025-05-28" },
  ],
  
  surfistas: [
    { id: 1, nome: 'Carolina Silva', idade: 25, genero: 'Feminino', nivel: 'intermediário', pagamento: 'pago', interesses: ['aulas-extras', 'fotografia'] },
    { id: 2, nome: 'Marcos Santos', idade: 32, genero: 'Masculino', nivel: 'avançado', pagamento: 'pago', interesses: ['yoga', 'fotografia'] },
    { id: 3, nome: 'Júlia Lima', idade: 18, genero: 'Feminino', nivel: 'iniciante', pagamento: 'pendente', interesses: ['aulas-extras'] },
    { id: 4, nome: 'André Oliveira', idade: 28, genero: 'Masculino', nivel: 'intermediário', pagamento: 'pago', interesses: ['fotografia', 'meditação'] },
    { id: 5, nome: 'Fernanda Costa', idade: 22, genero: 'Feminino', nivel: 'iniciante', pagamento: 'pendente', interesses: ['yoga', 'aulas-extras'] },
    { id: 6, nome: 'Pedro Alves', idade: 35, genero: 'Masculino', nivel: 'avançado', pagamento: 'pago', interesses: ['fotografia', 'competição'] },
    { id: 7, nome: 'Beatriz Mendes', idade: 27, genero: 'Feminino', nivel: 'intermediário', pagamento: 'pendente', interesses: ['yoga', 'meditação'] },
    { id: 8, nome: 'Lucas Souza', idade: 30, genero: 'Masculino', nivel: 'intermediário', pagamento: 'pago', interesses: ['aulas-extras', 'competição'] },
  ],
  
  apoio: [
    { id: 1, nome: 'Mariana Costa', funcao: 'recepção', disponibilidade: 'Sexta - Domingo' },
    { id: 2, nome: 'Roberto Silva', funcao: 'alimentação', disponibilidade: 'Sábado - Domingo' },
    { id: 3, nome: 'Júlio Santos', funcao: 'limpeza', disponibilidade: 'Sexta - Domingo' },
    { id: 4, nome: 'Carla Oliveira', funcao: 'organização', disponibilidade: 'Sexta - Sábado' },
    { id: 5, nome: 'Adriana Lima', funcao: 'recepção', disponibilidade: 'Domingo' },
    { id: 6, nome: 'Fernando Alves', funcao: 'alimentação', disponibilidade: 'Sexta - Domingo' },
    { id: 7, nome: 'Patrícia Mendes', funcao: 'limpeza', disponibilidade: 'Sábado' },
    { id: 8, nome: 'Ricardo Gomes', funcao: 'organização', disponibilidade: 'Sexta - Domingo' },
  ],
  
  marujos: [
    { id: 1, nome: 'Gabriel Santos', especialidade: 'instrutor', certificacoes: true, disponibilidade: 'Sexta - Domingo' },
    { id: 2, nome: 'Luciana Costa', especialidade: 'segurança', certificacoes: true, disponibilidade: 'Sábado - Domingo' },
    { id: 3, nome: 'Rodrigo Lima', especialidade: 'primeiros_socorros', certificacoes: true, disponibilidade: 'Sexta - Domingo' },
    { id: 4, nome: 'Camila Oliveira', especialidade: 'instrutor', certificacoes: false, disponibilidade: 'Domingo' },
    { id: 5, nome: 'Eduardo Martins', especialidade: 'segurança', certificacoes: true, disponibilidade: 'Sexta - Sábado' },
    { id: 6, nome: 'Amanda Vieira', especialidade: 'primeiros_socorros', certificacoes: false, disponibilidade: 'Sexta - Domingo' },
  ],
  
  usuarios: [
    { id: 1, nome: 'Admin Master', email: 'admin@ondaxangrila.com.br', permissao: 'supreme', ultimoAcesso: '2025-05-28 10:15' },
    { id: 2, nome: 'Coordenador Geral', email: 'coordenador@ondaxangrila.com.br', permissao: 'admin', ultimoAcesso: '2025-05-27 15:30' },
    { id: 3, nome: 'Auxiliar 1', email: 'auxiliar1@ondaxangrila.com.br', permissao: 'user', ultimoAcesso: '2025-05-25 09:45' },
    { id: 4, nome: 'Auxiliar 2', email: 'auxiliar2@ondaxangrila.com.br', permissao: 'user', ultimoAcesso: '2025-05-26 14:20' },
  ],
};
