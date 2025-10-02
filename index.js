import { VercelRequest, VercelResponse } from '@vercel/node';
const CONTRACT_ADDRESS = '0xA4A2E2ca3fBfE21aed83471D28b6f65A233C6e00'; // $TIBBIR का रियल एड्रेस Basescan से डालें
const REWARD_AMOUNT = '0.01'; // 1 मिलियन टोकन्स
export default async function handler(req, res) {
  // CORS सेट करें (Farcaster के लिए जरूरी)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  let action = 'initial';
  let choice = null;

  if (req.method === 'POST') {
    try {
      const rawBody = await new Promise((resolve) => {
        let body = '';
        req.on('data', (chunk) => (body += chunk.toString()));
        req.on('end', () => resolve(body));
      });
      const parsedBody = JSON.parse(rawBody);
      action = parsedBody.untrustedData.button?.index === 1 ? 'play' : 'initial';
      choice = parsedBody.untrustedData.button?.value || parsedBody.untrustedData.input?.choice;
    } catch (e) {
      console.error('Error parsing POST body:', e);
      action = 'initial'; // डिफॉल्ट पर वापस
    }
  } else {
    action = req.query.action || 'initial';
    choice = req.query.choice;
  }

  const html = generateFrameHtml(action, choice);
  res.status(200).setHeader('Content-Type', 'text/html').send(html);
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

    let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="https://source.unsplash.com/random/400x400/?${result}" />
      <script src="https://files.farcaster.xyz/s/script.js" defer></script>
    `;
    if (result === 'win') {
      html += `
      <meta property="fc:frame:title" content="You Win! 🎉" />
      <meta property="fc:frame:description" content="Computer chose ${computerChoice}. Claim 1M $TIBBIR!" />
      <meta property="fc:frame:button:1" content="Claim Reward" />
      <meta property="fc:frame:button:1:action" content="tx" />
      <meta property="fc:frame:tx" content="https://basescan.org/address/${CONTRACT_ADDRESS}?a=transfer&to=0xCBe416312599816b9f897AfC6DDF69C9127bB2D0&amount=${REWARD_AMOUNT}" />
      <meta property="fc:frame:button:2" content="Play Again" />
      <meta property="fc:frame:post_url" content="https://farcaster-game.vercel.app/" />
      <script>
        window.onload = () => {
          if (window.fcWidget) {
            window.fcWidget.actions.ready();
          }
        };
      </script>
      `;
    } else {
      html += `
      <meta property="fc:frame:title" content="${result.charAt(0).toUpperCase() + result.slice(1)}!" />
      <meta property="fc:frame:description" content="Computer chose ${computerChoice}. Try again!" />
      <meta property="fc:frame:button:1" content="Play Again" />
      <meta property="fc:frame:post_url" content="https://farcaster-game.vercel.app/" />
      <script>
        window.onload = () => {
          if (window.fcWidget) {
            window.fcWidget.actions.ready();
          }
        };
      </script>
      `;
    }
    html += `
    </head>
    <body><h1>${result.toUpperCase()}</h1></body>
    </html>
    `;
    return html;
  } else {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="https://source.unsplash.com/random/400x400/?game" />
      <meta property="fc:frame:title" content="Rock Paper Scissors" />
      <meta property="fc:frame:description" content="Play & Win $TIBBIR on Base!" />
      <meta property="fc:frame:button:1" content="Rock 🪨" />
      <meta property="fc:frame:post_url" content="https://farcaster-game.vercel.app/?action=play&choice=rock" />
      <meta property="fc:frame:button:2" content="Paper 📄" />
      <meta property="fc:frame:post_url" content="https://farcaster-game.vercel.app/?action=play&choice=paper" />
      <meta property="fc:frame:button:3" content="Scissors ✂️" />
      <meta property="fc:frame:post_url" content="https://farcaster-game.vercel.app/?action=play&choice=scissors" />
      <script src="https://files.farcaster.xyz/s/script.js" defer></script>
      <script>
        window.onload = () => {
          if (window.fcWidget) {
            window.fcWidget.actions.ready();
          }
        };
      </script>
    </head>
    <body><h1>Play Now!</h1></body>
    </html>
    `;
  }
}
