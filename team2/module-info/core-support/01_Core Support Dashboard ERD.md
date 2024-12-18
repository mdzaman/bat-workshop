I'll create an ERD diagram showing the database structure for the Core Support Dashboard.



```mermaid
erDiagram
    Users ||--o{ Tickets : creates
    Users ||--o{ Messages : sends
    Users {
        int user_id PK
        string email
        string name
        string password_hash
        string role
        datetime created_at
        datetime last_login
        boolean is_active
    }

    Tickets ||--o{ TicketHistory : has
    Tickets ||--o{ Messages : contains
    Tickets {
        int ticket_id PK
        int user_id FK
        int assigned_agent_id FK
        string subject
        text description
        enum status
        enum priority
        string category
        datetime created_at
        datetime updated_at
        datetime resolved_at
        int resolution_time
    }

    TicketHistory {
        int history_id PK
        int ticket_id FK
        int user_id FK
        string action
        text changes
        datetime timestamp
    }

    Messages ||--o{ Attachments : has
    Messages {
        int message_id PK
        int ticket_id FK
        int user_id FK
        text content
        boolean is_ai_response
        datetime sent_at
        boolean is_internal_note
    }

    Attachments {
        int attachment_id PK
        int message_id FK
        string file_name
        string file_type
        string file_path
        int file_size
        datetime uploaded_at
    }

    Categories {
        int category_id PK
        string name
        string description
        boolean is_active
    }

    SLAConfigurations {
        int sla_id PK
        string priority_level
        int response_time_mins
        int resolution_time_mins
        boolean is_active
    }

    AIResponses {
        int response_id PK
        string intent
        text response_template
        float confidence_score
        datetime last_used
        int usage_count
    }

    Tickets }o--|| Categories : belongs_to
    Tickets }o--|| SLAConfigurations : follows
    Messages }o--|| AIResponses : uses

```

Let me explain the key components of this ERD:

1. Core Entities:
   - Users: Stores both customers and support agents
   - Tickets: Main ticket information
   - Messages: Communication within tickets
   - TicketHistory: Tracks all changes to tickets
   - Categories: Ticket categorization
   - SLAConfigurations: Service Level Agreement rules
   - AIResponses: AI chatbot response templates

2. Key Relationships:
   - Users can create multiple tickets and messages
   - Each ticket can have multiple messages and history entries
   - Messages can have multiple attachments
   - Tickets belong to specific categories and follow SLA configurations
   - Messages can be linked to AI responses

3. Important Fields:
   - Tracking fields (created_at, updated_at, etc.)
   - Status and priority enums for tickets
   - Flags for AI responses and internal notes
   - SLA tracking fields
   - User roles and permissions

4. Special Features:
   - Resolution time tracking
   - AI response confidence scoring
   - File attachment handling
   - SLA configuration management
   - Ticket history auditing

Would you like me to:
1. Add more detailed field specifications?
2. Include additional entities for specific features?
3. Expand on any particular relationship or entity?
