import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

/**
 * Environment variable validation for AlignHealthcare.ai
 * Uses t3-oss/env-nextjs for type-safe environment variables
 */
export const Env = createEnv({
  server: {
    // MongoDB Configuration (Required)
    MONGODB_URI: z.string().min(1),
    MONGODB_DATABASE: z.string().min(1),

    // FalkorDB Configuration (Optional - graph database)
    FALKORDB_HOST: z.string().optional(),
    FALKORDB_PORT: z.string().optional(),
    FALKORDB_GRAPH_NAME: z.string().optional(),

    // Redis Configuration (Optional - caching)
    REDIS_HOST: z.string().optional(),
    REDIS_PORT: z.string().optional(),
    REDIS_PASSWORD: z.string().optional(),

    // Backend API URLs (Server-side)
    PYTHON_API_URL: z.string().url().optional(),
    NODE_API_URL: z.string().url().optional(),

    // Logging (Optional)
    LOGTAIL_SOURCE_TOKEN: z.string().optional(),
  },
  client: {
    // Public environment variables (accessible in browser)
    NEXT_PUBLIC_APP_URL: z.string().url().optional(),
    NEXT_PUBLIC_API_URL: z.string().url().optional(),
  },
  shared: {
    NODE_ENV: z.enum(['test', 'development', 'production']).optional(),
  },
  // Destructure all environment variables for runtime access
  runtimeEnv: {
    // MongoDB
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_DATABASE: process.env.MONGODB_DATABASE,

    // FalkorDB
    FALKORDB_HOST: process.env.FALKORDB_HOST,
    FALKORDB_PORT: process.env.FALKORDB_PORT,
    FALKORDB_GRAPH_NAME: process.env.FALKORDB_GRAPH_NAME,

    // Redis
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,

    // Backend APIs
    PYTHON_API_URL: process.env.PYTHON_API_URL,
    NODE_API_URL: process.env.NODE_API_URL,

    // Logging
    LOGTAIL_SOURCE_TOKEN: process.env.LOGTAIL_SOURCE_TOKEN,

    // Public variables
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,

    // Node environment
    NODE_ENV: process.env.NODE_ENV,
  },
});
