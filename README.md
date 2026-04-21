# RhisAlert - Healthcare & Respiratory Resilience

O **RhisAlert** é uma solução Full-Stack desenvolvida para o monitoramento de resiliência respiratória em tempo real, focada na cidade de Porto Alegre. O projeto integra dados climáticos e indicadores de qualidade do ar para fornecer alertas clínicos e recomendações de saúde personalizadas.

## 🧬 Contexto Acadêmico e Tecnológico
Este projeto faz parte do desenvolvimento no curso de **Informática Biomédica (UFCSPA)**. Ele utiliza modelos matemáticos para correlacionar o Índice de Qualidade do Ar (AQI) e umidade com o risco de sensibilidade respiratória.

## 🛠️ Tecnologias Utilizadas
- **Frontend**: Angular (com Signals e Componentes Standalone)
- **Backend**: Node.js & Express
- **Banco de Dados**: MongoDB Atlas
- **API**: OpenWeather (Weather & Air Pollution)
- **Estilização**: Bootstrap 5 & CSS Dinâmico (Conic-Gradients)

## 📊 Funcionalidades
- **Riscômetro em Tempo Real**: Cálculo de risco de 0 a 100 baseado em poluentes atmosféricos.
- **BioTips**: Recomendações clínicas dinâmicas (ex: lavagem nasal, hidratação).
- **Módulo de Healthcare**: Gestão de medicamentos e controle de ingestão hídrica.
- **Grade Toxicológica**: Monitoramento detalhado de CO, NO2, O3 e Material Particulado (PM2.5 e PM10).

## 🚀 Como Executar o Projeto

### 1. Backend
```bash
cd backend
npm install
# Crie um arquivo .env com suas chaves (MONGODB_URI e OPENWEATHER_API_KEY)
node server.js
```
### 2. Frontend
```bash
cd frontend
npm install
ng serve
# Acesse: http://localhost:4200
