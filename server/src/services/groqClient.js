import Groq from "groq-sdk";

function getGroqClient() {
  const apiKey = (process.env.GROQ_API_KEY || "").trim();
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is missing or empty in server/.env");
  }
  return new Groq({ apiKey });
}

/**
 * Send a chat completion request to Groq.
 * Uses llama-3.3-70b-versatile for best quality answers.
 * Falls back to mixtral-8x7b-32768 if context is too large.
 *
 * @param {Array} messages - Array of {role, content} message objects
 * @param {Object} options - Optional overrides
 * @returns {string} The assistant's response text
 */
export async function chatCompletion(messages, options = {}) {
  const {
    model = "openai/gpt-oss-20b",
    temperature = 0.3,
    maxTokens = 1500,
    stream = false,
  } = options;

  try {
    if (stream) {
      return await streamCompletion(messages, { model, temperature, maxTokens });
    }

    const client = getGroqClient();
    const completion = await client.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    });

    return {
      content: completion.choices[0]?.message?.content || "",
      usage: completion.usage,
      model: completion.model,
    };
  } catch (error) {
    if (
      error.code === "context_length_exceeded" &&
      model === "openai/gpt-oss-120b"
    ) {
      console.warn(
        "Context too large for gpt-oss-120b, falling back to openai/gpt-oss-20b"
      );
      return chatCompletion(messages, {
        ...options,
        model: "openai/gpt-oss-20b",
      });
    }
    throw error;
  }
}

/**
 * Stream a chat completion response from Groq.
 * Returns an async iterator of text chunks.
 */
async function streamCompletion(messages, { model, temperature, maxTokens }) {
  const client = getGroqClient();
  const stream = await client.chat.completions.create({
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
    stream: true,
  });

  return stream;
}

export default { chatCompletion };
