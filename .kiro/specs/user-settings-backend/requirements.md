# Requirements Document

## Introduction

This document specifies the requirements for implementing user profile and password management endpoints in the backend API. The frontend Settings page is already fully implemented and requires these backend endpoints to enable users to update their profile information and change their passwords securely.

## Glossary

- **User**: An authenticated user of the system with roles such as student, university, partner, admin, or finance
- **Profile_Update_Endpoint**: The PUT /api/users/profile endpoint that handles user profile updates
- **Password_Update_Endpoint**: The PUT /api/users/password endpoint that handles password changes
- **Authentication_Middleware**: The protect middleware that validates JWT tokens and ensures requests are authenticated
- **User_Model**: The MongoDB schema representing user data including name, email, password, role, and profile information
- **Password_Hash**: The bcrypt-hashed version of a user's password stored in the database

## Requirements

### Requirement 1: Profile Update Endpoint

**User Story:** As an authenticated user, I want to update my profile information (name, email, bio), so that I can keep my account details current.

#### Acceptance Criteria

1. THE Profile_Update_Endpoint SHALL accept PUT requests at /api/users/profile
2. WHEN a request is received, THE Profile_Update_Endpoint SHALL validate authentication using the Authentication_Middleware
3. WHEN the request body contains name, email, or bio fields, THE Profile_Update_Endpoint SHALL update the corresponding fields in the User_Model
4. WHEN the email field is being changed, THE Profile_Update_Endpoint SHALL verify that the new email is not already in use by another user
5. WHEN the profile update is successful, THE Profile_Update_Endpoint SHALL return the updated user data excluding the password field
6. WHEN the email is already in use by another user, THE Profile_Update_Endpoint SHALL return a 400 status code with an appropriate error message

### Requirement 2: Password Update Endpoint

**User Story:** As an authenticated user, I want to change my password by providing my current password, so that I can maintain account security.

#### Acceptance Criteria

1. THE Password_Update_Endpoint SHALL accept PUT requests at /api/users/password
2. WHEN a request is received, THE Password_Update_Endpoint SHALL validate authentication using the Authentication_Middleware
3. WHEN the request body contains currentPassword and newPassword fields, THE Password_Update_Endpoint SHALL validate that currentPassword matches the stored Password_Hash
4. WHEN the currentPassword does not match, THE Password_Update_Endpoint SHALL return a 400 status code with an error message indicating invalid current password
5. WHEN the newPassword is provided, THE Password_Update_Endpoint SHALL validate that it is at least 6 characters in length
6. WHEN the newPassword is less than 6 characters, THE Password_Update_Endpoint SHALL return a 400 status code with an error message indicating the minimum length requirement
7. WHEN the newPassword is valid and currentPassword matches, THE Password_Update_Endpoint SHALL hash the newPassword using bcrypt before storing it
8. WHEN the password update is successful, THE Password_Update_Endpoint SHALL return a success message

### Requirement 3: Error Handling

**User Story:** As a developer, I want comprehensive error handling for the user settings endpoints, so that users receive clear feedback when operations fail.

#### Acceptance Criteria

1. WHEN required fields are missing from a request, THE system SHALL return a 400 status code with an error message indicating which fields are required
2. WHEN a database error occurs during profile update, THE system SHALL return a 500 status code with an appropriate error message
3. WHEN a database error occurs during password update, THE system SHALL return a 500 status code with an appropriate error message
4. WHEN an unauthenticated request is made to either endpoint, THE Authentication_Middleware SHALL return a 401 status code with an error message

### Requirement 4: Data Model Extension

**User Story:** As a user, I want to store a bio field in my profile, so that I can provide additional information about myself.

#### Acceptance Criteria

1. THE User_Model SHALL include a bio field of type String
2. THE bio field SHALL be optional and not required for user creation
3. WHEN a user updates their profile with a bio, THE User_Model SHALL persist the bio value to the database
