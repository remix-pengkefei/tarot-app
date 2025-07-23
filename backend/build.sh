#!/bin/bash

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Create database directory
mkdir -p prisma

# Run database migrations
npx prisma migrate deploy

# Seed the database
npm run prisma:seed

# Build the application
npm run build

echo "Build completed successfully!"