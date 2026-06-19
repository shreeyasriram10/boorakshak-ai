export const incidentTypes = ['Landslide', 'Flood', 'Cyclone', 'Earthquake', 'Heavy Rainfall', 'Flash Flood'];

export const disasterStats = [
  { label: 'Active Incidents', value: 38, change: '+12%' },
  { label: 'Rescue Requests', value: 112, change: '+8%' },
  { label: 'People Evacuated', value: 2_180, change: '+16%' },
  { label: 'Relief Camps Active', value: 14, change: '-4%' },
  { label: 'High Risk Zones', value: 9, change: '+3%' },
];

export const weatherForecast = [
  { day: 'Now', temp: 28, rainfall: '6mm', humidity: 82, wind: 14 },
  { day: '06:00', temp: 26, rainfall: '12mm', humidity: 88, wind: 17 },
  { day: '12:00', temp: 29, rainfall: '4mm', humidity: 78, wind: 18 },
  { day: '18:00', temp: 25, rainfall: '18mm', humidity: 91, wind: 11 },
  { day: 'Tomorrow', temp: 27, rainfall: '22mm', humidity: 89, wind: 16 },
];

export const historicalRisks = [
  { name: 'Jan', landslide: 18, rainfall: 90 },
  { name: 'Feb', landslide: 14, rainfall: 82 },
  { name: 'Mar', landslide: 26, rainfall: 101 },
  { name: 'Apr', landslide: 34, rainfall: 118 },
  { name: 'May', landslide: 48, rainfall: 142 },
  { name: 'Jun', landslide: 62, rainfall: 180 },
  { name: 'Jul', landslide: 76, rainfall: 214 },
];

export const mapLocations = [
  { id: 'zone-1', name: 'Nilgiris District', type: 'High Risk Zone', position: [11.4064, 76.6932], status: 'Extreme' },
  { id: 'zone-2', name: 'Coonoor Relief Camp', type: 'Relief Camp', position: [11.3521, 76.7993], status: 'Open' },
  { id: 'zone-3', name: 'Ooty Hospital', type: 'Hospital', position: [11.4060, 76.6955], status: 'Available' },
  { id: 'zone-4', name: 'District Control Room', type: 'Rescue Center', position: [11.4290, 76.8611], status: 'Active' },
  { id: 'zone-5', name: 'Mudumalai Checkpoint', type: 'Blocked Road', position: [11.5757, 76.5676], status: 'Blocked' },
];

export const riskZones = [
  {
    id: 'overlay-1',
    name: 'Landslide-Prone Sector',
    path: [
      [11.37, 76.68],
      [11.40, 76.76],
      [11.35, 76.84],
      [11.29, 76.78],
    ],
    color: '#F97316',
  },
  {
    id: 'overlay-2',
    name: 'Flood Alert Zone',
    path: [
      [11.48, 76.62],
      [11.54, 76.73],
      [11.49, 76.81],
      [11.42, 76.75],
    ],
    color: '#EF4444',
  },
];

export const rescueTeams = [
  { team: 'Rapid Response Alpha', location: 'Nilgiris District', status: 'Deployed', personnel: 24, vehicle: '4x4 Trucks', equipment: 'Drones, First Aid' },
  { team: 'River Rescue Bravo', location: 'Coonoor Sector', status: 'Standby', personnel: 18, vehicle: 'Boat Teams', equipment: 'Life Jackets' },
  { team: 'Terrain Support Charlie', location: 'Mudumalai', status: 'En Route', personnel: 14, vehicle: 'Bulldozers', equipment: 'Excavators' },
];

export const reliefCamps = [
  { name: 'Ooty Shelter Camp', capacity: 1_000, occupied: 782, food: 'Stocked', medical: 'Operational', water: 'Secure' },
  { name: 'Coonoor Relief Camp', capacity: 860, occupied: 614, food: 'Available', medical: 'Operational', water: 'Stable' },
  { name: 'Bandipur Transit Camp', capacity: 540, occupied: 406, food: 'Low', medical: 'Needs Supplies', water: 'Nominal' },
];

export const emergencyContacts = [
  { label: 'National Helpline', value: '112' },
  { label: 'Emergency Rescue', value: '108' },
  { label: 'Police', value: '100' },
  { label: 'Fire & Rescue', value: '101' },
];
