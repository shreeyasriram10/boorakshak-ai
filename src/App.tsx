import { useMemo, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  Tooltip,
} from 'react-leaflet';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  BarChart,
  Bar,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  CartesianGrid,
} from 'recharts';
const Bell = ({ size }: { size?: number }) => <span style={{ display: 'inline-flex', width: size, height: size, fontSize: size ? size * 0.9 : 18 }}>🔔</span>;
const ShieldAlert = ({ size }: { size?: number }) => <span style={{ display: 'inline-flex', width: size, height: size, fontSize: size ? size * 0.9 : 18 }}>🛡️</span>;
const MapPin = ({ size }: { size?: number }) => <span style={{ display: 'inline-flex', width: size, height: size, fontSize: size ? size * 0.9 : 18 }}>📍</span>;
const TrendingUp = ({ size }: { size?: number }) => <span style={{ display: 'inline-flex', width: size, height: size, fontSize: size ? size * 0.9 : 18 }}>📈</span>;
const CloudRain = ({ size }: { size?: number }) => <span style={{ display: 'inline-flex', width: size, height: size, fontSize: size ? size * 0.9 : 18 }}>🌧️</span>;
import {
  disasterStats,
  emergencyContacts,
  historicalRisks,
  incidentTypes,
  mapLocations,
  reliefCamps,
  rescueTeams,
  riskZones,
  weatherForecast,
} from './data';

type PredictionInput = {
  rainfallIntensity: number;
  rainfallDuration: number;
  soilMoisture: number;
  soilType: string;
  terrainSlope: number;
  vegetationCover: number;
  temperature: number;
};

type PredictionField = Exclude<keyof PredictionInput, 'soilType'>;

type PredictionResult = {
  score: number;
  category: string;
  action: string;
  tone: 'safe' | 'moderate' | 'high' | 'extreme';
  color: string;
};

const riskByValue = (value: number): { label: string; color: string; tone: PredictionResult['tone'] } => {
  if (value >= 85) return { label: 'Extreme Risk', color: '#ef4444', tone: 'extreme' };
  if (value >= 65) return { label: 'High Risk', color: '#f59e0b', tone: 'high' };
  if (value >= 40) return { label: 'Moderate Risk', color: '#facc15', tone: 'moderate' };
  return { label: 'Safe', color: '#10b981', tone: 'safe' };
};

const defaultPrediction: PredictionInput = {
  rainfallIntensity: 64,
  rainfallDuration: 8,
  soilMoisture: 67,
  soilType: 'Laterite',
  terrainSlope: 28,
  vegetationCover: 48,
  temperature: 24,
};

const computePrediction = (inputs: PredictionInput): PredictionResult => {
  const rainfall = Number(inputs.rainfallIntensity) * 0.35;
  const duration = Number(inputs.rainfallDuration) * 1.8;
  const moisture = Number(inputs.soilMoisture) * 0.6;
  const slope = Number(inputs.terrainSlope) * 1.4;
  const vegetation = 100 - Number(inputs.vegetationCover) * 0.4;
  const temp = Number(inputs.temperature) * 0.25;

  const score = Math.min(
    99,
    Math.max(8, Math.round(rainfall + duration + moisture + slope + vegetation + temp - 18)),
  );

  const category = riskByValue(score);
  const action =
    score >= 85
      ? 'Immediate Evacuation Required'
      : score >= 65
      ? 'Issue Warning'
      : score >= 40
      ? 'Prepare Emergency Teams'
      : 'Continue Monitoring';

  return {
    score,
    category: category.label,
    action,
    tone: category.tone,
    color: category.color,
  };
};

