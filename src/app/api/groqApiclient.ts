// lib/axios.js

import Groq from 'groq-sdk';
export const promptGroq = async (prompt: string) => {
    const groq = new Groq({ apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY, dangerouslyAllowBrowser: true });

    const response = await groq.chat.completions.create({
        messages: [
            {
                role: 'user',
                content: prompt,
            },
        ],
        model: 'llama3-8b-8192',
    });
    console.log(response);
    console.log(response.choices[0]?.message?.content);
    return response.choices[0]?.message?.content ?? '';
};
