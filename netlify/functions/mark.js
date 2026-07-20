exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { rubric, answers, totalMarks, studentName } = JSON.parse(event.body);

    const prompt = `You are an expert academic marker. Mark the student's coursework answers according to the marking scheme.

MARKING SCHEME:
${rubric}

STUDENT NAME: ${studentName}
STUDENT ANSWERS:
${answers}

Total marks available: ${totalMarks}

Instructions:
- Award marks fairly even if the student words things differently from the rubric
- Be consistent and thorough
- Respond ONLY in this exact JSON format with no extra text whatsoever:
{
  "questions": [
    {"question": "Q1", "awarded": 15, "available": 20, "reason": "Good answer but missed X"}
  ],
  "total": 15,
  "total_available": ${totalMarks},
  "overall_feedback": "Brief constructive feedback for the student"
}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    const raw = data.content?.[0]?.text || '';
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('Could not parse AI response');
    const result = JSON.parse(match[0]);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
