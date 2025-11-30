task 1: Implement the authentication system for this website. The frontend for sign-up and login pages is already done. You need to create the backend logic to handle user registration, login, and session management.

# Authentication System Documentation

This document outlines the authentication system implemented for the website, including user registration, login, and session management.

## Table of Contents

- [User Registration](#user-registration)
- [User Login](#user-login)
- [Session Management](#session-management)

## User Registration

To register a new user, the following steps are performed:

1. **Input Validation**: The system validates the input data (username, email, password) to ensure they meet the required criteria (e.g., valid email format, password strength).
2. **Password Hashing**: The password is hashed using a secure hashing algorithm (e.g., bcrypt) before storing it in the database.
3. **Database Storage**: The user information (username, email, hashed password) is stored in the users table in the database.
4. **Confirmation Email**: An optional confirmation email can be sent to the user to verify their email address.
5. **Response**: The system responds with a success message or an error message if the registration fails (e.g., username already exists).

## User Login

To log in a user, the following steps are performed:

1. **Input Validation**: The system validates the input data (username/email and password).
2. **User Lookup**: The system looks up the user in the database using the provided username or email.
3. **Password Verification**: The provided password is compared with the stored hashed password using a secure comparison method.
4. **Session Creation**: If the password is correct, a session is created for the user, and a session token is generated.
5. **Response**: The system responds with a success message and the session token or an error message if the login fails (e.g., incorrect password).

## Session Management

Session management is handled as follows:

1. **Session Storage**: Sessions are stored in a secure manner, either in-memory, in a database, or using a session management service.
2. **Session Expiry**: Sessions have an expiration time to enhance security. Users will need to log in again after the session expires.
3. **Session Validation**: Each time a user makes a request, the session token is validated to ensure the user is authenticated.
4. **Logout**: Users can log out, which invalidates the session token and removes the session from storage.
5. **Remember Me**: An optional "Remember Me" feature can be implemented to extend session duration based on user preference.