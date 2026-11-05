# Data Model

<!-- sdlc:auto:start entities -->
### users

| Field | Type | PK | FK | Nullable |
|---|---|---|---|---|
| id | uuid | True | — | False |
| name | varchar | False | — | False |
| email | varchar | False | — | False |
| password_hash | varchar | False | — | True |
| role | varchar | False | — | False |
| manager_id | uuid | False | users.id | True |
| is_active | boolean | False | — | False |
| anonymised_at | timestamptz | False | — | True |
| created_at | timestamptz | False | — | False |
| updated_at | timestamptz | False | — | False |

### objectives

| Field | Type | PK | FK | Nullable |
|---|---|---|---|---|
| id | uuid | True | — | False |
| title | varchar | False | — | False |
| description | text | False | — | True |
| level | varchar | False | — | False |
| owner_id | uuid | False | users.id | True |
| created_at | timestamptz | False | — | False |

### goals

| Field | Type | PK | FK | Nullable |
|---|---|---|---|---|
| id | uuid | True | — | False |
| owner_id | uuid | False | users.id | False |
| created_by | uuid | False | users.id | False |
| parent_objective_id | uuid | False | objectives.id | True |
| title | varchar | False | — | False |
| description | text | False | — | True |
| target_metric | varchar | False | — | True |
| progress_type | varchar | False | — | False |
| progress_percent | integer | False | — | True |
| status | varchar | False | — | True |
| check_in_interval_days | integer | False | — | True |
| due_date | date | False | — | False |
| completed_at | timestamptz | False | — | True |
| created_at | timestamptz | False | — | False |
| updated_at | timestamptz | False | — | False |

### check_ins

| Field | Type | PK | FK | Nullable |
|---|---|---|---|---|
| id | uuid | True | — | False |
| goal_id | uuid | False | goals.id | False |
| author_id | uuid | False | users.id | False |
| note | text | False | — | False |
| created_at | timestamptz | False | — | False |

### praise

| Field | Type | PK | FK | Nullable |
|---|---|---|---|---|
| id | uuid | True | — | False |
| sender_id | uuid | False | users.id | False |
| recipient_id | uuid | False | users.id | False |
| message | text | False | — | False |
| created_at | timestamptz | False | — | False |

### notifications

| Field | Type | PK | FK | Nullable |
|---|---|---|---|---|
| id | uuid | True | — | False |
| user_id | uuid | False | users.id | False |
| type | varchar | False | — | False |
| message | text | False | — | False |
| is_read | boolean | False | — | False |
| email_status | varchar | False | — | True |
| created_at | timestamptz | False | — | False |

### password_reset_tokens

| Field | Type | PK | FK | Nullable |
|---|---|---|---|---|
| id | uuid | True | — | False |
| user_id | uuid | False | users.id | False |
| token_hash | varchar | False | — | False |
| expires_at | timestamptz | False | — | False |
| used_at | timestamptz | False | — | True |
| created_at | timestamptz | False | — | False |

### audit_log

| Field | Type | PK | FK | Nullable |
|---|---|---|---|---|
| id | uuid | True | — | False |
| actor_id | uuid | False | users.id | True |
| entity_type | varchar | False | — | False |
| entity_id | uuid | False | — | True |
| action | varchar | False | — | False |
| changes | jsonb | False | — | True |
| created_at | timestamptz | False | — | False |
<!-- sdlc:auto:end entities -->

<!-- sdlc:auto:start relationships -->
| Source | Target | Type |
|---|---|---|
| users | users | one-to-many |
| users | goals | one-to-many |
| objectives | goals | one-to-many |
| goals | check_ins | one-to-many |
| users | praise | one-to-many |
| users | notifications | one-to-many |
| users | password_reset_tokens | one-to-many |
| users | audit_log | one-to-many |
<!-- sdlc:auto:end relationships -->

<!-- sdlc:auto:start er-diagram -->
```mermaid
erDiagram
  users {
    uuid id PK
    varchar name
    varchar email
    varchar password_hash
    varchar role
    uuid manager_id FK
    boolean is_active
    timestamptz anonymised_at
    timestamptz created_at
    timestamptz updated_at
  }
  objectives {
    uuid id PK
    varchar title
    text description
    varchar level
    uuid owner_id FK
    timestamptz created_at
  }
  goals {
    uuid id PK
    uuid owner_id FK
    uuid created_by FK
    uuid parent_objective_id FK
    varchar title
    text description
    varchar target_metric
    varchar progress_type
    integer progress_percent
    varchar status
    integer check_in_interval_days
    date due_date
    timestamptz completed_at
    timestamptz created_at
    timestamptz updated_at
  }
  check_ins {
    uuid id PK
    uuid goal_id FK
    uuid author_id FK
    text note
    timestamptz created_at
  }
  praise {
    uuid id PK
    uuid sender_id FK
    uuid recipient_id FK
    text message
    timestamptz created_at
  }
  notifications {
    uuid id PK
    uuid user_id FK
    varchar type
    text message
    boolean is_read
    varchar email_status
    timestamptz created_at
  }
  password_reset_tokens {
    uuid id PK
    uuid user_id FK
    varchar token_hash
    timestamptz expires_at
    timestamptz used_at
    timestamptz created_at
  }
  audit_log {
    uuid id PK
    uuid actor_id FK
    varchar entity_type
    uuid entity_id
    varchar action
    jsonb changes
    timestamptz created_at
  }
  users ||--o{ users : "one-to-many"
  users ||--o{ goals : "one-to-many"
  objectives ||--o{ goals : "one-to-many"
  goals ||--o{ check_ins : "one-to-many"
  users ||--o{ praise : "one-to-many"
  users ||--o{ notifications : "one-to-many"
  users ||--o{ password_reset_tokens : "one-to-many"
  users ||--o{ audit_log : "one-to-many"
```
<!-- sdlc:auto:end er-diagram -->
