const greetings = [
  "What smart contract would you like to create today?",
  "Describe your smart contract idea in plain English",
  "Ready to build on Stacks? What's your project?",
  "What blockchain functionality do you want to implement?",
  "Need help with a smart contract? I'm here to help!",
  "What's your next Stacks smart contract project?",
  "Let's build something amazing on the Stacks blockchain",
  "What decentralized app are you working on?",
  "Need help with Clarity smart contracts? Just ask!",
  "What's your Web3 idea? I can help you build it"
];

export function getRandomGreeting(): string {
  const randomIndex = Math.floor(Math.random() * greetings.length);
  return greetings[randomIndex];
}

export default greetings;
