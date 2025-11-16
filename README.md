# Express TypeORM Project

A TypeScript-based Express application with TypeORM for database management.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Database (PostgreSQL/MySQL/SQLite/etc.)

## Getting Started

### 1. Installation

```bash
# Install dependencies
npm install
# or
yarn install
```

### 2. Database Configuration

Setup your database connection settings in the `data-source.ts` file.

### 3. Run the Application

```bash
# Development mode
npm start
# or
yarn start
```

## Project Setup (For Reference)

If you're setting up a similar project from scratch, here are the initialization commands:

```bash
# Initialize project
yarn init -y

# Install TypeScript and Node types
yarn add -D typescript @types/node
npx tsc --init

# Install configuration packages
yarn add config dotenv
yarn add -D @types/config

# Install environment validation
yarn add envalid

# Install TypeORM
yarn add typeorm

# Install bcrypt for password hashing
yarn add bcryptjs
yarn add -D @types/bcryptjs
```

## Dependencies

- **Express** - Web framework
- **TypeORM** - ORM for TypeScript and JavaScript
- **TypeScript** - Type-safe JavaScript
- **bcryptjs** - Password hashing
- **dotenv** - Environment variable management
- **config** - Configuration management
- **envalid** - Environment variable validation

## License

ISC

