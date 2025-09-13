# API de Notificações Simplificada

## Visão Geral

A arquitetura de notificações foi simplificada para usar apenas um endpoint principal: `/api/notifications`

## Endpoint Principal

### POST /api/notifications

Cria uma nova notificação com título, descrição e tipo definidos pelo usuário.

#### Parâmetros

```typescript
{
  title: string;           // Título da notificação (obrigatório)
  description: string;     // Descrição da notificação (obrigatório)
  type: NotificationType;  // CAMPAIGN | MENTION | PLAN_EXPIRY | TICKET | SYSTEM
  targetType?: 'all' | 'specific'; // Default: 'all'
  userId?: string;         // Obrigatório se targetType = 'specific'
  scheduledDate?: string;  // ISO string para agendamento (opcional)
}
```

#### Exemplos de Uso

**1. Notificação imediata para todos os usuários:**

```javascript
const response = await fetch('/api/notifications', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Nova Campanha Disponível',
    description: 'Confira nossa nova campanha de marketing!',
    type: 'CAMPAIGN',
  }),
});
```

**2. Notificação para usuário específico:**

```javascript
const response = await fetch('/api/notifications', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Você foi mencionado',
    description: 'João te marcou em um comentário',
    type: 'MENTION',
    targetType: 'specific',
    userId: 'user123',
  }),
});
```

**3. Notificação agendada:**

```javascript
const response = await fetch('/api/notifications', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Lembrete: Reunião amanhã',
    description: 'Não esqueça da reunião às 14h',
    type: 'SYSTEM',
    targetType: 'specific',
    userId: 'user123',
    scheduledDate: '2024-01-15T14:00:00Z',
  }),
});
```

## Resposta da API

```typescript
{
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  userId: string | null;
  scheduledAt: Date | null;
  sentAt: Date | null;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
  metadata: any;
  message: string; // Mensagem de status da operação
  isScheduled: boolean; // Indica se foi agendada
}
```

## Tipos de Notificação

- **CAMPAIGN**: Notificações de marketing/campanhas
- **MENTION**: Quando um usuário é mencionado
- **PLAN_EXPIRY**: Avisos sobre expiração de plano
- **TICKET**: Notificações sobre tickets de suporte
- **SYSTEM**: Notificações do sistema

## Agendamento

As notificações podem ser agendadas usando o campo `scheduledDate`. Notificações agendadas:

- Não são marcadas como enviadas imediatamente (`sentAt` = null)
- Podem ser processadas pelo scheduler em `/api/notifications/scheduled`
- Retornam `isScheduled: true` na resposta

## Migração dos Endpoints Antigos

Os seguintes endpoints foram **removidos**:

- `/api/events/campaign`
- `/api/events/mention`
- `/api/events/plan-expiry`
- `/api/events/ticket`

Todos agora usam `/api/notifications` com o parâmetro `type` correspondente.

## NotificationService Atualizado

O `NotificationService` foi simplificado e agora suporta:

```typescript
// Método principal unificado
NotificationService.create({
  title: 'Título',
  description: 'Descrição',
  type: 'CAMPAIGN',
  targetType: 'all',
});

// Método simplificado
NotificationService.createSimpleNotification(
  'Título',
  'Descrição',
  'CAMPAIGN',
  { userId: 'user123', targetType: 'specific' }
);
```
