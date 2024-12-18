CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    full_name VARCHAR(100),
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    account_status VARCHAR(20) DEFAULT 'active' 
        CHECK (account_status IN ('active', 'suspended', 'inactive'))
);

-- Support Tickets Table
CREATE TABLE support_tickets (
    ticket_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'open' 
        CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    priority VARCHAR(10) 
        CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_agent_id INTEGER,
    resolution_details TEXT
);

-- Chat Conversations Table
CREATE TABLE chat_conversations (
    conversation_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    duration_seconds INTEGER,
    status VARCHAR(20) 
        CHECK (status IN ('active', 'completed', 'abandoned'))
);

-- Chat Messages Table
CREATE TABLE chat_messages (
    message_id SERIAL PRIMARY KEY,
    conversation_id INTEGER REFERENCES chat_conversations(conversation_id),
    user_id INTEGER REFERENCES users(user_id),
    message_text TEXT NOT NULL,
    sender_type VARCHAR(10) 
        CHECK (sender_type IN ('user', 'bot', 'agent')),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sentiment_score NUMERIC(5,2),
    intent VARCHAR(50)
);

-- Support Agents Table
CREATE TABLE support_agents (
    agent_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    department VARCHAR(50),
    hire_date DATE,
    active_status BOOLEAN DEFAULT TRUE,
    expertise_areas TEXT[]
);

-- Ticket Interactions Tracking
CREATE TABLE ticket_interactions (
    interaction_id SERIAL PRIMARY KEY,
    ticket_id INTEGER REFERENCES support_tickets(ticket_id),
    agent_id INTEGER REFERENCES support_agents(agent_id),
    interaction_type VARCHAR(20) 
        CHECK (interaction_type IN ('note', 'status_update', 'comment')),
    interaction_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_tickets_user ON support_tickets(user_id);
CREATE INDEX idx_tickets_status ON support_tickets(status);
CREATE INDEX idx_chat_conversations_user ON chat_conversations(user_id);
CREATE INDEX idx_chat_messages_conversation ON chat_messages(conversation_id);

-- Sample Trigger to Update Ticket Timestamps
CREATE OR REPLACE FUNCTION update_ticket_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ticket_modified_time
BEFORE UPDATE ON support_tickets
FOR EACH ROW
EXECUTE FUNCTION update_ticket_timestamp();

```

I've designed a comprehensive PostgreSQL database schema for the customer service chatbot. Let me break down the key components:

1. **Users Table**
   - Tracks user basic information
   - Includes account status and login tracking

2. **Support Tickets Table**
   - Manages customer support requests
   - Tracks ticket status and priority
   - Allows assignment to support agents

3. **Chat Conversations Table**
   - Tracks entire chat sessions
   - Records start/end times and duration
   - Monitors conversation status

4. **Chat Messages Table**
   - Stores individual messages
   - Includes sentiment scoring
   - Tracks message intent

5. **Support Agents Table**
   - Manages support team information
   - Tracks agent expertise

6. **Ticket Interactions Table**
   - Logs all interactions with support tickets
   - Tracks agent comments and updates

Additional Features:
- Performance indexes
- Timestamp auto-update trigger
- Comprehensive status and type checks
- Relationship constraints between tables
