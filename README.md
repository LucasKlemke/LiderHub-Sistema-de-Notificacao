# LiderHub Notification System

Um sistema de notificações desenvolvido com Next.js, Prisma, SQLite e TypeScript para gerenciar notificações de usuários com diferentes tipos (menções, suporte, expiração de planos e sistema).

## 🚀 Como rodar o projeto

### Pré-requisitos

- Node.js (versão 18 ou superior)
- pnpm instalado globalmente

### 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
```

### 2. Entrar no repositório e instalar dependências

```bash
cd LiderHub-Sistema-de-Notificacao
pnpm install
```

### 3. Configurar o banco de dados Prisma

Gerar o cliente Prisma e criar/atualizar o banco de dados:

```bash
# Gerar o cliente Prisma
npx prisma generate

# Aplicar as migrations e criar o banco
npx prisma db push
```

### 4. Popular o banco com dados de exemplo

```bash
node prisma/seed.ts
```

### 5. Rodar o projeto

```bash
pnpm run dev
```

O projeto estará disponível em [http://localhost:3000](http://localhost:3000)

## 📋 Funcionalidades

- **Sistema de Notificações**: Visualização e gerenciamento de notificações
- **Tipos de Notificação**:
  - 🏷️ **MENTION**: Menções e tags em comentários
  - ⏰ **PLAN_EXPIRY**: Avisos de expiração de plano
  - 🎧 **SUPPORT**: Atualizações de tickets de suporte
  - 🔧 **SYSTEM**: Anúncios do sistema e novas funcionalidades
- **Simulador**: Ferramenta para criar e agendar notificações de teste
- **Interface Responsiva**: Design moderno com Tailwind CSS e Radix UI

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Banco de Dados**: SQLite com Prisma ORM
- **Estado**: TanStack Query (React Query)
- **Ícones**: Lucide React, Tabler Icons
- **Utilitários**: date-fns, faker.js (para seed)

## 📁 Estrutura do Projeto

```
├── app/                          # App Router do Next.js
│   ├── api/                      # API Routes
│   │   ├── notifications/        # Endpoints de notificações
│   │   └── users/               # Endpoints de usuários
│   ├── notifications/           # Página de notificações
│   └── simulation/              # Página do simulador
├── components/                  # Componentes reutilizáveis
│   └── ui/                     # Componentes de UI (shadcn/ui)
├── lib/                        # Utilitários e configurações
│   ├── hooks/                  # Custom hooks
│   └── db.ts                   # Configuração do Prisma
├── prisma/                     # Schema e configurações do banco
│   ├── schema.prisma           # Schema do banco de dados
│   └── seed.ts                 # Script para popular o banco
└── public/                     # Arquivos estáticos
```

## 🗄️ Banco de Dados

O projeto utiliza SQLite como banco de dados com as seguintes tabelas:

- **Users**: Usuários do sistema
- **Notifications**: Notificações com tipos, status de leitura e metadados

### Comandos úteis do Prisma

```bash
# Visualizar o banco no Prisma Studio
npx prisma studio

# Reset do banco (apaga todos os dados)
npx prisma db push --force-reset

# Gerar novamente o cliente após mudanças no schema
npx prisma generate
```

## 🎯 Páginas Principais

- **`/notifications`**: Lista e gerencia todas as notificações
- **`/simulation`**: Ferramenta para criar e testar notificações

## 📦 Scripts Disponíveis

- `pnpm dev`: Roda o servidor de desenvolvimento
- `pnpm build`: Gera build de produção
- `pnpm start`: Roda o servidor de produção
- `pnpm lint`: Executa o linter
- `pnpm format`: Formata o código com Prettier

## 👥 Dados de Teste

Após rodar o seed, você terá:
- 5 usuários de exemplo (incluindo `liderhubadmin@email.com`)
- 70+ notificações de diferentes tipos
- Dados realistas gerados com Faker.js

## 🔧 Desenvolvimento

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

Desenvolvido com ❤️ para o LiderHub