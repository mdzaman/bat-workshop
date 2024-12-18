# Database Schema Design for Farmers' Digital Marketplace

## 1. User Management Database (PostgreSQL)

### 1.1 Users Table
```sql
CREATE TABLE users (
    user_id UUID PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    user_type ENUM('FARMER', 'BUYER', 'ADMIN') NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    account_status ENUM('ACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION') DEFAULT 'PENDING_VERIFICATION',
    preferred_language VARCHAR(10) DEFAULT 'bn'
);

CREATE TABLE farmer_profiles (
    farmer_id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(user_id),
    full_name VARCHAR(100) NOT NULL,
    national_id VARCHAR(20) UNIQUE NOT NULL,
    land_holding_size DECIMAL(10,2),
    primary_crop VARCHAR(50),
    secondary_crop VARCHAR(50),
    farming_experience_years INT,
    cooperative_membership VARCHAR(100),
    district VARCHAR(50),
    sub_district VARCHAR(50),
    geographical_coordinates POINT
);

CREATE TABLE buyer_profiles (
    buyer_id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(user_id),
    business_name VARCHAR(100),
    business_type ENUM('WHOLESALER', 'RETAILER', 'EXPORTER', 'PROCESSOR'),
    tax_identification_number VARCHAR(30),
    annual_purchase_volume DECIMAL(15,2),
    preferred_crops TEXT[]
);
```

## 2. Product Marketplace Database (MongoDB)

### 2.1 Product Listing Collection
```javascript
{
    _id: ObjectId,
    farmer_id: UUID,
    product_name: String,
    product_type: String, // Rice, Vegetables, Fruits
    variety: String,
    quantity: Number,
    unit: String, // KG, Ton, Maund
    quality_grade: String,
    harvest_date: Date,
    expected_price: Decimal,
    minimum_order_quantity: Number,
    product_images: [String],
    certification_documents: [String],
    listing_status: String, // ACTIVE, SOLD, EXPIRED
    location: {
        district: String,
        coordinates: {
            type: "Point",
            coordinates: [Number, Number]
        }
    },
    created_at: Timestamp,
    updated_at: Timestamp
}
```

## 3. Market Intelligence Database (Cassandra)

### 3.1 Price Tracking Table
```sql
CREATE TABLE crop_price_history (
    crop_name text,
    date date,
    district text,
    minimum_price decimal,
    maximum_price decimal,
    average_price decimal,
    trading_volume decimal,
    PRIMARY KEY ((crop_name, district), date)
) WITH CLUSTERING ORDER BY (date DESC);

CREATE TABLE demand_forecast (
    crop_name text,
    forecast_date date,
    predicted_demand decimal,
    confidence_score decimal,
    primary_factors map<text, decimal>,
    PRIMARY KEY (crop_name, forecast_date)
);
```

## 4. Financial Services Database (MySQL)

### 4.1 Financial Transactions
```sql
CREATE TABLE financial_transactions (
    transaction_id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    transaction_type ENUM('PRODUCT_SALE', 'LOAN_DISBURSEMENT', 'LOAN_REPAYMENT', 'INSURANCE_PAYMENT') NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('PENDING', 'COMPLETED', 'FAILED') NOT NULL,
    related_product_id UUID,
    payment_method VARCHAR(50),
    transaction_fees DECIMAL(10,2)
);

CREATE TABLE credit_scores (
    user_id UUID PRIMARY KEY,
    credit_score INT NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    loan_eligibility_status BOOLEAN,
    risk_category ENUM('LOW', 'MEDIUM', 'HIGH') NOT NULL
);

CREATE TABLE loan_applications (
    application_id UUID PRIMARY KEY,
    farmer_id UUID NOT NULL,
    loan_amount DECIMAL(15,2) NOT NULL,
    loan_purpose VARCHAR(100),
    application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL,
    approved_amount DECIMAL(15,2),
    interest_rate DECIMAL(5,2),
    loan_term_months INT
);
```

## 5. Advisory Services Database (PostgreSQL)

### 5.1 Advisory Tracking
```sql
CREATE TABLE crop_advisories (
    advisory_id UUID PRIMARY KEY,
    crop_name VARCHAR(50) NOT NULL,
    district VARCHAR(50) NOT NULL,
    advisory_type ENUM('DISEASE', 'PEST', 'FERTILIZER', 'WEATHER') NOT NULL,
    description TEXT NOT NULL,
    severity ENUM('LOW', 'MEDIUM', 'HIGH') NOT NULL,
    recommendation TEXT,
    effective_from DATE,
    effective_to DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE farmer_advisory_tracking (
    tracking_id UUID PRIMARY KEY,
    farmer_id UUID NOT NULL,
    advisory_id UUID NOT NULL,
    status ENUM('VIEWED', 'APPLIED', 'IGNORED') NOT NULL,
    application_date TIMESTAMP,
    feedback TEXT
);
```

## Database Relationship Considerations
- Implement foreign key constraints across services
- Use UUIDs for global unique identifiers
- Implement proper indexing for performance
- Use database-level encryption for sensitive information

## Sharding and Partitioning Strategy
- Horizontal sharding based on geographical regions
- Time-based partitioning for historical data
- Index optimization for read-heavy workloads

## Data Retention and Archiving
- Implement data retention policies
- Develop archiving mechanisms for historical data
- Ensure GDPR and local data protection compliance

## Performance Optimization
- Use read replicas for reporting and analytics
- Implement caching layers (Redis)
- Regular database maintenance and query optimization
```

This comprehensive database schema provides a robust foundation for the Farmers' Digital Marketplace platform. It covers:

1. Detailed user management with farmer and buyer profiles
2. Flexible product listing system
3. Advanced market intelligence tracking
4. Comprehensive financial transaction management
5. Advisory services and tracking

Key design principles:
- Polyglot persistence
- Unique identifier strategies
- Comprehensive data modeling
- Flexible enum-based status tracking

Would you like me to elaborate on any specific aspect of the database design or discuss the implementation considerations?
