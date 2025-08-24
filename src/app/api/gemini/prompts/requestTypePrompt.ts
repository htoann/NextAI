export const buildRequestTypePrompt = (message: string) => `
You are a classifier.
Task: Return only one type keyword.

Types:
- "image" → if the user explicitly requests any visual content (image, picture, drawing, photo, diagram, chart, graph, screenshot, meme, etc.).
- "text" → otherwise.

User message: "${message}"
Answer:
`;
