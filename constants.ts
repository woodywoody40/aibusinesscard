export const APP_TITLE = "名片掃描管家";

export const INDUSTRIES = ["科技業", "金融業", "製造業", "醫療保健", "教育業", "餐飲業", "零售業", "建築業", "媒體與娛樂", "專業服務", "其他"];

export const GEMINI_PROMPT = `
You are an expert business card information extractor. Analyze the provided image of a business card.
Extract the following information and return it as a single, valid JSON object. Do not include any explanatory text, comments, or markdown formatting like \`\`\`json. Your output must be only the JSON object itself.

The JSON object must have this exact structure:
{
  "chineseName": "string | null",
  "englishName": "string | null",
  "company": "string | null",
  "title": "string | null",
  "phone": "string | null",
  "email": "string | null",
  "industry": "string",
  "faceBoundingBox": { "x": number, "y": number, "width": number, "height": number } | null
}

Guidelines:
1.  **Name Extraction:**
    *   Intelligently identify both the Chinese name (e.g., 王小明) and the English name (e.g., David Wang).
    *   Place them in the \`chineseName\` and \`englishName\` fields respectively.
    *   If only one type of name is present, the other field must be null. If no name is found, both must be null.

2.  **Language Priority:**
    *   For fields like \`company\` and \`title\`, if both Traditional Chinese and English versions are present, **prioritize and extract the Traditional Chinese text**.

3.  **General Extraction:**
    *   Extract values for all other fields.
    *   If a field's information is not present on the card, its value must be null.

4.  **Industry Classification:**
    *   Based on the card's content, classify the business into one of the following categories in Traditional Chinese.
    *   You **MUST** choose one from this list: ["科技業", "金融業", "製造業", "醫療保健", "教育業", "餐飲業", "零售業", "建築業", "媒體與娛樂", "專業服務", "其他"].
    *   For example, if the company is a bank or investment firm, classify it as "金融業". If it's a software company, classify it as "科技業".
    *   Assign the chosen category to the "industry" field.

5.  **Face Detection:**
    *   If a portrait photo of a person is present, provide the bounding box coordinates for the face.
    *   The coordinates (x, y, width, height) must be normalized values between 0 and 1.
    *   'x' and 'y' represent the top-left corner of the box.
    *   If no clear face is detected, the value for "faceBoundingBox" must be null.
`;