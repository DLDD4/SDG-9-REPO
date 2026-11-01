export interface SDGGoal {
  id: number;
  code: string;
  name: string;
  shortTitle: string;
  description: string;
  color: string; // official UN SDG hex
  relevantKeywords: string[];
}

export const UN_SDG_GOALS: SDGGoal[] = [
  {
    id: 1,
    code: 'SDG 1',
    name: 'No Poverty',
    shortTitle: 'No Poverty',
    description: 'End poverty in all its forms everywhere through inclusive economic development and social protection.',
    color: '#E5243B',
    relevantKeywords: ['Microfinance', 'Socioeconomic Modeling', 'Rural Electrification', 'Basic Needs Access']
  },
  {
    id: 2,
    code: 'SDG 2',
    name: 'Zero Hunger',
    shortTitle: 'Zero Hunger',
    description: 'End hunger, achieve food security, improved nutrition, and promote sustainable agriculture.',
    color: '#DDA63A',
    relevantKeywords: ['Precision Agriculture', 'Crop Phenotyping', 'Soil Microbiome', 'Food Preservation']
  },
  {
    id: 3,
    code: 'SDG 3',
    name: 'Good Health and Well-being',
    shortTitle: 'Good Health',
    description: 'Ensure healthy lives and promote well-being for all at all ages through biomedical and healthcare innovation.',
    color: '#4C9F38',
    relevantKeywords: ['Biosensors', 'Point-of-Care Diagnostics', 'Targeted Drug Delivery', 'Medical Image Segmentation', 'Endoscopic Vision', 'Microfluidics']
  },
  {
    id: 4,
    code: 'SDG 4',
    name: 'Quality Education',
    shortTitle: 'Quality Education',
    description: 'Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all.',
    color: '#C5192D',
    relevantKeywords: ['Intelligent Tutoring Systems', 'STEM Pedagogy', 'Educational Data Mining', 'Digital Learning']
  },
  {
    id: 5,
    code: 'SDG 5',
    name: 'Gender Equality',
    shortTitle: 'Gender Equality',
    description: 'Achieve gender equality and empower all women and girls in science, technology, and society.',
    color: '#FF3A21',
    relevantKeywords: ['Algorithmic Fairness', 'Women in STEM', 'Health Disparities', 'Gender Bias in AI']
  },
  {
    id: 6,
    code: 'SDG 6',
    name: 'Clean Water and Sanitation',
    shortTitle: 'Clean Water',
    description: 'Ensure availability and sustainable management of water and sanitation for all.',
    color: '#26BDE2',
    relevantKeywords: ['Membrane Desalination', 'Wastewater Treatment', 'Microplastic Degradation', 'Water Quality Monitoring']
  },
  {
    id: 7,
    code: 'SDG 7',
    name: 'Affordable and Clean Energy',
    shortTitle: 'Clean Energy',
    description: 'Ensure access to affordable, reliable, sustainable, and modern energy for all.',
    color: '#FCC30B',
    relevantKeywords: ['Perovskite Solar Cells', 'Solid-State Electrolytes', 'Lithium-Sulfur Batteries', 'Green Hydrogen', 'Supercapacitors']
  },
  {
    id: 8,
    code: 'SDG 8',
    name: 'Decent Work and Economic Growth',
    shortTitle: 'Decent Work',
    description: 'Promote sustained, inclusive, and sustainable economic growth, full and productive employment.',
    color: '#A21942',
    relevantKeywords: ['Human-Robot Collaboration', 'Industrial Automation', 'Supply Chain Analytics', 'Labor Economics']
  },
  {
    id: 9,
    code: 'SDG 9',
    name: 'Industry, Innovation and Infrastructure',
    shortTitle: 'Industry & Innovation',
    description: 'Build resilient infrastructure, promote inclusive and sustainable industrialization, and foster innovation.',
    color: '#FD6925',
    relevantKeywords: ['Deep Learning', 'Quantum Computing', 'Silicon Photonics', '2D MXenes', 'Swarm Robotics', 'Edge Computing']
  },
  {
    id: 10,
    code: 'SDG 10',
    name: 'Reduced Inequalities',
    shortTitle: 'Reduced Inequalities',
    description: 'Reduce inequality within and among countries through equitable technology and healthcare access.',
    color: '#DD1367',
    relevantKeywords: ['Accessible Technology', 'Healthcare Equity', 'Open Access Research', 'Low-Resource NLP']
  },
  {
    id: 11,
    code: 'SDG 11',
    name: 'Sustainable Cities and Communities',
    shortTitle: 'Sustainable Cities',
    description: 'Make cities and human settlements inclusive, safe, resilient, and sustainable.',
    color: '#FD9D24',
    relevantKeywords: ['Urban Heat Islands', 'Autonomous Mobile Robots', 'Smart Grid Management', 'Structural Health Monitoring']
  },
  {
    id: 12,
    code: 'SDG 12',
    name: 'Responsible Consumption and Production',
    shortTitle: 'Responsible Consumption',
    description: 'Ensure sustainable consumption and production patterns through circular economy principles.',
    color: '#BF8B2E',
    relevantKeywords: ['Lifecycle Assessment', 'Polymer Nanocomposites', 'E-Waste Recycling', 'Sustainable Manufacturing']
  },
  {
    id: 13,
    code: 'SDG 13',
    name: 'Climate Action',
    shortTitle: 'Climate Action',
    description: 'Take urgent action to combat climate change and its impacts.',
    color: '#3F7E44',
    relevantKeywords: ['Carbon Capture & Storage', 'Atmospheric Aerosols', 'Renewable Energy Systems', 'Climate Modeling']
  },
  {
    id: 14,
    code: 'SDG 14',
    name: 'Life Below Water',
    shortTitle: 'Life Below Water',
    description: 'Conserve and sustainably use the oceans, seas, and marine resources for sustainable development.',
    color: '#0A97D9',
    relevantKeywords: ['Microplastic Degradation', 'Oceanic Acidification', 'Marine Biosensors', 'Coastal Ecosystems']
  },
  {
    id: 15,
    code: 'SDG 15',
    name: 'Life on Land',
    shortTitle: 'Life on Land',
    description: 'Protect, restore, and promote sustainable use of terrestrial ecosystems and halt biodiversity loss.',
    color: '#56C02B',
    relevantKeywords: ['Biochar Soil Remediation', 'Satellite Remote Sensing', 'Ecosystem Modeling', 'Biodiversity Mapping']
  },
  {
    id: 16,
    code: 'SDG 16',
    name: 'Peace, Justice and Strong Institutions',
    shortTitle: 'Peace & Justice',
    description: 'Promote peaceful and inclusive societies, provide access to justice, and build accountable institutions.',
    color: '#00689D',
    relevantKeywords: ['Federated Learning', 'Differential Privacy', 'Ethical AI', 'Algorithmic Auditing']
  },
  {
    id: 17,
    code: 'SDG 17',
    name: 'Partnerships for the Goals',
    shortTitle: 'Partnerships',
    description: 'Strengthen the means of implementation and revitalize the global partnership for sustainable development.',
    color: '#19486A',
    relevantKeywords: ['Open Science Data', 'Inter-Institutional Collaboration', 'Technology Transfer', 'Global Research Networks']
  }
];

export const SDG_MAP = new Map<number, SDGGoal>(
  UN_SDG_GOALS.map(sdg => [sdg.id, sdg])
);
