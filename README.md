# Public Infrastructure Issue Reporting System API

This is the backend for the Public Infrastructure Issue Reporting System, a platform designed to help citizens report and track public infrastructure issues.

## Description

The system provides a RESTful API for managing user reports, tracking issue status, and facilitating communication between citizens and authorities.

## Features

- **Issue Management:** Create, read, update, and resolve infrastructure issues.
- **User Management:** Manage users, authentication, and roles.
- **Payment Processing:** Integrated payment gateway for donations or fines.
- **Statistics:** Generate reports and view system statistics.
- **Secure Authentication:** Uses JWT and Firebase Admin for secure access.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (with Mongoose)
- **Authentication:** Firebase Admin SDK, JWT
- **Other:** CORS, Cookie Parser, Dotenv
