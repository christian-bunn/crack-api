Assignment 2 - Web Server - Response to Criteria
================================================

Instructions
------------------------------------------------
- Keep this file named A2_response_to_criteria.md, do not change the name
- Upload this file along with your code in the root directory of your project
- Upload this file in the current Markdown format (.md extension)
- Do not delete or rearrange sections.  If you did not attempt a criterion, leave it blank
- Text inside [ ] like [eg. S3 ] are examples and should be removed


Overview
------------------------------------------------

- **Name:** Christian Bunn
- **Student number:** n11092505
- **Partner name (if applicable):** NA
- **Application name:** File Cracking Service
- **Two line description:**  In this application, you login or create an account. You then have permission to upload files to the app and download the selected files.
                             You also have the option to crack the uploaded files using hashcat and the specific mask.
- **EC2 instance name or ID:** i-04e8ee01ca7ca72e8

Core criteria
------------------------------------------------

### Core - First data persistence service

- **AWS service name:**  S3
- **What data is being stored?:** any text files
- **Why is this service suited to this data?:** s3 allows for many different types of files, which makes the service more user friendly with the files is can accept. 
- **Why is are the other services used not suitable for this data?:** AWS services like DynamoDB, are less suitable for storing unstructured data like text files due to their focus on structured data handling and higher management requirements.
- **Bucket/instance/table name:** n11092505-assessment-2
- **Video timestamp:**
- **Relevant files:**
    - /backend/crack/s3.js
    - /frontend/http/script.js
    - /backend/server.js

### Core - Second data persistence service

- **AWS service name:** DynamoDB
- **What data is being stored?:** file metadata. file name, password, timeCracked, user (that the file belongs to).
- **Why is this service suited to this data?:** this service works appropriately for this data.
- **Why is are the other services used not suitable for this data?:** S3 is not suitable for structured data queries, and RDS may introduce unnecessary overhead for simple metadata storage.
- **Bucket/instance/table name:** n11092505-assessment2-file-metadata
- **Video timestamp:**
- **Relevant files:**
    - /backend/crack/db.js
    - /backend/crack/crack.js
    - /backend/server.js

### Third data service

- **AWS service name:**
- **What data is being stored?:**
- **Why is this service suited to this data?:**
- **Why is are the other services used not suitable for this data?:**
- **Bucket/instance/table name:**
- **Video timestamp:**
- **Relevant files:**
    -

### S3 Pre-signed URLs

- **S3 Bucket names:** n11092505-assessment-2 (the object names are user specific)
- **Video timestamp:**
- **Relevant files:**
    - /backend/crack/s3.js
    - /backend/server.js
    - /frontend/http/script.js

### In-memory cache

- **ElastiCache instance name:** n11092505-cache
- **What data is being cached?:** s3 pre-signed download urls
- **Why is this data likely to be accessed frequently?:** Users might want to download files multiple times, allowing quick access without regenerating URLs each time
- **Video timestamp:**
- **Relevant files:**
    - /backend/server.js
    - /backend/s3.js
    - /backend/server.js

### Core - Statelessness

- **What data is stored within your application that is not stored in cloud data services?:** Access tokens (accessToken), ID tokens (idToken), session identifiers (session), and usernames are stored in the client's localStorage.
- **Why is this data not considered persistent state?:** This data is stored temporarily on the client side and is not maintained or replicated on the server or in any cloud databases, making it transient and non-persistent.
- **How does your application ensure data consistency if the app suddenly stops?:** Through the use of stateless JWT tokens for authentication, each request contains all necessary information, this means there is no need for server-side session storage and ensuring consistency if the application stops unexpectedly.
- **Relevant files:**
    - /frontend/http/script.js
    - /frontend/http/mfa_setup.html
    - /backend/cognito/authentication.js
    - /backend/cognito/mfa.js
    - /backend/cognito/server.js

### Graceful handling of persistent connections

- **Type of persistent connection and use:**
- **Method for handling lost connections:**
- **Relevant files:**
    -


### Core - Authentication with Cognito

- **User pool name:** n11092505-cognito-a2
- **How are authentication tokens handled by the client?:**  After successful authentication, the client stores the accessToken and idToken in localStorage. These tokens are included in the Authorization header as Bearer tokens for subsequent API requests to access protected requests. The client uses these tokens to maintain the user's authenticated state and manage access throughout the application.
- **Video timestamp:**
- **Relevant files:**
    - /backend/cognito/authenticate.js
    - /backend/cognito/confirm.js
    - /backend/cognito/signUp.js
    - /backend/cognito/jwt_middleware_verify.js
    - /frontend/http/script.js
    - /frontend/http/mfa_setup.html

### Cognito multi-factor authentication

- **What factors are used for authentication:** password, google authentictor application (can be added through qr scan or string put)
- **Video timestamp:**
- **Relevant files:**
    - /backend/cognito/signUp.js
    - /backend/cognito/confirm.js
    - /backend/cognito/authenticate.js
    - /backend/cognito/mfa.js
    - /frontend/http/script.js
    - /frontend/http/mfa_setup.html

### Cognito federated identities

- **Identity providers used:**
- **Video timestamp:**
- **Relevant files:**
    -

### Cognito groups

- **How are groups used to set permissions?:** 1 user "bunn" is assigned to specific Cognito groups, such as "admin", which define their access levels. The users JWT tokens are checked to grant or restrict access to protected routes and functionalities based on their assigned group.
- **Video timestamp:**
- **Relevant files:**
    - /backend/cognito/jwt_middleware_verify.js
    - /backend/server.js
    - /frontend/http/script.js

### Core - DNS with Route53

- **Subdomain** cracker.cab432.com
- **Video timestamp:**


### Custom security groups

- **Security group names:** n11092505-www-crack, n11092505-www-crack-cache
- **Services/instances using security groups:** Services: Elasticache, Memcached caches (n11092505-cache). Instances (i-04e8ee01ca7ca72e8 (n11092505-assessment2-bigboy))
- **Video timestamp:**
- **Relevant files:**
    - Security groups were configured in AWS console

### Parameter store

- **Parameter names:** [eg. n1234567/base_url]
- **Video timestamp:**
- **Relevant files:**
    -

### Secrets manager

- **Secrets names:**
- **Video timestamp:**
- **Relevant files:**
    - 


### Infrastructure as code

- **Technology used:**
- **Services deployed:**
- **Video timestamp:**
- **Relevant files:**
    -

### Other (with prior approval only)

- **Description:**
- **Video timestamp:**
- **Relevant files:**
    -

### Other (with prior permission only)

- **Description:**
- **Video timestamp:**
- **Relevant files:**
    -
