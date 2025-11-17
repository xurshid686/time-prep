const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const testData = req.body;
    
    // Format the message for Telegram
    const message = formatTelegramMessage(testData);
    
    // Send to Telegram
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      await sendTelegramMessage(message);
    }
    
    console.log('Test submission received:', {
      student: testData.name,
      score: testData.results.score,
      total: testData.results.total
    });
    
    res.status(200).json({ success: true, message: 'Test submitted successfully' });
  } catch (error) {
    console.error('Error processing submission:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

function formatTelegramMessage(testData) {
  const { name, timeSpent, results, answers } = testData;
  
  let message = `📚 *NEW TEST SUBMISSION* 📚\n\n`;
  message += `*Test:* Prepositions of Time + How much/How many\n`;
  message += `*Student:* ${name}\n`;
  message += `*Time Spent:* ${timeSpent}\n`;
  message += `*Score:* ${results.score}/${results.total} (${results.percentage}%)\n\n`;
  
  message += `*DETAILED ANALYSIS:*\n`;
  
  // Part 1: Prepositions (Questions 1-20)
  message += `\n*📍 PART 1 - Prepositions of Time:*\n`;
  for (let i = 1; i <= 20; i++) {
    const q = results.details[i-1];
    const status = q.isCorrect ? '✅' : '❌';
    message += `${status} Q${i}: Your: "${q.userAnswer}" | Correct: "${q.correctAnswer}"\n`;
  }
  
  // Part 2: Quantifiers (Questions 21-25)
  message += `\n*🔢 PART 2 - How much/How many:*\n`;
  for (let i = 21; i <= 25; i++) {
    const q = results.details[i-1];
    const status = q.isCorrect ? '✅' : '❌';
    message += `${status} Q${i}: Your: "${q.userAnswer}" | Correct: "${q.correctAnswer}"\n`;
  }
  
  // Summary
  message += `\n*📊 SUMMARY:*\n`;
  const prepositionsCorrect = results.details.slice(0, 20).filter(q => q.isCorrect).length;
  const quantifiersCorrect = results.details.slice(20).filter(q => q.isCorrect).length;
  
  message += `Prepositions: ${prepositionsCorrect}/20 (${Math.round(prepositionsCorrect/20*100)}%)\n`;
  message += `Quantifiers: ${quantifiersCorrect}/5 (${Math.round(quantifiersCorrect/5*100)}%)\n`;
  
  message += `\n*Overall Performance:* ${getPerformanceText(results.percentage)}`;
  
  return message;
}

function getPerformanceText(percentage) {
  if (percentage >= 90) return 'Excellent! 🎉';
  if (percentage >= 80) return 'Very Good! 👍';
  if (percentage >= 70) return 'Good! 😊';
  if (percentage >= 60) return 'Satisfactory 👌';
  return 'Needs Improvement 📖';
}

async function sendTelegramMessage(message) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'Markdown'
    })
  });
  
  if (!response.ok) {
    throw new Error(`Telegram API error: ${response.status}`);
  }
  
  return response.json();
}
