import { createClient } from 'redis';

const host = process.env.FALKORDB_HOST || 'localhost';
const port = Number.parseInt(process.env.FALKORDB_PORT || '6379', 10);
const graphName = process.env.FALKORDB_GRAPH_NAME || 'ocl_agent_registry';

let cachedClient: any | null = null;

/**
 * FalkorDB connection singleton
 * FalkorDB uses Redis protocol with graph commands
 */
export async function connectToFalkorDB(): Promise<any> {
  // Return cached connection if available
  if (cachedClient && cachedClient.isOpen) {
    return cachedClient;
  }

  // Create new connection with short timeout for health checks
  const client = createClient({
    socket: {
      host,
      port,
      connectTimeout: 2000, // 2 second timeout
    },
  });

  client.on('error', (err) => {
    console.error('FalkorDB connection error:', err);
  });

  await client.connect();

  // Cache the connection
  cachedClient = client;

  return client;
}

/**
 * Execute a Cypher query on FalkorDB
 * @param query Cypher query string
 * @returns Query results
 */
export async function executeGraphQuery(query: string): Promise<any> {
  const client = await connectToFalkorDB();

  try {
    // FalkorDB uses GRAPH.QUERY command
    // Format: GRAPH.QUERY graph_name "query" [TIMEOUT milliseconds]
    const result = await client.sendCommand([
      'GRAPH.QUERY',
      graphName,
      query,
    ]);

    return result;
  } catch (error) {
    console.error('FalkorDB query error:', error);
    throw error;
  }
}

/**
 * Get graph statistics
 * @returns Graph metadata and statistics
 */
export async function getGraphStats(): Promise<any> {
  const client = await connectToFalkorDB();

  try {
    const result = await client.sendCommand(['GRAPH.QUERY', graphName, 'CALL db.labels()']);
    return result;
  } catch (error) {
    console.error('FalkorDB stats error:', error);
    throw error;
  }
}

/**
 * Close FalkorDB connection
 */
export async function closeFalkorDBConnection(): Promise<void> {
  if (cachedClient && cachedClient.isOpen) {
    await cachedClient.quit();
    cachedClient = null;
  }
}
