# V-Card Application Database Design

## Database Overview
- **Database Type**: MongoDB (NoSQL Document Database)
- **Primary Purpose**: Store and manage user profiles, digital business cards, and sharing metadata

## Data Collections and Schema

### 1. Users Collection
```json
{
  "_id": "ObjectId",
  "username": "String",
  "email": "String",
  "password": "String (hashed)",
  "firstName": "String",
  "lastName": "String",
  "profilePicture": "String (URL)",
  "createdAt": "DateTime",
  "updatedAt": "DateTime",
  "lastLogin": "DateTime",
  "status": "String (active/inactive/suspended)",
  "roles": ["String"],
  "preferences": {
    "theme": "String",
    "language": "String",
    "notifications": "Boolean"
  }
}
```

#### Data Dictionary - Users Collection
| Field Name       | Data Type | Description                           | Constraints                |
|-----------------|-----------|---------------------------------------|----------------------------|
| _id             | ObjectId  | Unique identifier for user            | Primary Key, Auto-generated|
| username        | String    | User's chosen username                | Unique, 3-50 characters    |
| email           | String    | User's email address                  | Unique, Valid email format |
| password        | String    | Hashed password                       | Required, Hashed           |
| firstName       | String    | User's first name                     | Optional, Max 100 chars    |
| lastName        | String    | User's last name                      | Optional, Max 100 chars    |
| profilePicture  | String    | URL to profile picture                | Optional                   |
| createdAt       | DateTime  | Account creation timestamp            | Auto-generated             |
| updatedAt       | DateTime  | Last profile update timestamp         | Auto-generated             |
| lastLogin       | DateTime  | Timestamp of last login               | Auto-updated               |
| status          | String    | Account status                        | Enum: active/inactive/suspended |
| roles           | Array     | User roles and permissions            | Default: ['user']          |
| preferences     | Object    | User application preferences          | Optional                   |

### 2. VCards Collection
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: Users)",
  "cardType": "String",
  "title": "String",
  "templateId": "String",
  "designConfig": {
    "color": "String",
    "layout": "String",
    "font": "String"
  },
  "contactInfo": {
    "fullName": "String",
    "jobTitle": "String",
    "company": "String",
    "email": "String",
    "phone": "String",
    "address": "String"
  },
  "socialLinks": [
    {
      "platform": "String",
      "url": "String"
    }
  ],
  "qrCodeUrl": "String",
  "publicShareLink": "String",
  "createdAt": "DateTime",
  "updatedAt": "DateTime",
  "isPublic": "Boolean"
}
```

#### Data Dictionary - VCards Collection
| Field Name      | Data Type      | Description                      | Constraints                |
|----------------|----------------|----------------------------------|----------------------------|
| _id            | ObjectId       | Unique card identifier           | Primary Key, Auto-generated|
| userId         | ObjectId       | Reference to creating user       | Foreign Key to Users       |
| cardType       | String         | Type of digital card             | Enum: personal/professional|
| title          | String         | Card display title               | Required, Max 100 chars    |
| templateId     | String         | Design template identifier       | Optional                   |
| designConfig   | Object         | Card visual configuration        | Optional                   |
| contactInfo    | Object         | Detailed contact information     | Required                   |
| socialLinks    | Array of Obj   | Social media and professional links | Optional               |
| qrCodeUrl      | String         | URL of generated QR code         | Optional                   |
| publicShareLink| String         | Unique public sharing link        | Unique, Optional           |
| createdAt      | DateTime       | Card creation timestamp          | Auto-generated             |
| updatedAt      | DateTime       | Last card update timestamp       | Auto-generated             |
| isPublic       | Boolean        | Visibility of card               | Default: false             |

### 3. ShareLinks Collection
```json
{
  "_id": "ObjectId",
  "cardId": "ObjectId (ref: VCards)",
  "userId": "ObjectId (ref: Users)",
  "uniqueShareId": "String",
  "expiresAt": "DateTime",
  "accessCount": "Number",
  "maxAccesses": "Number",
  "createdAt": "DateTime",
  "status": "String"
}
```

#### Data Dictionary - ShareLinks Collection
| Field Name     | Data Type | Description                        | Constraints                |
|---------------|-----------|------------------------------------|-----------------------------|
| _id           | ObjectId  | Unique share link identifier       | Primary Key, Auto-generated |
| cardId        | ObjectId  | Referenced V-Card                  | Foreign Key to VCards       |
| userId        | ObjectId  | Card owner's user ID               | Foreign Key to Users        |
| uniqueShareId | String    | Unique URL-friendly identifier     | Unique, Required            |
| expiresAt     | DateTime  | Link expiration timestamp          | Optional                    |
| accessCount   | Number    | Number of times link was accessed  | Default: 0                  |
| maxAccesses   | Number    | Maximum allowed link accesses      | Optional                    |
| createdAt     | DateTime  | Share link creation timestamp      | Auto-generated              |
| status        | String    | Link status                        | Enum: active/expired/disabled |

## Indexing Strategy
1. Users Collection:
   - Unique Index on `email`
   - Text Index on `firstName`, `lastName`

2. VCards Collection:
   - Index on `userId`
   - Text Index on `contactInfo.fullName`, `contactInfo.company`
   - Unique Index on `publicShareLink`

3. ShareLinks Collection:
   - Index on `cardId`
   - Unique Index on `uniqueShareId`
   - Index on `expiresAt`

## Validation Rules
- Email format validation
- Password complexity requirements
- Phone number format validation
- Prevent duplicate email registrations
- Limit social links to specific platforms

## Relationships
- One-to-Many: User to VCards
- One-to-Many: VCard to ShareLinks

## Recommended MongoDB Configuration
```yaml
# MongoDB Connection and Performance Tuning
net:
  port: 27017
  bindIp: 0.0.0.0

storage:
  wiredTiger:
    engineConfig:
      cacheSizeGB: 2  # Adjust based on server resources

setParameter:
  readConcern: local
  writeConcern: { w: 1 }
```

## Security Considerations
- Use field-level encryption for sensitive data
- Implement role-based access control
- Regular index and collection maintenance
- Set up IP whitelisting
- Use connection pooling

## Potential Scaling Approaches
- Sharding based on `userId`
- Read replicas for analytics
- Caching layer (Redis) for frequent queries
- Periodic archiving of old share links

## Recommended Backup Strategy
- Daily incremental backups
- Weekly full backups
- Offsite backup storage
- Automated backup rotation

Would you like me to elaborate on any specific aspect of the database design or discuss potential optimizations?
