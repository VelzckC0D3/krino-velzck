import OpenAI from 'openai';

const openai = new OpenAI();

export default async function handler(req, res) {
  try {
    const { threadID, runID, toolOutputs } = req.body;

    if (!threadID || !runID || !toolOutputs) {
      return res.status(400).json({ error: 'Thread ID, Run ID, and Tool outputs are required' });
    }

    // Submit tool outputs
    await openai.beta.threads.runs.submitToolOutputs(threadID, runID, { tool_outputs: toolOutputs });

    // Optionally, fetch the updated run status
    const updatedRun = await openai.beta.threads.runs.retrieve(threadID, runID);
    
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(updatedRun);
  } catch (error) {
    console.error('The API encountered an error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
