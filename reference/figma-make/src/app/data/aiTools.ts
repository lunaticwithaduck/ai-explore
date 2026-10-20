import chatGptLogo from '../../imports/image.png';
import midJourneyLogo from '../../imports/image-1.png';
import elevenLabsLogo from '../../imports/image-2.png';
import runwayLogo from '../../imports/image-3.png';
import stableDiffusionLogo from '../../imports/image-8.png';
import githubCopilotLogo from '../../imports/image-9.png';
import tableauLogo from '../../imports/image-6.png';
import jasperLogo from '../../imports/image-7.png';

export interface PricingPlan {
  name: string;
  price: string;
  features: string[];
  isPopular?: boolean;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  videoUrl?: string;
  steps?: string[];
}

export interface Update {
  id: string;
  version: string;
  date: string;
  title: string;
  changes: string[];
  type: 'feature' | 'bugfix' | 'improvement';
}

export interface ComparisonData {
  pricing: string;
  apiAccess: string;
  integrations: number;
  speed: number;
  outputQuality: number;
  bestUseCase: string;
}

export interface AITool {
  id: string;
  name: string;
  description: string;
  category: string;
  logo: string;
  logoBackground: string;
  rating: number;
  reviewCount: number;
  price: string;
  hasFreePlan: boolean;
  hasTrial: boolean;
  trialDays?: number;
  plans: PricingPlan[];
  features: string[];
  longDescription: string;
  developer: string;
  lastUpdate: string;
  tags: string[];
  website: string;
  tutorials: Tutorial[];
  updates: Update[];
  comparison: ComparisonData;
  similarTools: string[];
  complementaryTools: string[];
}

export interface Review {
  id: string;
  toolId: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  helpful: number;
}

export const categories = [
  { id: 'all', name: 'All Tools', icon: 'grid-3x3' },
  { id: 'image', name: 'Image Generation', icon: 'image' },
  { id: 'text', name: 'Text & Writing', icon: 'type' },
  { id: 'video', name: 'Video', icon: 'video' },
  { id: 'audio', name: 'Audio & Voice', icon: 'music' },
  { id: 'code', name: 'Code Assistant', icon: 'code' },
  { id: 'analytics', name: 'Analytics', icon: 'bar-chart' },
];

