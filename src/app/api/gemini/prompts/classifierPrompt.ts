export const buildClassifierPrompt = (userMessage: string) => `
You are a classifier.  
Task: Detect if the user is asking for an image.  
Rules:  
- If the user explicitly requests an image, picture, drawing, photo, diagram, or any visual content, respond "true".  
- Otherwise, respond "false".  
- Output must be only "true" or "false", no explanation.  

User message: ${userMessage}
`;
