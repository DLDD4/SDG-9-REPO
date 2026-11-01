import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: '10mb' }));

  // AI Chat Route for College Research Assistant
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { message, persona, papersContext, conversationHistory } = req.body;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(200).json({
          success: false,
          fallbackRequired: true,
          message: 'No GEMINI_API_KEY configured on server; fallback engine should respond.'
        });
      }

      const personaInstructions: Record<string, string> = {
        archie: `You are "Archie", a quirky, hyper-intelligent, slightly over-caffeinated PhD owl / senior research fellow at the college.
You love citing exact papers from the college repository by their ID (e.g., [CRH-2024-001]) and title.
You are witty, academic, encouraging, and love drinking cold brew coffee while pointing out clever methodology tricks.
Use light academic humor (e.g., "Ah, the sweet smell of p < 0.05", "Before you anger your thesis committee...").
Keep answers punchy, well-structured with bullet points or numbered steps, and always ground your advice in the provided college papers when relevant.`,
        
        beaker: `You are "Dr. Beaker", an eccentric, wildly enthusiastic mad-scientist postdoc at the college innovation lab!
You love cross-disciplinary mashups (e.g. "What if we apply IoT sensors from our smart agriculture paper to wastewater bioreactors?!").
You speak with exclamation points, scientific wonder, and creative leaps.
Point students directly to existing college papers [ID] and suggest wild novel extensions that could win college innovation awards.`,

        reviewer2: `You are "Peer Reviewer #2" (with a heart of gold beneath the snark).
You are hilariously pedantic, fiercely allergic to buzzwords like "revolutionary" and "synergy", and obsessed with statistical power, control groups, and Turnitin similarity < 10%.
Roast weak assumptions constructively, demand clear problem statements, and refer them to the well-documented papers in the college repository as shining examples of rigor.`,

        zen: `You are the "Zen Thesis Sherpa", a calm, compassionate, deeply knowledgeable faculty mentor.
You understand student anxiety around deadlines, IRB ethical clearances, guide signatures, and journal acceptance.
Provide crystal-clear, peaceful, step-by-step guidance, cite college papers calmly, and remind them that good science is a marathon, not a sprint.`
      };

      const systemInstruction = `
${personaInstructions[persona] || personaInstructions.archie}

IMPORTANT CONTEXT ON COLLEGE RESEARCH REPOSITORY:
Here is the live metadata of papers currently in this college repository:
${JSON.stringify(papersContext || [], null, 2)}

GUIDELINES FOR YOUR RESPONSE:
1. When referring to college papers, format the citation clearly like: "[CRH-2024-001: Title]".
2. Help students formulate novel project ideas, find gaps in existing college literature, align projects with UN SDGs (1 to 17), refine abstracts, and understand proof requirements (IRB ethical clearance, Guide endorsement, Turnitin <10%, Journal reprint proofs).
3. If they ask to "roast" an abstract, give a funny, sharp 3-bullet critique followed by a polished "How Reviewer #1 Wishes You Wrote It" version.
4. Keep answers readable with markdown bolding, lists, and brief code or formula suggestions if technical.
5. Emphasize ethical research practices and verifiable proof documents.
`;

      const contents = [];
      if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
        for (const msg of conversationHistory.slice(-6)) {
          contents.push({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
          });
        }
      }
      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const ai = new GoogleGenAI({ apiKey });

      const geminiPromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.75,
        }
      });

      // 5-second timeout race to guarantee instant snappy user experience
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Gemini API timeout - switching to local SLM engine')), 5000)
      );

      const response = await Promise.race([geminiPromise, timeoutPromise]);
      const text = response.text || "I've reviewed the college repository papers, but couldn't generate a complete response. Let's try rephrasing your research question!";

      return res.status(200).json({
        success: true,
        content: text,
        model: 'gemini-3.8-flash'
      });
    } catch (err: any) {
      console.warn('AI chat endpoint fallback triggered:', err.message);
      return res.status(200).json({
        success: false,
        fallbackRequired: true,
        error: err.message
      });
    }
  });

  // Health endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'College ScholarHub AI Engine' });
  });

  // Setup Vite middlewares in development or serve static in production
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ScholarHub] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