export const aiTools: AITool[] = [
  {
    id: '1',
    name: 'MidJourney',
    description: 'Generate stunning images from text descriptions with AI',
    category: 'image',
    logo: midJourneyLogo,
    logoBackground: 'linear-gradient(135deg, #7dd3fc 0%, #67e8f9 100%)',
    rating: 4.8,
    reviewCount: 2340,
    price: '$29.99/month',
    hasFreePlan: false,
    hasTrial: true,
    trialDays: 25,
    plans: [
      { name: 'Basic', price: '$10/month', features: ['200 images/month', 'Standard quality', 'Community support'] },
      { name: 'Standard', price: '$30/month', features: ['Unlimited images', 'High quality', 'Fast mode', 'Priority support'], isPopular: true },
      { name: 'Pro', price: '$60/month', features: ['Everything in Standard', '4K resolution', 'Stealth mode', 'Commercial license'] },
    ],
    features: ['High Resolution', 'Multiple Styles', 'Fast Generation', 'API Access'],
    longDescription: 'MidJourney is a leading AI image generation tool that creates stunning visualizations from simple text descriptions. Perfect for artists, designers, and creators.',
    developer: 'MidJourney Inc.',
    lastUpdate: 'May 12, 2026',
    tags: ['AI Art', 'Generation', 'Design'],
    website: 'https://www.midjourney.com',
    tutorials: [
      {
        id: 't1',
        title: 'Getting Started with MidJourney',
        description: 'Learn the basics of creating your first AI-generated image',
        duration: '10 min',
        difficulty: 'Beginner',
        videoUrl: 'https://www.youtube.com/embed/sRqABLG9JgI',
      },
      {
        id: 't2',
        title: 'Advanced Prompt Engineering',
        description: 'Master the art of writing detailed prompts for stunning results',
        duration: '25 min',
        difficulty: 'Advanced',
        videoUrl: 'https://www.youtube.com/embed/5W0VJhyGuYQ',
      },
      {
        id: 't3',
        title: 'Creating Artistic Styles',
        description: 'Generate images in different artistic styles',
        duration: '15 min',
        difficulty: 'Intermediate',
        videoUrl: 'https://www.youtube.com/embed/dhDQS23GDYo',
      },
      {
        id: 't4',
        title: 'Remix and Variations',
        description: 'Use remix mode and create variations',
        duration: '12 min',
        difficulty: 'Intermediate',
        videoUrl: 'https://www.youtube.com/embed/0_BBvv7ZZvQ',
      },
      {
        id: 't5',
        title: 'Character Consistency',
        description: 'Create consistent characters across images',
        duration: '18 min',
        difficulty: 'Advanced',
        videoUrl: 'https://www.youtube.com/embed/bxmM6q0iTtQ',
      },
    ],
    updates: [
      {
        id: 'u1',
        version: 'v6.0',
        date: 'May 10, 2026',
        title: 'Major Model Update',
        changes: ['Improved photorealism', 'Better text rendering', 'New style parameters', 'Faster generation times'],
        type: 'feature',
      },
      {
        id: 'u2',
        version: 'v5.2',
        date: 'April 15, 2026',
        title: 'Performance Improvements',
        changes: ['Reduced generation time by 30%', 'Fixed color accuracy issues', 'Improved prompt understanding'],
        type: 'improvement',
      },
    ],
    comparison: {
      pricing: 'Starting at $10/month',
      apiAccess: 'Yes - REST API',
      integrations: 50,
      speed: 8,
      outputQuality: 9,
      bestUseCase: 'High-quality artistic images and creative design work',
    },
    similarTools: ['7'],
    complementaryTools: ['2', '8', '5'],
  },
  {
    id: '2',
    name: 'ChatGPT',
    description: 'Most powerful AI assistant for any task',
    category: 'text',
    logo: chatGptLogo,
    logoBackground: 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)',
    rating: 4.9,
    reviewCount: 5670,
    price: '$20/month',
    hasFreePlan: true,
    hasTrial: false,
    plans: [
      { name: 'Free', price: 'Free', features: ['GPT-3.5', 'Limited queries', 'Standard response time'] },
      { name: 'Plus', price: '$20/month', features: ['GPT-4 access', 'Unlimited queries', 'Faster responses', 'Priority access'], isPopular: true },
      { name: 'Team', price: '$25/user/month', features: ['Everything in Plus', 'Admin console', 'Team workspace', 'Data privacy'] },
    ],
    features: ['Unlimited Queries', 'GPT-4 Turbo', 'Document Analysis', 'Browser Integration'],
    longDescription: 'ChatGPT Pro offers the most advanced capabilities from OpenAI for text generation, analysis, and assistance with any task.',
    developer: 'OpenAI',
    lastUpdate: 'May 14, 2026',
    tags: ['Chat', 'Writing', 'Analysis'],
    website: 'https://chat.openai.com',
    tutorials: [
      {
        id: 't1',
        title: 'ChatGPT Basics',
        description: 'Start conversations and get the most out of ChatGPT',
        duration: '8 min',
        difficulty: 'Beginner',
        videoUrl: 'https://www.youtube.com/embed/JTxsNm9IdYU',
      },
      {
        id: 't2',
        title: 'Custom GPTs Creation',
        description: 'Build your own specialized ChatGPT assistant',
        duration: '20 min',
        difficulty: 'Intermediate',
        videoUrl: 'https://www.youtube.com/embed/pUKgNv9k5A8',
      },
      {
        id: 't3',
        title: 'Advanced Prompting Techniques',
        description: 'Write better prompts for accurate responses',
        duration: '15 min',
        difficulty: 'Advanced',
        videoUrl: 'https://www.youtube.com/embed/jC4v5AS4RIM',
      },
      {
        id: 't4',
        title: 'Code Generation Tips',
        description: 'Use ChatGPT for programming tasks',
        duration: '12 min',
        difficulty: 'Intermediate',
        videoUrl: 'https://www.youtube.com/embed/VznoKyh6AXs',
      },
    ],
    updates: [
      {
        id: 'u1',
        version: 'GPT-4 Turbo',
        date: 'May 12, 2026',
        title: 'Turbo Model Release',
        changes: ['128K context window', 'Up-to-date knowledge', 'Vision capabilities', 'JSON mode'],
        type: 'feature',
      },
      {
        id: 'u2',
        version: '4.0.3',
        date: 'May 1, 2026',
        title: 'Bug Fixes',
        changes: ['Fixed memory issues', 'Improved code generation', 'Better multilingual support'],
        type: 'bugfix',
      },
    ],
    comparison: {
      pricing: 'Free tier + $20/month',
      apiAccess: 'Yes - Official API',
      integrations: 100,
      speed: 10,
      outputQuality: 9,
      bestUseCase: 'Conversational AI, text generation, and code assistance',
    },
    similarTools: ['8'],
    complementaryTools: ['1', '4', '6'],
  },
  {
    id: '3',
    name: 'Runway ML',
    description: 'Professional video editing and generation with AI',
    category: 'video',
    logo: runwayLogo,
    logoBackground: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
    rating: 4.7,
    reviewCount: 1280,
    price: '$75/month',
    hasFreePlan: true,
    hasTrial: true,
    trialDays: 14,
    plans: [
      { name: 'Free', price: 'Free', features: ['125 credits/month', '720p export', 'Watermarked'] },
      { name: 'Standard', price: '$12/month', features: ['625 credits/month', '1080p export', 'No watermark'], isPopular: true },
      { name: 'Pro', price: '$28/month', features: ['2250 credits/month', '4K export', 'Priority processing', 'Team workspace'] },
      { name: 'Unlimited', price: '$76/month', features: ['Unlimited credits', '4K export', 'Fastest processing', 'Premium support'] },
    ],
    features: ['Text to Video', 'AI Effects', '4K Export', 'Green Screen'],
    longDescription: 'Runway ML revolutionizes video production with AI technologies for generating, editing, and enhancing video content.',
    developer: 'Runway Research',
    lastUpdate: 'May 10, 2026',
    tags: ['Video', 'Editing', 'Effects'],
    website: 'https://runwayml.com',
    tutorials: [
      {
        id: 't1',
        title: 'Text to Video Basics',
        description: 'Create your first AI-generated video from text',
        duration: '15 min',
        difficulty: 'Beginner',
        videoUrl: 'https://www.youtube.com/embed/aUO7T8gPlxo',
      },
      {
        id: 't2',
        title: 'Gen-3 Alpha Features',
        description: 'Explore the latest Gen-3 capabilities',
        duration: '18 min',
        difficulty: 'Intermediate',
        videoUrl: 'https://www.youtube.com/embed/CpFwspWKcVY',
      },
      {
        id: 't3',
        title: 'Video Editing with AI',
        description: 'Edit and enhance videos using Runway tools',
        duration: '22 min',
        difficulty: 'Advanced',
        videoUrl: 'https://www.youtube.com/embed/3bKtiKfMkgw',
      },
      {
        id: 't4',
        title: 'Motion Brush Tutorial',
        description: 'Animate specific parts of your images',
        duration: '14 min',
        difficulty: 'Intermediate',
        videoUrl: 'https://www.youtube.com/embed/mIXTx-N9gB8',
      },
    ],
    updates: [
      {
        id: 'u1',
        version: 'Gen-3',
        date: 'May 8, 2026',
        title: 'Next-Gen Video Model',
        changes: ['10x faster generation', 'Better motion consistency', 'Extended video length', 'Improved prompt understanding'],
        type: 'feature',
      },
    ],
    comparison: {
      pricing: 'Starting at $15/month',
      apiAccess: 'Yes - API available',
      integrations: 40,
      speed: 6,
      outputQuality: 9,
      bestUseCase: 'AI video generation and editing for creative professionals',
    },
    similarTools: [],
    complementaryTools: ['1', '5', '8'],
  },
  {
    id: '4',
    name: 'GitHub Copilot',
    description: 'AI pair programmer for real-time coding assistance',
    category: 'code',
    logo: githubCopilotLogo,
    logoBackground: 'linear-gradient(135deg, #1f6feb 0%, #0969da 100%)',
    rating: 4.6,
    reviewCount: 8920,
    price: '$10/month',
    hasFreePlan: true,
    hasTrial: true,
    trialDays: 30,
    plans: [
      { name: 'Free', price: 'Free', features: ['For students & open source', 'Code completion', 'Multi-language support'] },
      { name: 'Individual', price: '$10/month', features: ['Unlimited code suggestions', 'Multi-language', 'IDE integration', 'Chat in IDE'], isPopular: true },
      { name: 'Business', price: '$19/user/month', features: ['Everything in Individual', 'License management', 'Organization policies', 'Security features'] },
    ],
    features: ['Code Completion', 'Multi-language', 'IDE Integration', 'Code Review'],
    longDescription: 'GitHub Copilot is your AI programming partner that helps you write code faster and more efficiently with intelligent suggestions.',
    developer: 'GitHub & OpenAI',
    lastUpdate: 'May 13, 2026',
    tags: ['Coding', 'IDE', 'Productivity'],
    website: 'https://github.com/features/copilot',
    tutorials: [
      {
        id: 't1',
        title: 'Setup GitHub Copilot',
        description: 'Install and configure Copilot in your IDE',
        duration: '12 min',
        difficulty: 'Beginner',
        videoUrl: 'https://www.youtube.com/embed/hPVatUSvZq0',
      },
      {
        id: 't2',
        title: 'Advanced Copilot Techniques',
        description: 'Master code suggestions and inline chat',
        duration: '18 min',
        difficulty: 'Advanced',
        videoUrl: 'https://www.youtube.com/embed/2nPoiUJpDaU',
      },
      {
        id: 't3',
        title: 'Copilot Chat Deep Dive',
        description: 'Use Copilot Chat for complex tasks',
        duration: '16 min',
        difficulty: 'Intermediate',
        videoUrl: 'https://www.youtube.com/embed/3surPGP7_4o',
      },
      {
        id: 't4',
        title: 'Test Generation with Copilot',
        description: 'Generate unit tests automatically',
        duration: '14 min',
        difficulty: 'Intermediate',
        videoUrl: 'https://www.youtube.com/embed/CwAzIpc4AnA',
      },
    ],
    updates: [
      {
        id: 'u1',
        version: '1.85',
        date: 'May 11, 2026',
        title: 'Copilot Chat Improvements',
        changes: ['Faster responses', 'Better code context', 'New slash commands', 'Improved debugging'],
        type: 'improvement',
      },
    ],
    comparison: {
      pricing: 'Free for individuals, $10/user/month for teams',
      apiAccess: 'Limited - GitHub integration',
      integrations: 80,
      speed: 10,
      outputQuality: 8,
      bestUseCase: 'Code completion and programming assistance',
    },
    similarTools: ['2'],
    complementaryTools: ['6', '2'],
  },
  {
    id: '5',
    name: 'ElevenLabs',
    description: 'Realistic AI voice synthesis and cloning',
    category: 'audio',
    logo: elevenLabsLogo,
    logoBackground: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
    rating: 4.8,
    reviewCount: 3450,
    price: '$55/month',
    hasFreePlan: true,
    hasTrial: false,
    plans: [
      { name: 'Free', price: 'Free', features: ['10,000 characters/month', '3 custom voices', 'Standard quality'] },
      { name: 'Starter', price: '$5/month', features: ['30,000 characters/month', '10 custom voices', 'High quality', 'Commercial license'] },
      { name: 'Creator', price: '$22/month', features: ['100,000 characters/month', '30 custom voices', 'Voice cloning', 'Priority support'], isPopular: true },
      { name: 'Pro', price: '$99/month', features: ['500,000 characters/month', 'Unlimited voices', 'Advanced cloning', 'API access'] },
    ],
    features: ['Voice Cloning', '29 Languages', 'API', 'High Accuracy'],
    longDescription: 'ElevenLabs offers the most realistic AI voice technology for creating professional voiceovers and voice cloning.',
    developer: 'ElevenLabs',
    lastUpdate: 'May 11, 2026',
    tags: ['Voice', 'TTS', 'Voiceover'],
    website: 'https://elevenlabs.io',
    tutorials: [
      {
        id: 't1',
        title: 'Voice Cloning Guide',
        description: 'Clone any voice with professional quality',
        duration: '15 min',
        difficulty: 'Intermediate',
        videoUrl: 'https://www.youtube.com/embed/x1qXNJLMSfY',
      },
      {
        id: 't2',
        title: 'Text to Speech Basics',
        description: 'Convert text to natural sounding speech',
        duration: '10 min',
        difficulty: 'Beginner',
        videoUrl: 'https://www.youtube.com/embed/gcRHST5sZik',
      },
      {
        id: 't3',
        title: 'Creating Audiobooks',
        description: 'Use ElevenLabs for audiobook narration',
        duration: '20 min',
        difficulty: 'Advanced',
        videoUrl: 'https://www.youtube.com/embed/uK_8T3P9kQs',
      },
      {
        id: 't4',
        title: 'Voice Library Tutorial',
        description: 'Explore and use pre-made voices',
        duration: '12 min',
        difficulty: 'Beginner',
        videoUrl: 'https://www.youtube.com/embed/jJRaPjDPgkA',
      },
    ],
    updates: [
      {
        id: 'u1',
        version: '2.5',
        date: 'May 9, 2026',
        title: 'Multilingual Expansion',
        changes: ['Added 5 new languages', 'Improved accent accuracy', 'Faster voice cloning', 'API v2 release'],
        type: 'feature',
      },
    ],
    comparison: {
      pricing: 'Free tier + $5/month',
      apiAccess: 'Yes - Full API',
      integrations: 30,
      speed: 9,
      outputQuality: 10,
      bestUseCase: 'Professional voice synthesis and text-to-speech',
    },
    similarTools: [],
    complementaryTools: ['3', '8', '2'],
  },
  {
    id: '6',
    name: 'Tableau AI',
    description: 'Intelligent data analysis and visualization',
    category: 'analytics',
    logo: tableauLogo,
    logoBackground: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    rating: 4.5,
    reviewCount: 2180,
    price: '$95/month',
    hasFreePlan: false,
    hasTrial: true,
    trialDays: 14,
    plans: [
      { name: 'Viewer', price: '$15/user/month', features: ['View dashboards', 'Basic interactions', 'Mobile access'] },
      { name: 'Explorer', price: '$42/user/month', features: ['Create dashboards', 'Data exploration', 'Limited data sources'], isPopular: true },
      { name: 'Creator', price: '$70/user/month', features: ['Everything in Explorer', 'Unlimited data sources', 'Data prep', 'Full authoring'] },
    ],
    features: ['Predictive Analytics', 'Natural Language', 'Dashboards', 'Integration'],
    longDescription: 'Tableau AI combines powerful data visualization with AI capabilities for predictive analysis and automated data understanding.',
    developer: 'Salesforce',
    lastUpdate: 'May 09, 2026',
    tags: ['Data', 'Visualization', 'BI'],
    website: 'https://www.tableau.com',
    tutorials: [
      {
        id: 't1',
        title: 'Building Your First Dashboard',
        description: 'Create interactive data visualizations',
        duration: '30 min',
        difficulty: 'Beginner',
        videoUrl: 'https://www.youtube.com/embed/jEgVto5QME8',
      },
      {
        id: 't2',
        title: 'Data Analysis Fundamentals',
        description: 'Learn core Tableau analysis techniques',
        duration: '25 min',
        difficulty: 'Intermediate',
        videoUrl: 'https://www.youtube.com/embed/aHaOIvR00So',
      },
      {
        id: 't3',
        title: 'Advanced Calculations',
        description: 'Master LOD expressions and table calcs',
        duration: '35 min',
        difficulty: 'Advanced',
        videoUrl: 'https://www.youtube.com/embed/Pi4vn7fEQxM',
      },
      {
        id: 't4',
        title: 'Interactive Dashboards',
        description: 'Add filters and parameters to dashboards',
        duration: '22 min',
        difficulty: 'Intermediate',
        videoUrl: 'https://www.youtube.com/embed/yRoFKQi3g90',
      },
    ],
    updates: [
      {
        id: 'u1',
        version: '2024.1',
        date: 'May 7, 2026',
        title: 'AI-Powered Insights',
        changes: ['Automated insights', 'Natural language queries', 'Predictive analytics', 'Smart recommendations'],
        type: 'feature',
      },
    ],
    comparison: {
      pricing: 'Free for individuals, starts at $70/user/month',
      apiAccess: 'Yes - Enterprise API',
      integrations: 200,
      speed: 8,
      outputQuality: 9,
      bestUseCase: 'Business intelligence and data visualization',
    },
    similarTools: [],
    complementaryTools: ['2', '4', '8'],
  },
  {
    id: '7',
    name: 'Stable Diffusion',
    description: 'Open-source AI for image generation',
    category: 'image',
    logo: stableDiffusionLogo,
    logoBackground: 'linear-gradient(135deg, #4c6ef5 0%, #3b5bdb 100%)',
    rating: 4.7,
    reviewCount: 4560,
    price: 'Free',
    hasFreePlan: true,
    hasTrial: false,
    plans: [
      { name: 'Open Source', price: 'Free', features: ['Self-hosted', 'Unlimited generations', 'Community models', 'Full control'], isPopular: true },
      { name: 'DreamStudio', price: 'Pay as you go', features: ['Cloud-based', '$0.002 per image', 'No setup required', 'API access'] },
    ],
    features: ['Open Source', 'Local Execution', 'Extensible', 'Community Models'],
    longDescription: 'Stable Diffusion is a powerful open-source image generation model that you can use locally or in the cloud.',
    developer: 'Stability AI',
    lastUpdate: 'May 08, 2026',
    tags: ['Open Source', 'Image Gen', 'Free'],
    website: 'https://stability.ai',
    tutorials: [
      {
        id: 't1',
        title: 'Local Installation Guide',
        description: 'Set up Stable Diffusion on your computer',
        duration: '20 min',
        difficulty: 'Advanced',
        videoUrl: 'https://www.youtube.com/embed/3cvP7yJotUM',
      },
      {
        id: 't2',
        title: 'Prompt Engineering 101',
        description: 'Write effective prompts for better results',
        duration: '15 min',
        difficulty: 'Beginner',
        videoUrl: 'https://www.youtube.com/embed/O227vFJZ2mw',
      },
      {
        id: 't3',
        title: 'ControlNet Tutorial',
        description: 'Control image generation with ControlNet',
        duration: '25 min',
        difficulty: 'Advanced',
        videoUrl: 'https://www.youtube.com/embed/vhqqmMls7DQ',
      },
      {
        id: 't4',
        title: 'Inpainting & Outpainting',
        description: 'Edit and extend images with AI',
        duration: '18 min',
        difficulty: 'Intermediate',
        videoUrl: 'https://www.youtube.com/embed/vCXFz8tAMrs',
      },
      {
        id: 't5',
        title: 'Custom Model Training',
        description: 'Train your own Stable Diffusion model',
        duration: '40 min',
        difficulty: 'Advanced',
        videoUrl: 'https://www.youtube.com/embed/70H03cv57-o',
      },
    ],
    updates: [
      {
        id: 'u1',
        version: 'SDXL 1.0',
        date: 'May 5, 2026',
        title: 'SDXL Release',
        changes: ['Higher resolution output', 'Better composition', 'Improved face generation', 'New refiner model'],
        type: 'feature',
      },
    ],
    comparison: {
      pricing: 'Free and open-source',
      apiAccess: 'Yes - Open API',
      integrations: 150,
      speed: 7,
      outputQuality: 9,
      bestUseCase: 'Open-source image generation with full customization',
    },
    similarTools: ['1'],
    complementaryTools: ['2', '8', '3'],
  },
  {
    id: '8',
    name: 'Jasper AI',
    description: 'AI platform for marketing and copywriting',
    category: 'text',
    logo: jasperLogo,
    logoBackground: 'linear-gradient(135deg, #ff8c42 0%, #ff6b35 100%)',
    rating: 4.4,
    reviewCount: 1890,
    price: '$65/month',
    hasFreePlan: false,
    hasTrial: true,
    trialDays: 7,
    plans: [
      { name: 'Creator', price: '$39/month', features: ['1 user', '50,000 words/month', '50+ templates', 'SEO mode'] },
      { name: 'Teams', price: '$99/month', features: ['3 users', '150,000 words/month', 'Brand voice', 'Collaboration tools'], isPopular: true },
      { name: 'Business', price: 'Custom', features: ['Unlimited users', 'Custom words', 'API access', 'Dedicated support', 'Custom templates'] },
    ],
    features: ['SEO Optimization', 'Templates', 'Brand Voice', 'Team Collaboration'],
    longDescription: 'Jasper AI is a specialized AI tool for creating marketing materials, blog posts, and advertising copy.',
    developer: 'Jasper AI Inc.',
    lastUpdate: 'May 15, 2026',
    tags: ['Marketing', 'Copywriting', 'SEO'],
    website: 'https://www.jasper.ai',
    tutorials: [
      {
        id: 't1',
        title: 'Creating Marketing Copy',
        description: 'Generate compelling marketing content',
        duration: '12 min',
        difficulty: 'Beginner',
        videoUrl: 'https://www.youtube.com/embed/mFBaAuMoT7g',
      },
      {
        id: 't2',
        title: 'SEO Content Writing',
        description: 'Write SEO-optimized blog posts',
        duration: '16 min',
        difficulty: 'Intermediate',
        videoUrl: 'https://www.youtube.com/embed/gCWVlR6c0ho',
      },
      {
        id: 't3',
        title: 'Brand Voice Setup',
        description: 'Configure custom brand voice',
        duration: '14 min',
        difficulty: 'Intermediate',
        videoUrl: 'https://www.youtube.com/embed/7G1TEDNwCpI',
      },
      {
        id: 't4',
        title: 'Social Media Content',
        description: 'Generate posts for social platforms',
        duration: '10 min',
        difficulty: 'Beginner',
        videoUrl: 'https://www.youtube.com/embed/rZ8LqCy9tXk',
      },
    ],
    updates: [
      {
        id: 'u1',
        version: '3.0',
        date: 'May 13, 2026',
        title: 'Brand Voice Update',
        changes: ['Custom brand voice training', 'SEO optimizer', 'Team collaboration features', 'Performance dashboard'],
        type: 'feature',
      },
    ],
    comparison: {
      pricing: 'Starting at $49/month',
      apiAccess: 'Yes - API available',
      integrations: 60,
      speed: 9,
      outputQuality: 8,
      bestUseCase: 'Marketing copy, blog posts, and business content',
    },
    similarTools: ['2'],
    complementaryTools: ['1', '6', '5'],
  },
];

