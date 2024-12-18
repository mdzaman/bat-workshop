I'll provide a comprehensive database schema that supports the bulk SMS platform's microservices architecture.





# Bulk SMS Platform - Database Schema

## 1. Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'client',
    sms_credits INTEGER DEFAULT 0,
    account_status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,
    company_name VARCHAR(100),
    phone_number VARCHAR(20)
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

## 2. User Roles Table
```sql
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    role_name VARCHAR(50) NOT NULL,
    permissions JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
```

## 3. Contact Groups Table
```sql
CREATE TABLE contact_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    total_contacts INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_contact_groups_user_id ON contact_groups(user_id);
```

## 4. Contacts Table
```sql
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    group_id UUID REFERENCES contact_groups(id),
    phone_number VARCHAR(20) NOT NULL,
    country_code VARCHAR(5),
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(120),
    custom_fields JSONB,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_contacts_user_id ON contacts(user_id);
CREATE INDEX idx_contacts_group_id ON contacts(group_id);
CREATE INDEX idx_contacts_phone ON contacts(phone_number);
```

## 5. SMS Campaigns Table
```sql
CREATE TABLE sms_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    name VARCHAR(100) NOT NULL,
    message_template TEXT NOT NULL,
    sender_id VARCHAR(50),
    total_recipients INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'draft',
    scheduled_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    settings JSONB
);

CREATE INDEX idx_campaigns_user_id ON sms_campaigns(user_id);
CREATE INDEX idx_campaigns_status ON sms_campaigns(status);
```

## 6. SMS Delivery Logs Table
```sql
CREATE TABLE sms_delivery_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES sms_campaigns(id),
    recipient_id UUID REFERENCES contacts(id),
    phone_number VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    external_message_id VARCHAR(100),
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    delivered_at TIMESTAMP WITH TIME ZONE,
    error_code VARCHAR(50),
    error_message TEXT,
    cost DECIMAL(10, 4)
);

CREATE INDEX idx_delivery_logs_campaign_id ON sms_delivery_logs(campaign_id);
CREATE INDEX idx_delivery_logs_status ON sms_delivery_logs(status);
CREATE INDEX idx_delivery_logs_phone ON sms_delivery_logs(phone_number);
```

## 7. Billing Transactions Table
```sql
CREATE TABLE billing_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    transaction_type VARCHAR(50) NOT NULL, -- 'credit_purchase', 'campaign_cost', etc.
    amount DECIMAL(10, 2) NOT NULL,
    credits_before INTEGER,
    credits_after INTEGER,
    description TEXT,
    payment_method VARCHAR(50),
    transaction_status VARCHAR(20) DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_billing_user_id ON billing_transactions(user_id);
CREATE INDEX idx_billing_type ON billing_transactions(transaction_type);
```

## 8. API Tokens Table
```sql
CREATE TABLE api_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    token VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100),
    permissions JSONB,
    last_used TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active'
);

CREATE INDEX idx_api_tokens_user_id ON api_tokens(user_id);
CREATE INDEX idx_api_tokens_token ON api_tokens(token);
```

## 9. Audit Logs Table
```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    details JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
```

## Database Setup Instructions

### Required PostgreSQL Extensions
```sql
-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable JSON operations
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

### Indexes and Performance Optimization
- Ensure to create appropriate indexes based on your query patterns
- Use PostgreSQL's EXPLAIN ANALYZE to optimize query performance
- Consider partitioning large tables like `sms_delivery_logs`

### Data Retention and Archiving
- Implement database-level or application-level data retention policies
- Archive old records to keep the active database performant


Key Database Design Highlights:

1. **Comprehensive Schema Coverage**
   - User management
   - Contact management
   - Campaign tracking
   - Billing and transactions
   - API access
   - Audit logging

2. **Advanced Features**
   - UUID-based primary keys
   - JSONB for flexible metadata
   - Comprehensive indexing
   - Timestamp tracking
   - Detailed status management

3. **Security Considerations**
   - Normalized user and role structures
   - Separate tables for sensitive information
   - Flexible permissions management

4. **Performance Optimization**
   - Strategic indexing
   - Normalized data structure
   - Support for large-scale operations

Recommendations:
- Use PostgreSQL 12+ for optimal JSONB and UUID support
- Implement connection pooling
- Regular database maintenance and vacuuming
- Consider read replicas for high-traffic scenarios

Would you like me to elaborate on:
- Database design rationale
- Indexing strategies
- Scaling considerations
- Data migration approaches