function App() {
  const [predictionInput, setPredictionInput] = useState(defaultPrediction);
  const [currentPrediction, setCurrentPrediction] = useState(() =>
    computePrediction(defaultPrediction),
  );
  const [incidentForm, setIncidentForm] = useState({
    name: '',
    location: '',
    incidentType: incidentTypes[0],
    description: '',
  });

  const [selectedAlert, setSelectedAlert] = useState('Nilgiris District');

  const weatherRisk = useMemo(() => {
    const forecastRain = weatherForecast[4].rainfall;
    return `Heavy rainfall ${forecastRain} expected in 48 hours. Prepare evacuation measures.`;
  }, []);

  const handlePredict = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = computePrediction(predictionInput);
    setCurrentPrediction(result);
    toast.info(`Prediction complete: ${result.category}`);
  };

  const handleFormChange = (
    field: keyof PredictionInput | 'name' | 'location' | 'incidentType' | 'description',
    value: string | number,
    formType: 'incident' | 'prediction',
  ) => {
    if (formType === 'prediction') {
      setPredictionInput((prev) => ({ ...prev, [field as keyof PredictionInput]: value }));
      return;
    }
    setIncidentForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitIncident = () => {
    toast.success('Incident report submitted to the Disaster Response Command Center.');
    setIncidentForm({ name: '', location: '', incidentType: incidentTypes[0], description: '' });
  };

  const alertMessage = `Warning: ${currentPrediction.category} detected in ${selectedAlert}. Residents are advised to move to designated shelters immediately.`;

  return (
    <div className="app-shell">
      <ToastContainer position="top-right" theme="dark" />

      <header className="topbar">
        <div className="brand-group">
          <div className="brand-mark">
            <span>💢</span>
          </div>
          <div className="brand-copy">
            <h1>BhooRakshak AI</h1>
            <p>National Disaster Management Technology Platform</p>
          </div>
        </div>
        <button className="toggle-theme">
          <Bell size={18} /> Emergency Mode
        </button>
      </header>

      <section className="hero-panel">
        <div className="hero-copy">
          <h2>Protecting Lives Through Intelligent Disaster Prediction</h2>
          <p>
            AI-powered landslide prediction, disaster monitoring, and emergency response system for safer communities.
          </p>
          <div className="hero-actions">
            <button className="primary">View Risk Dashboard</button>
            <button className="secondary">Report Incident</button>
            <button className="secondary">Emergency Help</button>
          </div>
          <div className="stats-row" style={{ marginTop: '28px' }}>
            {disasterStats.slice(0, 4).map((stat) => (
              <div key={stat.label} className="stat-card">
                <strong>{stat.value.toLocaleString()}</strong>
                <span>{stat.label}</span>
                <small>{stat.change} vs last week</small>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-visual">
          <div style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'grid', gap: 14 }}>
              <div className="metric-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ color: '#94a3b8' }}>Current Risk Level</span>
                    <strong style={{ display: 'block', marginTop: 8, fontSize: '2rem' }}>EXTREME</strong>
                  </div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 20, height: 20, borderRadius: '999px', background: '#ef4444' }} />
                    <small>Alert issued</small>
                  </div>
                </div>
              </div>
              <div className="metric-card" style={{ display: 'grid', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Rainfall / Soil</span>
                  <strong>142 mm / 67%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Slope Stability</span>
                  <strong>38%</strong>
                </div>
              </div>
              <div className="metric-card" style={{ padding: '24px', borderRadius: '28px' }}>
                <span style={{ color: '#94a3b8' }}>Recommendation</span>
                <strong style={{ marginTop: 10, fontSize: '1.25rem' }}>
                  Deploy rescue teams to high-risk zones and issue evacuation advisories.
                </strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-grid" style={{ marginTop: '32px' }}>
        <div className="dashboard-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3>Real-Time Risk Monitoring Command Center</h3>
              <p style={{ margin: '10px 0 0', color: 'var(--text-secondary)' }}>
                Live telemetry from the field, weather, and sensor networks.
              </p>
            </div>
            <button className="secondary" style={{ padding: '12px 18px' }}>
              <ShieldAlert size={16} /> Active Alert
            </button>
          </div>
          <div className="risk-status" style={{ marginTop: 22 }}>
            <div className="status-pill safe">
              <strong>Safe</strong>
              <span>18 districts</span>
            </div>
            <div className="status-pill moderate">
              <strong>Moderate Risk</strong>
              <span>42 districts</span>
            </div>
            <div className="status-pill high">
              <strong>High Risk</strong>
              <span>29 districts</span>
            </div>
            <div className="status-pill extreme">
              <strong>Extreme Risk</strong>
              <span>9 districts</span>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Government Operations Summary</h3>
          <div className="metric-row" style={{ marginTop: 18 }}>
            <div className="metric-card">
              <small>Active Incidents</small>
              <strong>38</strong>
            </div>
            <div className="metric-card">
              <small>Rescue Requests</small>
              <strong>112</strong>
            </div>
            <div className="metric-card">
              <small>People Evacuated</small>
              <strong>2,180</strong>
            </div>
            <div className="metric-card">
              <small>High Risk Zones</small>
              <strong>9</strong>
            </div>
          </div>
          <div style={{ marginTop: 20 }}>
            <div className="list-card">
              <h4>AI Recommendation</h4>
              <small>{weatherRisk}</small>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid" style={{ marginTop: 26 }}>
        <div className="col-1">
          <div className="dashboard-card">
            <h3>Landslide Prediction Module</h3>
            <form className="prediction-form" onSubmit={handlePredict}>
              <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
                {(
                  [
                    { label: 'Rainfall Intensity (mm/hr)', field: 'rainfallIntensity', type: 'number' as const },
                    { label: 'Rainfall Duration (hrs)', field: 'rainfallDuration', type: 'number' as const },
                    { label: 'Soil Moisture (%)', field: 'soilMoisture', type: 'number' as const },
                    { label: 'Terrain Slope (°)', field: 'terrainSlope', type: 'number' as const },
                    { label: 'Vegetation Cover (%)', field: 'vegetationCover', type: 'number' as const },
                    { label: 'Temperature (°C)', field: 'temperature', type: 'number' as const },
                  ] as Array<{ label: string; field: PredictionField; type: 'number' }>
                ).map((input) => (
                  <label key={input.field}>
                    {input.label}
                    <input
                      type={input.type}
                      value={predictionInput[input.field]}
                      onChange={(e) => handleFormChange(input.field, Number(e.target.value), 'prediction')}
                    />
                  </label>
                ))}
                <label>
                  Soil Type
                  <select
                    value={predictionInput.soilType}
                    onChange={(e) => handleFormChange('soilType', e.target.value, 'prediction')}
                  >
                    {['Laterite', 'Alluvial', 'Clay', 'Sandy Loam', 'Silt Loam'].map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>
              </div>
              <button type="submit">Run Prediction</button>
            </form>
            <div className="prediction-result" style={{ marginTop: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 18 }}>
                <div>
                  <h4>Prediction Result</h4>
                  <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>
                    AI-calculated landslide risk using current environmental data.
                  </p>
                </div>
                <span style={{ color: currentPrediction.color, fontWeight: 700 }}>{currentPrediction.category}</span>
              </div>
              <div className="result-row">
                <div className="result-chip">
                  <strong>Risk Percentage</strong>
                  <span>{currentPrediction.score}%</span>
                </div>
                <div className="result-chip">
                  <strong>Recommended Action</strong>
                  <span>{currentPrediction.action}</span>
                </div>
                <div className="result-chip">
                  <strong>Location</strong>
                  <span>{selectedAlert}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <h3>Emergency Warning System</h3>
            <div className="alert-panel">
              <div className="alert-pill">
                <strong>SMS Alert</strong>
                <span>{alertMessage}</span>
              </div>
              <div className="alert-pill" style={{ background: 'rgba(37, 99, 235, 0.14)', borderColor: 'rgba(37, 99, 235, 0.24)' }}>
                <strong>Push Notification</strong>
                <span>Push notification queued for citizens in high-risk sectors.</span>
              </div>
            </div>
            <div style={{ marginTop: 20, display: 'grid', gap: 14 }}>
              {emergencyContacts.map((contact) => (
                <div key={contact.label} className="list-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{contact.label}</strong>
                    <small>{contact.value}</small>
                  </div>
                  <button style={{ border: 'none', background: 'rgba(16, 185, 129, 0.14)', color: '#a7f3d0', padding: '12px 18px', borderRadius: '14px' }}>
                    Call
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-2">
          <div className="dashboard-card map-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div>
                <h3>Interactive GIS Map</h3>
                <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)' }}>
                  Incident zones, relief camps, hospitals, and public safety overlays.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="secondary">Layer</button>
                <button className="secondary">Stakeholder View</button>
              </div>
            </div>
            <MapContainer center={[11.4, 76.7]} zoom={10} scrollWheelZoom={false} style={{ minHeight: 520, borderRadius: 28 }}>
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {mapLocations.map((location) => (
                <Marker key={location.id} position={location.position as [number, number]}>
                  <Popup>
                    <strong>{location.name}</strong>
                    <div>{location.type}</div>
                    <small>{location.status}</small>
                  </Popup>
                  <Tooltip>{location.name}</Tooltip>
                </Marker>
              ))}
              {riskZones.map((zone) => (
                <Polygon
                  key={zone.id}
                  positions={zone.path as [number, number][]}
                  pathOptions={{ color: zone.color, weight: 2, fillOpacity: 0.15 }}
                >
                  <Tooltip>{zone.name}</Tooltip>
                </Polygon>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>

      <div className="dashboard-grid" style={{ marginTop: 26 }}>
        <div className="col-1">
          <div className="dashboard-card">
            <h3>Citizen Incident Reporting</h3>
            <form className="incident-form" onSubmit={(e) => { e.preventDefault(); submitIncident(); }}>
              <label>
                Name
                <input
                  type="text"
                  value={incidentForm.name}
                  onChange={(e) => handleFormChange('name', e.target.value, 'incident')}
                  placeholder="Your full name"
                />
              </label>
              <label>
                Location
                <input
                  type="text"
                  value={incidentForm.location}
                  onChange={(e) => handleFormChange('location', e.target.value, 'incident')}
                  placeholder="Village / district"
                />
              </label>
              <label>
                Incident Type
                <select
                  value={incidentForm.incidentType}
                  onChange={(e) => handleFormChange('incidentType', e.target.value, 'incident')}
                >
                  {incidentTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </label>
              <label>
                Description
                <textarea
                  value={incidentForm.description}
                  onChange={(e) => handleFormChange('description', e.target.value, 'incident')}
                  placeholder="Describe the event, damage, or hazard."
                />
              </label>
              <button type="submit">Submit Report</button>
            </form>
          </div>

          <div className="dashboard-card safety-grid">
            <div className="safety-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>SOS Emergency System</strong>
                  <p>Quick access to nearby support and helplines during immediate emergencies.</p>
                </div>
                <button className="primary" style={{ padding: '12px 18px', fontSize: '0.95rem' }}>
                  Activate SOS
                </button>
              </div>
            </div>
            {reliefCamps.map((camp) => (
              <div key={camp.name} className="safety-card">
                <strong>{camp.name}</strong>
                <small>Capacity: {camp.capacity.toLocaleString()}</small>
                <small>Occupied: {camp.occupied.toLocaleString()}</small>
                <small>Food: {camp.food}</small>
                <small>Medical: {camp.medical}</small>
                <small>Water: {camp.water}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="col-2">
          <div className="dashboard-card">
            <h3>Rescue Team Management</h3>
            <div className="list-grid">
              {rescueTeams.map((team) => (
                <div key={team.team} className="list-card">
                  <h4>{team.team}</h4>
                  <small>{team.location}</small>
                  <p style={{ margin: '10px 0 0' }}>Status: {team.status}</p>
                  <p style={{ margin: '6px 0 0' }}>Vehicle: {team.vehicle}</p>
                  <p style={{ margin: '6px 0 0' }}>Equipment: {team.equipment}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-card weather-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3>Weather Intelligence</h3>
                <p style={{ margin: '10px 0 0', color: 'var(--text-secondary)' }}>
                  Current conditions support risk-index modeling and alert prioritization.
                </p>
              </div>
              <CloudRain size={22} />
            </div>
            <div className="weather-row">
              <div className="weather-item">
                <strong>Temperature</strong>
                <span>28°C</span>
              </div>
              <div className="weather-item">
                <strong>Rainfall</strong>
                <span>142 mm</span>
              </div>
              <div className="weather-item">
                <strong>Humidity</strong>
                <span>83%</span>
              </div>
              <div className="weather-item">
                <strong>Wind Speed</strong>
                <span>18 km/h</span>
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                {weatherForecast.map((forecast) => (
                  <div key={forecast.day} className="weather-item" style={{ minWidth: 100 }}>
                    <strong>{forecast.day}</strong>
                    <span>{forecast.temp}°C</span>
                    <small>{forecast.rainfall}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="charts-grid" style={{ marginTop: 30 }}>
        <div className="chart-frame">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Landslide Trends</h3>
            <TrendingUp size={18} />
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={historicalRisks} margin={{ top: 24, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="rgba(148, 163, 184, 0.08)" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <ReTooltip contentStyle={{ background: '#020617', border: '1px solid rgba(148, 163, 184, 0.16)' }} />
              <Line type="monotone" dataKey="landslide" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-frame">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>District-Wise Risk</h3>
            <MapPin size={18} />
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={historicalRisks} margin={{ top: 24, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="rgba(148, 163, 184, 0.08)" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <ReTooltip contentStyle={{ background: '#020617', border: '1px solid rgba(148, 163, 184, 0.16)' }} />
              <Bar dataKey="rainfall" radius={[12, 12, 0, 0]}>
                {historicalRisks.map((entry) => (
                  <Cell key={entry.name} fill={entry.rainfall > 120 ? '#ef4444' : '#2563eb'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <footer className="footer">
        <div>
          <strong>BhooRakshak AI © 2026</strong>
          <small>Developed by Shreeya S · Technology for Safer Communities</small>
        </div>
        <div style={{ color: 'var(--text-secondary)' }}>
          <small>National Disaster Management Authority | Government Disaster Response Platform</small>
        </div>
      </footer>
    </div>
  );
}

export default App;