export const reviews: Review[] = [
  {
    id: 'r1',
    toolId: '1',
    author: 'Sarah Johnson',
    rating: 5,
    date: 'May 10, 2026',
    comment: 'Amazing tool! The quality of the images is exceptionally high. I use it every day for my design projects.',
    helpful: 42,
  },
  {
    id: 'r2',
    toolId: '1',
    author: 'Mike Chen',
    rating: 4,
    date: 'May 08, 2026',
    comment: 'Great AI, but sometimes it takes time to generate exactly what I want. Still worth it though.',
    helpful: 28,
  },
  {
    id: 'r3',
    toolId: '2',
    author: 'Alex Rodriguez',
    rating: 5,
    date: 'May 12, 2026',
    comment: 'GPT-4 Turbo is incredibly powerful. It helps me with coding, writing, and analysis. Best investment!',
    helpful: 67,
  },
  {
    id: 'r4',
    toolId: '3',
    author: 'Emma Davis',
    rating: 5,
    date: 'May 09, 2026',
    comment: 'As a video editor, Runway ML has changed the way I work. The AI effects are fantastic!',
    helpful: 53,
  },
  {
    id: 'r5',
    toolId: '4',
    author: 'David Kim',
    rating: 4,
    date: 'May 11, 2026',
    comment: 'GitHub Copilot really speeds up development. Sometimes the suggestions aren\'t perfect, but 80% of the time they\'re excellent.',
    helpful: 91,
  },
];

