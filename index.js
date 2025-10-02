const CONTRACT_ADDRESS = '0xA4A2E2ca3fBfE21aed83471D28b6f65A233C6e00'; // $TIBBIR का रियल एड्रेस Basescan से डालें
const REWARD_AMOUNT = '0.01'; // 1 मिलियन टोकन्स

export default async function handler(req, res) {
  const { action, choice } = req.query;

  if (action === 'play') {
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
    `;
    if (result === 'win') {
      html += `
      <meta property="fc:frame:title" content="You Win! 🎉" />
      <meta property="fc:frame:description" content="Computer chose ${computerChoice}. Claim 1M $TIBBIR!" />
      <meta property="fc:frame:button:1" content="Claim Reward" />
      <meta property="fc:frame:button:1:action" content="tx" />
      <meta property="fc:frame:tx" content="https://basescan.org/address/${CONTRACT_ADDRESS}?a=transfer&to=0xCBe416312599816b9f897AfC6DDF69C9127bB2D0&amount=${REWARD_AMOUNT}" />
      <meta property="fc:frame:button:2" content="Play Again" />
      <meta property="fc:frame:post_url" content="/play?choice=rock" />
      `;
    } else {
      html += `
      <meta property="fc:frame:title" content="${result.charAt(0).toUpperCase() + result.slice(1)}!" />
      <meta property="fc:frame:description" content="Computer chose ${computerChoice}. Try again!" />
      <meta property="fc:frame:button:1" content="Play Again" />
      <meta property="fc:frame:post_url" content="/" />
      `;
    }
    html += `
    </head>
    <body><h1>${result.toUpperCase()}</h1></body>
    </html>
    `;
    res.status(200).send(html);
  } else {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="https://source.unsplash.com/random/400x400/?game" />
      <meta property="fc:frame:title" content="Rock Paper Scissors" />
      <meta property="fc:frame:description" content="Play & Win $TIBBIR on Base!" />
      <meta property="fc:frame:button:1" content="Rock 🪨" />
      <meta property="fc:frame:post_url" content="/play?choice=rock" />
      <meta property="fc:frame:button:2" content="Paper 📄" />
      <meta property="fc:frame:post_url" content="/play?choice=paper" />
      <meta property="fc:frame:button:3" content="Scissors ✂️" />
      <meta property="fc:frame:post_url" content="/play?choice=scissors" />
    </head>
    <body><h1>Play Now!</h1></body>
    </html>
    `;
    res.status(200).send(html);
  }
}