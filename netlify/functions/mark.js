exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { rubric, answers, totalMarks, studentName } = JSON.parse(event.body);

    const prompt = `You are an expert academic marker for an African university.

MARKING GUIDE:
${rubric}

STUDENT NAME: ${studentName}

STUDENT ANSWERS:
${answers}

TOTAL MARKS AVAILABLE: ${totalMarks}

Mark fairly. Award marks even if student uses different wording as long as the meaning is correct. Be encouraging and constructive.

Respond ONLY in this exact JSON format, no extra text, no markdown, no backticks:
{
  "questions": [
    {"question": "Q1", "awarded": 15, "available": 20, "reason": "Good answer but missed X"}
  ],
  "total": 15,
  "total_available": ${totalMarks},
  "overall_feedback": "Constructive encouraging feedback for the student"
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
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error?.message || 'Claude API error');
    }

    const data = await response.json();
    const raw = data.content?.[0]?.text || '';
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('Could not parse AI response');
    const result = JSON.parse(match[0]);

    return { statusCode: 200, headers, body: JSON.stringify(result) };
  } catch (err) {
    console.error('Mark function error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message || 'Something went wrong' }),
    };
  }
};