export interface BundlePricing {
  monthly: {
    price: string;
    originalPrice: string;
    savings: string;
  };
  quarterly: {
    price: string;
    originalPrice: string;
    savings: string;
    perMonth: string;
  };
  yearly: {
    price: string;
    originalPrice: string;
    savings: string;
    perMonth: string;
  };
}

export interface Bundle {
  id: string;
  name: string;
  description: string;
  toolIds: string[];
  icon: string;
  gradient: string;
  pricing: BundlePricing;
}

export const bundles: Bundle[] = [
  {
    id: 'b1',
    name: 'Startup Founder Pack',
    description: 'Everything you need to launch and grow your startup - from content creation to analytics',
    toolIds: ['2', '8', '6', '1'],
    icon: 'rocket',
    gradient: 'from-blue-600 to-cyan-600',
    pricing: {
      monthly: { price: '$89', originalPrice: '$120', savings: '26%' },
      quarterly: { price: '$249', originalPrice: '$360', savings: '31%', perMonth: '$83' },
      yearly: { price: '$899', originalPrice: '$1,440', savings: '38%', perMonth: '$75' },
    },
  },
  {
    id: 'b2',
    name: 'AI Video Creator Stack',
    description: 'Complete video production toolkit with AI-powered editing, voice-over, and visual effects',
    toolIds: ['3', '5', '1'],
    icon: 'video',
    gradient: 'from-purple-600 to-pink-600',
    pricing: {
      monthly: { price: '$149', originalPrice: '$200', savings: '25%' },
      quarterly: { price: '$419', originalPrice: '$600', savings: '30%', perMonth: '$140' },
      yearly: { price: '$1,499', originalPrice: '$2,400', savings: '38%', perMonth: '$125' },
    },
  },
  {
    id: 'b3',
    name: 'Solo Agency Stack',
    description: 'Run your entire creative agency with AI - design, copy, video, and client reporting',
    toolIds: ['1', '7', '8', '3', '6'],
    icon: 'briefcase',
    gradient: 'from-orange-600 to-red-600',
    pricing: {
      monthly: { price: '$199', originalPrice: '$280', savings: '29%' },
      quarterly: { price: '$559', originalPrice: '$840', savings: '33%', perMonth: '$186' },
      yearly: { price: '$1,999', originalPrice: '$3,360', savings: '40%', perMonth: '$167' },
    },
  },
  {
    id: 'b4',
    name: 'AI SDR Bundle',
    description: 'Automate your sales outreach with AI-powered writing, voice messages, and analytics',
    toolIds: ['2', '8', '5', '6'],
    icon: 'trending-up',
    gradient: 'from-green-600 to-emerald-600',
    pricing: {
      monthly: { price: '$119', originalPrice: '$160', savings: '26%' },
      quarterly: { price: '$335', originalPrice: '$480', savings: '30%', perMonth: '$112' },
      yearly: { price: '$1,199', originalPrice: '$1,920', savings: '38%', perMonth: '$100' },
    },
  },
  {
    id: 'b5',
    name: 'Content Creator Suite',
    description: 'Create stunning content across all formats - images, videos, text, and voiceovers',
    toolIds: ['1', '3', '8', '5'],
    icon: 'sparkles',
    gradient: 'from-indigo-600 to-purple-600',
    pricing: {
      monthly: { price: '$159', originalPrice: '$220', savings: '28%' },
      quarterly: { price: '$449', originalPrice: '$660', savings: '32%', perMonth: '$150' },
      yearly: { price: '$1,599', originalPrice: '$2,640', savings: '39%', perMonth: '$133' },
    },
  },
  {
    id: 'b6',
    name: 'Developer Productivity Kit',
    description: 'Boost your coding efficiency with AI assistance, documentation, and data visualization',
    toolIds: ['4', '2', '6'],
    icon: 'code',
    gradient: 'from-slate-600 to-zinc-600',
    pricing: {
      monthly: { price: '$79', originalPrice: '$110', savings: '28%' },
      quarterly: { price: '$222', originalPrice: '$330', savings: '33%', perMonth: '$74' },
      yearly: { price: '$799', originalPrice: '$1,320', savings: '39%', perMonth: '$67' },
    },
  },
];
