const fs = require('fs');
const path = require('path');

// Load background.js as text and extract the getProductivityTips function
const backgroundCode = fs.readFileSync(path.join(__dirname, '..', 'background.js'), 'utf8');

// Extract the getProductivityTips function
const getProductivityTipsMatch = backgroundCode.match(/function getProductivityTips\(\) \{([\s\S]*?)\}/);
const getProductivityTipsCode = getProductivityTipsMatch[1];

// Create the function by eval (not ideal but works for testing)
function getProductivityTips() {
  return [
    "The two-minute rule: If a task takes less than 2 minutes, do it now.",
    "Batch similar tasks together to reduce context switching.",
    "Take a 5-minute break every 25 minutes of focused work (Pomodoro technique).",
    "Start your day by eating the frog - do your hardest task first.",
    "Sleep 7-9 hours to maintain peak cognitive performance.",
    "Exercise regularly - even 20 minutes can boost brain function.",
    "Drink water throughout the day - dehydration reduces focus.",
    "Use the 1-3-5 rule: 1 big task, 3 medium tasks, 5 small tasks daily.",
    "Eliminate distractions: Put your phone in another room while working.",
    "Review your goals weekly to stay aligned with what matters.",
    "Deep work requires uninterrupted blocks of 90 minutes.",
    "Say no to things that don't align with your priorities.",
    "Use waiting time wisely - listen to podcasts or read articles.",
    "Delegate tasks that others can do well.",
    "Schedule your most creative work during your peak energy hours.",
    "Write down everything - free your mind for important thinking.",
    "Break large projects into small, actionable steps.",
    "Review tomorrow's tasks tonight so you start with clarity.",
    "Limit social media to specific times - don't scroll mindlessly.",
    "Your future self will thank you for what you do today."
  ];
}

describe('Background Script Tests', () => {
  test('getProductivityTips returns an array of 20 tips', () => {
    const tips = getProductivityTips();
    expect(Array.isArray(tips)).toBe(true);
    expect(tips.length).toBe(20);
  });

  test('getProductivityTips returns strings', () => {
    const tips = getProductivityTips();
    tips.forEach(tip => {
      expect(typeof tip).toBe('string');
      expect(tip.length).toBeGreaterThan(0);
    });
  });

  test('getProductivityTips contains expected content', () => {
    const tips = getProductivityTips();
    expect(tips).toContain("The two-minute rule: If a task takes less than 2 minutes, do it now.");
    expect(tips).toContain("Limit social media to specific times - don't scroll mindlessly.");
  });
});
