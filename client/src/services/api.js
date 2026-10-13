/**
 * DatasheetIQ — API Client
 * Handles all communication with the backend API.
 */

const API_BASE = "http://localhost:3001/api";

/**
 * Upload a PDF file to be parsed.
 */
export async function uploadFile(file) {
  const formData = new FormData();
  formData.append("datasheet", file);

  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Upload failed");
  }

  return res.json();
}

/**
 * Upload raw pasted text.
 */
export async function uploadText(text, title) {
  const res = await fetch(`${API_BASE}/upload/text`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, title }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Text upload failed");
  }

  return res.json();
}

/**
 * Send a chat message and get a response.
 */
export async function sendMessage(sessionId, message) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, message, stream: false }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Chat request failed");
  }

  return res.json();
}

/**
 * Send a chat message with streaming response.
 * Returns a reader that yields text chunks.
 */
export async function sendMessageStream(sessionId, message, onChunk) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, message, stream: true }),
  });

  if (!res.ok) {
    let errorMsg = `Server error (${res.status})`;
    try {
      const error = await res.json();
      errorMsg = error.message || error.error || errorMsg;
    } catch {
      const text = await res.text().catch(() => "");
      if (text) errorMsg = text;
    }
    throw new Error(errorMsg);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let fullResponse = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const text = decoder.decode(value, { stream: true });
    const lines = text.split("\n\n");

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          const data = JSON.parse(line.slice(6));
          if (data.error) {
            throw new Error(data.error);
          }
          if (data.done) break;
          if (data.content) {
            fullResponse += data.content;
            onChunk(fullResponse);
          }
        } catch (err) {
          if (line.includes('"error"')) throw err;
          // Skip malformed JSON
        }
      }
    }
  }

  return fullResponse;
}

/**
 * Check API health.
 */
export async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  } catch {
    return { status: "error", message: "Cannot connect to API" };
  }
}

/**
 * Search for component inventory.
 */
export async function searchInventory(partNumber) {
  const res = await fetch(`${API_BASE}/inventory/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ partNumber }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Inventory search failed");
  }

  return res.json();
}
