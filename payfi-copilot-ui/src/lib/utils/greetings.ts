const greetings = [
  "How can I help you today?",
  "What would you like to create?",
  "What can I help you build today?",
  "Ready to create something amazing?",
  "What's on your mind?",
  "What would you like to work on?",
  "How can I assist with your project?",
  "What should we build together?",
  "What's your next big idea?",
  "How can I help you code today?",
  "What would you like to develop?",
  "Ready to write some smart contracts?",
  "What can I help you automate?",
  "What's your coding challenge today?",
  "How can I assist with your blockchain project?"
];

export function getRandomGreeting(): string {
  const randomIndex = Math.floor(Math.random() * greetings.length);
  return greetings[randomIndex];
}

export default greetings;
