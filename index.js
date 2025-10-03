const CONTRACT_ADDRESS = '0xA4A2E2ca3fBfE21aed83471D28b6f65A233C6e00'; // $TIBBIR Contract
const REWARD_AMOUNT = '0.01'; 
const YOUR_WALLET = '0xCBe416312599816b9f897AfC6DDF69C9127bB2D0';

export default function handler(req, res) {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    let action = 'initial';
    let choice = null;

    if (req.method === 'POST') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          const parsedBody = JSON.parse(body);
          const buttonIndex = parsedBody.untrustedData?.button?.index;

          if (buttonIndex === 1) choice = 'rock';
          else if (buttonIndex === 2) choice = 'paper';
          else if (buttonIndex === 3) choice = 'scissors';

          action = choice ? 'play' : 'initial';
          sendResponse(res, action, choice);
        } catch (parseError) {
          console.error('JSON Parse Error:', parseError);
          sendResponse(res, 'initial', null);
        }
      });
      return;
    } else {
      action = req.query.action || 'initial';
      choice = req.query.choice;
      sendResponse(res, action, choice);
    }
  } catch (error) {
    console.error('Handler Error:', error);
    res.status(500).send('Internal Server Error');
  }
}

function sendResponse(res, action, choice) {
  const html = generateFrameHtml(action, choice);
  res.status(200).send(html);
}

function generateFrameHtml(action, choice) {
  if (action === 'play' && choice) {
    const choices = ['rock', 'paper', 'scissors'];
    const computerChoice = choices[Math.floor(Math.random() * 3)];

    let result = 'tie';
    if (choice === 'rock' && computerChoice === 'scissors') result = 'win';
    else if (choice === 'paper' && computerChoice === 'rock') result = 'win';
    else if (choice === 'scissors' && computerChoice === 'paper') result = 'win';
    else if (choice === computerChoice) result = 'tie';
    else result = 'lose';

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=390, initial-scale=1.0" />
      <meta name="fc:frame" content="vNext" />
      <meta name="fc:frame:image" content="https://source.unsplash.com/random/400x400/?${result}" />
      <meta name="fc:frame:button:1" content="Play Again" />
      <meta name="fc:frame:post_url" content="https://farcaster-game.vercel.app/" />
    </head>
    <body style="margin: 0; background: #00BFFF; color: white; font-family: sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; text-align: center;">
      <h1>${result.toUpperCase()} (You: ${choice}, Computer: ${computerChoice})</h1>
    </body>
    </html>
    `;
  } else {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=390, initial-scale=1.0" />
      <meta name="fc:frame" content="vNext" />
      <meta name="fc:frame:image" content="https://source.unsplash.com/random/400x400/?game" />
      <meta name="fc:frame:button:1" content="Rock 🪨" />
      <meta name="fc:frame:button:2" content="Paper 📄" />
      <meta name="fc:frame:button:3" content="Scissors ✂️" />
      <meta name="fc:frame:post_url" content="https://farcaster-game.vercel.app/" />
    </head>
    <body style="margin: 0; background: #00BFFF; color: white; font-family: sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; text-align: center;">
      <h1>Play Rock Paper Scissors!</h1>
    </body>
    </html>
    `;
  }
}
