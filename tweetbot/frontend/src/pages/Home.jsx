import React from 'react';
import InputForm from '../components/InputForm';
import PredictionOutput from '../components/PredictionOutput';
import MetricDisplay from '../components/MetricDisplay';

const Home = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-100 to-slate-200 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-8 space-y-8 border border-gray-200">
        <header className="text-center">
          <h1 className="text-4xl font-extrabold text-blue-700 drop-shadow-sm">Twitter Bot Detector</h1>
          <p className="text-gray-600 mt-2 text-lg">Classify tweets as human or bot-generated using AI</p>
        </header>

        <section>
          <InputForm />
        </section>

        <section>
          <PredictionOutput />
        </section>

        <section>
          <MetricDisplay />
        </section>
      </div>
    </main>
  );
};

export default Home;