import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request) {
  try {
    const { items } = await request.json();

    if (!items || !Array.isArray(items)) {
      return new Response(JSON.stringify({ error: 'Invalid items array' }), { status: 400 });
    }

    const response = await getGroqChatCompletion(items);
    const recipe = response.choices[0]?.message?.content.trim();
    console.log(recipe)
    return new Response(JSON.stringify({ recipe }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Error generating recipe' }), { status: 500 });
  }
}

export async function getGroqChatCompletion(items) {
  return groq.chat.completions.create({
    model: 'llama3-8b-8192',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant.'
      },
      {
        role: 'user',
        content: `Please suggest a short recipe using these items: ${items.join(', ')}. Please keep it in this format: (line 1) Recipe name (dont add the word recipe), (skip a line), (line 3) Ingredients: ________ (for each ingredients make sure it is in bullet points and has its own line), (skip a line), (line n) Instructions: 1. ______________ (for each instruction make sure it is numbered and has its own line). Start with Recipe, dont mention anything elese before that. Make sure the words recipe name, Ingredients and Instruction are bold. Make sure everything is its own line. Write in markdown.`
      }
    ],
    max_tokens: 800,
  });
}
