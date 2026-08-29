export const customizationOptions = [
  {
    id: 'customization1',
    label: 'AI Intelligence Level',
    options: [
      { text: 'Basic Voice Commands', score: 2 },
      { text: 'Advanced Natural Language Processing', score: 4 },
      { text: 'Machine Learning Capabilities', score: 6 },
      { text: 'Full Autonomous Decision Making', score: 8 },
      { text: 'Experimental Neural Network Integration', score: 10 },
    ],
  },
  {
    id: 'customization2',
    label: 'Mobility & Navigation',
    options: [
      { text: 'Stationary Desktop Unit', score: 2 },
      { text: 'Basic Wheeled Movement', score: 4 },
      { text: 'Advanced Room Navigation', score: 6 },
      { text: 'Multi-Floor Stair Climbing', score: 8 },
      { text: 'Outdoor Terrain Traversal', score: 10 },
    ],
  },
  {
    id: 'customization3',
    label: 'Interaction Capabilities',
    options: [
      { text: 'Simple LED Display', score: 2 },
      { text: 'Touch Screen Interface', score: 4 },
      { text: 'Gesture Recognition', score: 6 },
      { text: 'Facial Recognition & Emotion Detection', score: 8 },
      { text: 'Holographic Projection Display', score: 10 },
    ],
  },
  {
    id: 'customization4',
    label: 'Physical Manipulation',
    options: [
      { text: 'No Physical Interaction', score: 2 },
      { text: 'Basic Single Arm', score: 4 },
      { text: 'Dual Arm Coordination', score: 6 },
      { text: 'Precision Tool Manipulation', score: 8 },
      { text: 'Advanced Dexterous Multi-Tool System', score: 10 },
    ],
  },
  {
    id: 'customization5',
    label: 'Specialized Functions',
    options: [
      { text: 'Home Security Monitoring', score: 2 },
      { text: 'Personal Health Assistant', score: 4 },
      { text: 'Educational Tutor & Learning Companion', score: 6 },
      { text: 'Professional Workshop Assistant', score: 8 },
      { text: 'Research & Development Partner', score: 10 },
    ],
  },
];

export const timeframeOptions = [
  { text: 'Ready Today', score: 10 },
  { text: 'Within 2 weeks', score: 8 },
  { text: 'Within 1 Month', score: 6 },
  { text: 'Within 1 Year', score: 2 },
];

export const emptyCustomForm = {
  customization1: '',
  customization2: '',
  customization3: '',
  customization4: '',
  customization5: '',
  timeframe: '',
  capabilities: '',
  referralCode: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  country: 'US',
};
