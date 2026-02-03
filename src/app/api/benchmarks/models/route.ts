import { NextResponse } from 'next/server';

// This would normally fetch from your OCL registry
// For now, we'll return a default set of models
export async function GET() {
  try {
    // TODO: Replace with actual OCL registry API call
    // const response = await fetch('http://localhost:8082/api/models', {
    //   headers: {
    //     'Authorization': `Bearer ${process.env.OCL_API_KEY}`,
    //   },
    // });
    // const data = await response.json();

    // Default models for now
    const models = [
      {
        id: 'claude-3-5-sonnet-20241022',
        name: 'Claude 3.5 Sonnet',
        provider: 'Anthropic',
        description: 'Most capable Claude model for complex tasks',
      },
      {
        id: 'claude-3-5-haiku-20241022',
        name: 'Claude 3.5 Haiku',
        provider: 'Anthropic',
        description: 'Fast and efficient for quick responses',
      },
      {
        id: 'claude-3-opus-20240229',
        name: 'Claude 3 Opus',
        provider: 'Anthropic',
        description: 'Previous generation flagship model',
      },
      {
        id: 'gpt-4o',
        name: 'GPT-4o',
        provider: 'OpenAI',
        description: 'Latest GPT-4 Omni model',
      },
      {
        id: 'gpt-4o-mini',
        name: 'GPT-4o Mini',
        provider: 'OpenAI',
        description: 'Cost-effective GPT-4 variant',
      },
      {
        id: 'gpt-4-turbo',
        name: 'GPT-4 Turbo',
        provider: 'OpenAI',
        description: 'Faster GPT-4 with large context',
      },
      {
        id: 'gemini-1.5-pro',
        name: 'Gemini 1.5 Pro',
        provider: 'Google',
        description: 'Google\'s most capable model',
      },
      {
        id: 'gemini-1.5-flash',
        name: 'Gemini 1.5 Flash',
        provider: 'Google',
        description: 'Fast and efficient Gemini variant',
      },
    ];

    return NextResponse.json({
      models,
      source: 'default', // Change to 'ocl-registry' when connected
    });
  } catch (error) {
    console.error('Error fetching models:', error);
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 },
    );
  }
}
