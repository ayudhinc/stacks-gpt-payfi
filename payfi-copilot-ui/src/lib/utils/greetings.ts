const greetings = [
  "Hey there, builder!",
  "Ready to turn ideas into Clarity?",
  "Welcome to ChatPayFi, your payment flow awaits.",
  "Good to see you!",
  "What kind of Bitcoin magic are we crafting today?",
  "Hello! Describe your payment dream and I’ll code the reality.",
  "👋 Let’s spin up an sBTC checkout in record time.",
  "Hit me with a prompt.",
  "Greetings, payments pioneer!",
  "Subscription, escrow, or something wilder?",
  "Yo! ChatPayFi at your service—type a flow, watch the contract appear.",
  "Welcome back!",
  "Ready for another lightning-fast deploy?",
  "Hey teammate!",
  "Break down your pricing scheme and we’ll mint the code.",
  "Hi there!",
  "Bitcoin-secured payments are one prompt away."
];

export function getRandomGreeting(): string {
  const randomIndex = Math.floor(Math.random() * greetings.length);
  return greetings[randomIndex];
}

export default greetings;
