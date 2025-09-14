# LiderHub Sistema de Notificações

Um sistema completo de notificações desenvolvido com Next.js 15, React 19, TypeScript, Prisma e SQLite para gerenciar notificações de usuários com diferentes tipos, agendamento e funcionalidades avançadas.

## ✨ Funcionalidades Principais

### 🔔 Sistema de Notificações Completo
- **Visualização e Gerenciamento**: Interface intuitiva para visualizar todas as notificações
- **Filtros Avançados**: Filtragem por status (lidas/não lidas) e tipos de notificação
- **Paginação Responsiva**: Sistema de paginação otimizado para desktop e mobile
- **Marcação em Massa**: Marcar todas as notificações como lidas de uma vez

### 📱 Tipos de Notificação
- 🏷️ **MENTION**: Menções e tags em comentários ou posts
- ⏰ **PLAN_EXPIRY**: Avisos de expiração de plano e lembretes de renovação
- 🎧 **SUPPORT**: Atualizações de tickets de suporte e atendimento ao cliente
- 🔧 **SYSTEM**: Anúncios do sistema, alertas de manutenção e atualizações de funcionalidades

### 📅 Sistema de Agendamento
- **Notificações Imediatas**: Envio instantâneo de notificações
- **Agendamento Flexível**: Agende notificações para datas e horários específicos
- **Processamento Automático**: Sistema para processar notificações agendadas
- **Controle de Envio**: Rastreamento de notificações enviadas vs. agendadas

### 🎯 Notificações Direcionadas
- **Notificações Específicas**: Envio para usuários específicos
- **Notificações em Massa**: Envio para todos os usuários do sistema
- **Flexibilidade de Targeting**: Escolha entre envio individual ou broadcast

### 🧪 Simulador de Notificações
- **Interface de Teste**: Ferramenta completa para criar e testar notificações
- **Formulário Intuitivo**: Interface amigável para configurar todos os parâmetros
- **Preview em Tempo Real**: Visualização das notificações antes do envio
- **Agendamento de Testes**: Possibilidade de agendar notificações de teste

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js (versão 18 ou superior)
- pnpm instalado globalmente (`npm install -g pnpm`)

### 1. Clonar o Repositório
```bash
git clone <url-do-repositorio>
cd LiderHub-Sistema-de-Notificacao
```

### 2. Instalar Dependências
```bash
pnpm install
```

### 3. Configurar o Banco de Dados
```bash
# Gerar o cliente Prisma
npx prisma generate

# Aplicar as migrations e criar o banco
npx prisma db push
```

### 4. Popular o Banco com Dados de Exemplo
```bash
node prisma/seed.ts
```

### 5. Executar o Projeto
```bash
pnpm dev
```

