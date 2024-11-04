---
title: "CAB432 Project Report"
author:
- "Christian Bunn - n11092505"
---

# Application overview

*Remove these instructions:  *
*Give a brief (1 paragraph) overview of what your application does.*
This file-cracking application enables users to upload encrypted files and initiate cracking jobs to retrieve file passwords. 
The system processes these requests via AWS-managed resources (all mentioned below), leveraging ECS and microservices for distributed job handling, and returns passwords (not cracked files) securely. 
Users must authenticate, and multi-factor authentication (MFA) is available for added security.

# Application architecture

*Remove these instructions:*
*Your architecture diagram goes here* TODO

Service Breakdown:
- S3: Stores user-uploaded files, which are securely stored and accessed via pre-signed URLs.
- Cognito: Manages user authentication and authorization, including MFA.
- DynamoDB: Tracks metadata of each cracking job, including user ID, file, mask, status, and results.
- SQS: Queues cracking jobs, allowing asynchronous processing and scaling.
- ECS (backend and cracker services): Hosts microservices, with backend handling user requests and cracker handling the password-cracking process.


## Project Core - Microservices TODO

- **First service functionality:** [eg. Public facing API server]
- **First service compute:** [eg. EC2/Lambda/ECS, instance ID/name]
- **First service source files:**
  - [eg. source code filenames or directory]

- **Second service functionality:** 
- **Second service compute:**
- **Second service source files:**
  - 

- **Video timestamp:**


## Project Additional - Additional microservices TODO

- **Third service functionality:**
- **Third service compute:**
- **Third service source files:**
  - 

- **Fourth service functionality:**
- **Fourth service compute:**
- **Fourth service source files:**
  - 

- **Video timestamp:**


## Project Additional - Serverless functions

- **Service(s) deployed on Lambda:**
- **Video timestamp:**
- **Relevant files:**
    -


## Project Additional - Container orchestration with ECS TODO

- **ECS cluster name:**
- **Task definition names:**
- **Video timestamp:**
- **Relevant files:**
    -


## Project Core - Load distribution

- **Load distribution mechanism:** [eg. SQS, ALB,...]
- **Mechanism instance name:** [eg. n1234567-project-alb]
- **Video timestamp:**
- **Relevant files:**
    -


## Project Additional - Communication mechanisms TODO

- **Communication mechanism(s):** [eg. SQS, EventBridge, ...]
- **Mechanism instance name:** [eg. n1234567-project-sqs]
- **Video timestamp:**
- **Relevant files:**
    -


## Project Core - Autoscaling TODO

- **EC2 Auto-scale group or ECS Service name:**
- **Video timestamp:**
- **Relevant files:**
    -


## Project Additional - Custom scaling metric

- **Description of metric:** [eg. age of oldest item in task queue]
- **Implementation:** [eg. custom cloudwatch metric with lambda]
- **Rationale:** [discuss both small and large scales]
- **Video timestamp:**
- **Relevant files:**
    -


## Project Core - HTTPS TODO

- **Domain name:**
- **Certificate ID:**
- **ALB/API Gateway name:**
- **Video timestamp:**
- **Relevant files:**
    -


## Project Additional - Container orchestration features

- **First additional ECS feature:** [eg. service discovery]
- **Second additional ECS feature:**
- **Video timestamp:**
- **Relevant files:**
    -


## Project Additional - Infrastructure as Code

- **Technology used:** [eg. CloudFormation, Terraform, ...]
- **Services deployed:** [eg. ALB, SQS, ....  Only Block 3 services need to be listed]
- **Video timestamp:**
- **Relevant files:**
    -


## Project Additional - Edge Caching

- **Cloudfront Distribution ID:**
- **Content cached:**
- **Rationale for caching:**
- **Video timestamp:**
- **Relevant files:**
    -


## Project Additional - Other (with prior permission only)

- **Description:**
- **Video timestamp:**
- **Relevant files:**
    -   


# Cost estimate

*Remove these instructions:*
*Include the public share link from the AWS cost calculator*
*Include a summary of the total price  per month for each AWS service that you use*
*eg:*
*- EC2: 25.75*

# Scaling up


# Security


# Sustainability


# Bibliography

*Remove this section if not being used.*

