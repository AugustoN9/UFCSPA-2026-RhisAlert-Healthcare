require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');

const app = express();

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// --- 1. Ligação ao MongoDB Atlas ---
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  console.error('❌ ERRO: A variável MONGODB_URI não foi definida no arquivo .env!');
  process.exit(1);
}

mongoose.connect(mongoURI)
  .then(() => console.log('✅ Conectado com sucesso ao MongoDB Atlas!'))
  .catch(err => {
    console.error('❌ Erro de conexão com o Atlas:', err.message);
  });

// --- 2. Modelo de Dados (User Schema) ---
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: String,
  city: String,
  country: String,
  respiratoryConditions: { type: [String], default: [] }, 
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

// --- 3. Rotas de Autenticação ---

app.get('/', (req, res) => {
  res.send('API RhisAlert-Healthcare está Online! 🚀');
});

app.post('/api/register', async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    const { password, ...userResponse } = savedUser.toObject();
    res.status(201).json({ message: 'Usuário cadastrado!', user: userResponse });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao processar registro.' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(401).json({ error: 'Credenciais inválidas.' });
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.json({ user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno.' });
  }
});

// --- 4. Rota de Clima e Poluição (Análise Biomédica) ---

app.get('/api/weather', async (req, res) => {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const city = 'Porto Alegre';
    
    // Busca coordenadas da cidade
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city},BR&limit=1&appid=${apiKey}`;
    const geoRes = await axios.get(geoUrl);
    if (!geoRes.data.length) return res.status(404).json({ error: 'Cidade não encontrada.' });
    const { lat, lon } = geoRes.data[0];

    // Busca Clima e Poluição em paralelo
    const [weatherRes, pollutionRes] = await Promise.all([
      axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}&lang=pt_br`),
      axios.get(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`)
    ]);

    const { temp, humidity, feels_like } = weatherRes.data.main;
    const { speed: windSpeed } = weatherRes.data.wind;
    const pollutionData = pollutionRes.data.list[0];
    const aqi = pollutionData.main.aqi; 
    const components = pollutionData.components;

    // --- LÓGICA DO RISCÔMETRO (0-100) ---
    let riskScore = (aqi * 15); 
    if (humidity < 35) riskScore += 25; 
    if (components.pm2_5 > 15) riskScore += 10;
    riskScore = Math.min(riskScore, 100);

    let riskLabel = 'Baixo';
    let bioTips = ['Dia tranquilo! Condições favoráveis para a respiração.'];

    // Se o risco for alto, aplica as recomendações do protótipo
    if (riskScore >= 75) {
      riskLabel = 'Muito Alto';
      bioTips = [
        'Evite atividades ao ar livre.',
        'Mantenha ambientes internos úmidos.',
        'Realize lavagem nasal com soro.'
      ];
    } else if (riskScore >= 40) {
      riskLabel = 'Médio';
      bioTips = [
        'Evite exposição prolongada a poluentes.',
        'Mantenha a hidratação constante.'
      ];
    }

    console.log(`>>> [BIOMÉDICA] POA: ${temp}°C | Score: ${riskScore} | Status: ${riskLabel}`);

    res.json({
      city,
      temp: temp.toFixed(1),
      feels_like: feels_like.toFixed(1),
      humidity,
      windSpeed,
      description: weatherRes.data.weather[0].description,
      aqi,
      pm25: components.pm2_5,
      pollutants: components,
      riskScore,     // Valor para o Gauge
      riskLabel,     // Texto do Status
      bioTips,       // Lista de cuidados
      updatedAt: new Date()
    });

  } catch (error) {
    console.error('Erro no processamento ambiental:', error.message);
    res.status(500).json({ error: 'Falha ao obter dados biomédicos.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`📡 Servidor RhisAlert rodando em http://localhost:${PORT}`);
});