O projeto estará disponível em [http://localhost:3000](http://localhost:3000)

## 🛠️ Stack Tecnológica

### Frontend
- **Next.js 15**: Framework React com App Router
- **React 19**: Biblioteca de interface de usuário
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Framework de estilos utilitários
- **Radix UI**: Componentes de UI acessíveis
- **Motion**: Animações e transições
- **Lucide React & Tabler Icons**: Conjunto de ícones

### Backend & Banco de Dados
- **Prisma ORM**: Object-Relational Mapping
- **SQLite**: Banco de dados local
- **Next.js API Routes**: Endpoints da API

### Estado e Gerenciamento
- **TanStack Query (React Query)**: Gerenciamento de estado do servidor
- **React Hooks**: Hooks customizados para funcionalidades

### Desenvolvimento
- **ESLint**: Linting de código
- **Prettier**: Formatação de código
- **Faker.js**: Geração de dados de teste
- **date-fns**: Manipulação de datas

## 📁 Estrutura do Projeto

```
├── app/                          # App Router do Next.js
│   ├── api/                      # API Routes
│   │   ├── notifications/        # Endpoints de notificações
│   │   │   ├── [id]/            # Operações específicas por ID
│   │   │   ├── bulk-read/       # Marcar múltiplas como lidas
│   │   │   ├── scheduled/       # Gerenciar notificações agendadas
│   │   │   └── route.ts         # CRUD principal de notificações
│   │   └── users/               # Endpoints de usuários
│   ├── notifications/           # Página principal de notificações
│   │   └── components/          # Componentes específicos
│   ├── simulation/              # Simulador de notificações
│   │   └── components/          # Componentes do simulador
│   ├── layout.tsx               # Layout raiz da aplicação
│   └── globals.css              # Estilos globais
├── components/                  # Componentes reutilizáveis
│   ├── ui/                     # Componentes de UI (shadcn/ui)
│   ├── header.tsx              # Cabeçalho da aplicação
│   ├── sidebar-*.tsx           # Sistema de sidebar
│   └── query-provider.tsx      # Provider do React Query
├── lib/                        # Utilitários e configurações
│   ├── hooks/                  # Custom hooks
│   │   └── useNotifications.ts # Hook principal de notificações
│   ├── db.ts                   # Configuração do Prisma
│   ├── notification-service.ts # Serviços de notificação
│   ├── notification-utils.tsx  # Utilitários de notificação
│   └── utils.ts                # Utilitários gerais
├── prisma/                     # Configurações do banco
│   ├── schema.prisma           # Schema do banco de dados
│   ├── seed.ts                 # Script de população do banco
│   └── dev.db                  # Banco SQLite (gerado)
└── public/                     # Arquivos estáticos
```

## 🗄️ Modelo de Dados

### Tabela Users
```sql
- id: String (CUID, Primary Key)
- email: String (Unique)
- name: String (Optional)
- createdAt: DateTime
- updatedAt: DateTime
```

### Tabela Notifications
```sql
- id: String (CUID, Primary Key)
- title: String
- message: String
- type: NotificationType (MENTION, PLAN_EXPIRY, SUPPORT, SYSTEM)
- isRead: Boolean (Default: false)
- userId: String (Foreign Key)
- scheduledAt: DateTime (Optional - para agendamento)
- createdAt: DateTime
- updatedAt: DateTime
```

## 🔗 API Endpoints

### Notificações
- `GET /api/notifications` - Listar notificações com paginação e filtros
- `POST /api/notifications` - Criar nova notificação (individual ou em massa)
- `PATCH /api/notifications/[id]/read` - Marcar notificação específica como lida
- `PATCH /api/notifications/bulk-read` - Marcar todas as notificações como lidas

### Usuários
- `GET /api/users` - Listar todos os usuários

## 🎯 Páginas da Aplicação

### `/notifications` - Dashboard Principal
- Lista todas as notificações do usuário
- Filtros por status (todas, não lidas, lidas)
- Paginação responsiva
- Funcionalidade de marcar como lida
- Interface otimizada para desktop e mobile

### `/simulation` - Simulador de Notificações
- Formulário para criar notificações de teste
- Seleção de tipo de notificação
- Escolha entre usuário específico ou todos
- Opção de agendamento
- Feedback em tempo real

## 📦 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev              # Servidor de desenvolvimento com Turbopack
pnpm build            # Build de produção com Turbopack
pnpm start            # Servidor de produção
pnpm lint             # Executar ESLint
pnpm format           # Formatar código com Prettier
pnpm format:check     # Verificar formatação

# Banco de Dados
npx prisma studio     # Interface visual do banco
npx prisma generate   # Gerar cliente Prisma
npx prisma db push    # Aplicar mudanças no schema
npx prisma db push --force-reset  # Reset completo do banco
npx tsx prisma/seed.ts  # Popular banco com dados de teste
```

## 👥 Dados de Exemplo

Após executar o seed, você terá:
- **3 usuários** de exemplo (incluindo `liderhubadmin@email.com`)
- **9+ notificações** de diferentes tipos e status
- **Dados realistas** gerados com Faker.js
- **Notificações agendadas** para testar o sistema de scheduling

## 🔧 Desenvolvimento e Contribuição

### Setup de Desenvolvimento
1. Fork o repositório
2. Clone sua fork localmente
3. Instale as dependências com `pnpm install`
4. Configure o banco com `npx prisma db push`
5. Popule com dados de teste: `node prisma/seed.ts`
6. Execute o projeto: `pnpm dev`


### Build de Produção
```bash
pnpm build
pnpm start
```

**Desenvolvido com ❤️ para o LiderHub**

*Sistema de Notificações v1.0 - Agentes de IA totalmente humanizados*