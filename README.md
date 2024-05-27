# SecureAuthAPI

SecureAuthAPI is a user authentication system with 2FA (Two-Factor Authentication) using SMS OTP (One-Time Password). This project allows users to register, log in, and manage their account.

## Development

To set up the development environment for this project, follow the steps below:

1. Create .env file, follow .env.example:

2. Install the required dependencies:

```sh
npm install
```

3. Start the development server, which automatically rebuilds assets on file changes:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

4. Visit the following url in your browser to check swagger documentation to test the APIs

```sh
http://localhost:4000/api-docs/
```

![usage example](https://github.com/taheroo/2fa-authentication/blob/main/docs.png)

## Project structure

A very simple project structure:

- `src`: The main container for all the application's code.
  - `model`: Contains data models that define the schema for the database.
  - `routes`: Stores all the routes (URL paths) that define the endpoints of the application.
  - `controllers`: Handle requests, process data, and return responses.
  - `services`: Contains business logic.
  - `schemas`: Defines the validation schemas using Zod.
  - `middlewares`: Middleware functions.
  - `config`: Configuration files and constants.
  - `utils`: Utility functions and helpers.

## Contribution

Contributions to this project are welcome. If you find any issues or have suggestions for improvement, please feel free to create a pull request or submit an issue on the project's repository.
