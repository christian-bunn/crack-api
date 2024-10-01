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
- **Why is are the other services used not suitable for this data?:** TODO
- **Bucket/instance/table name:** n11092505-assessment-2
- **Video timestamp:**
- **Relevant files:**
    - /backend/crack/s3.js

### Core - Second data persistence service

- **AWS service name:** DynamoDB
- **What data is being stored?:** file metadata. file name, password, timeCracked, user (that the file belongs to).
- **Why is this service suited to this data?:** this service works appropriately for this data.
- **Why is are the other services used not suitable for this data?:** TODO
- **Bucket/instance/table name:** n11092505-assessment2-file-metadata
- **Video timestamp:**
- **Relevant files:**
    - /backend/cognito/db.js

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

### In-memory cache

- **ElastiCache instance name:** n11092505-cache
- **What data is being cached?:** s3 pre-signed urls TODO: might have to cache something else.
- **Why is this data likely to be accessed frequently?:** users might want to download files multiple times.
- **Video timestamp:**
- **Relevant files:**
    -

### Core - Statelessness

- **What data is stored within your application that is not stored in cloud data services?:** [eg. intermediate video files that have been transcoded but not stabilised]
- **Why is this data not considered persistent state?:** [eg. intermediate files can be recreated from source if they are lost]
- **How does your application ensure data consistency if the app suddenly stops?:** [eg. journal used to record data transactions before they are done.  A separate task scans the journal and corrects problems on startup and once every 5 minutes afterwards. ]
- **Relevant files:**
    -

### Graceful handling of persistent connections

- **Type of persistent connection and use:**
- **Method for handling lost connections:**
- **Relevant files:**
    -


### Core - Authentication with Cognito

- **User pool name:** n11092505-cognito-a2
- **How are authentication tokens handled by the client?:** TODO
- **Video timestamp:**
- **Relevant files:**
    - /backend/cognito/authenticate.js
    - /backend/cognito/confirm.js
    - /backend/cognito/signUp.js
    - /backend/cognito/jwt_middleware_verify.js

### Cognito multi-factor authentication

- **What factors are used for authentication:** password, email code
- **Video timestamp:**
- **Relevant files:**
    - /backend/cognito/signUp.js
    - /backend/cognito/confirm.js

### Cognito federated identities

- **Identity providers used:**
- **Video timestamp:**
- **Relevant files:**
    -

### Cognito groups

- **How are groups used to set permissions?:** TODO: this could be a potential implementation. to create cognito group. if apart of the admin group provide restart exit code -1 button.
- **Video timestamp:**
- **Relevant files:**
    -

### Core - DNS with Route53

- **Subdomain** cracker.cab432.com
- **Video timestamp:**


### Custom security groups

- **Security group names:**
- **Services/instances using security groups:**
- **Video timestamp:**
- **Relevant files:**
    -

### Parameter store

- **Parameter names:** [eg. n1234567/base_url]
- **Video timestamp:**
- **Relevant files:**
    -

### Secrets manager

- **Secrets names:** n11092505-assessment2
- **Video timestamp:**
- **Relevant files:** TODO: this might have to be alterd to contain something other then the env access keys
    - /backend/Dockerfile
    - /backend/crack/s3/.js


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
