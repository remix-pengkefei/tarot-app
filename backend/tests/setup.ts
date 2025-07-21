import dotenv from 'dotenv';
import path from 'path';

// Load test environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.test') });

// Set test environment
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/tarot_test';

// Mock Claude API if not in integration test mode
if (!process.env.INTEGRATION_TEST) {
  jest.mock('../src/services/claude.service', () => ({
    claudeService: {
      analyzeQuestion: jest.fn().mockResolvedValue({
        recommendedSpreadId: 1,
        analysis: 'Mock analysis of the question',
        recommendation: 'Mock recommendation for spread'
      }),
      interpretCard: jest.fn().mockResolvedValue(
        'Mock interpretation: This card suggests new opportunities and growth in your path.'
      )
    }
  }));
}