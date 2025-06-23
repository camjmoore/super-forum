# Database Scripts

This directory contains scripts for managing the database.

## Available Scripts

### Seeding the Database

To populate the database with test data:

```bash
npm run db:seed
```

This will:
- Create an admin user (username: admin, password: AdminPass123!)
- Create 15 regular users
- Create 5 categories
- Create 30 threads
- Create approximately 120 thread items (replies)
- Create thread points and thread item points (voting)

### Cleaning the Database

To clean (drop) the database:

```bash
npm run db:clean
```

### Other Scripts

- `db:confirmuser`: Confirms a user account
- `db:addcategories`: Adds only categories to the database

## How Seeding Works

The seeding script (`robustSeed.ts`) uses a transaction to ensure all data is inserted consistently. If any part of the seeding process fails, the transaction is rolled back, ensuring the database remains in a consistent state.

The script directly uses TypeORM's entity manager to create and save entities, bypassing the TypeORM-extension seeder system for more reliable operation.

