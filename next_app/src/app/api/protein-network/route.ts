import { NextResponse } from 'next/server';
import { Graph } from '@/lib/types';

// Add base URL for the server
const SERVER_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'http://nginx:80' // Internal Docker network hostname
  : 'http://localhost:80';

// Change the API base URL to use the Nginx proxy path
const API_BASE_URL = '/flaskapi/api';

async function fetchNetwork(
  seeds: string[],
  expansionMethod: string,
  interactome: string
): Promise<Graph> {
  const url = `${SERVER_BASE_URL}${API_BASE_URL}/return_network/${seeds.join(
    ","
  )}/${expansionMethod}/${interactome}/`;
  console.log('Fetching from:', url); // Add this for debugging
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data: Graph = await response.json();
  return data;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const seeds = searchParams.get('seeds')?.split(',') || [];
  const expansionMethod = searchParams.get('expansionMethod') || 'default';
  const interactome = searchParams.get('interactome') || 'default';

  try {
    const network = await fetchNetwork(seeds, expansionMethod, interactome);
    return NextResponse.json(network);
  } catch (error) {
    console.error('Error fetching protein network:', error);
    return NextResponse.json({ error: 'Failed to fetch protein network' }, { status: 500 });
  }
}
