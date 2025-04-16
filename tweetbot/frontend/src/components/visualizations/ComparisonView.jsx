import React from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';

const ComparisonView = ({ predictionData }) => {
  // Sample comparison data
  const metricsComparisonData = [
    { subject: 'Link Count', human: 0.3, bot: 0.8, fullMark: 1 },
    { subject: 'Hashtag Use', human: 0.4, bot: 0.7, fullMark: 1 },
    { subject: 'Exclamation', human: 0.5, bot: 0.8, fullMark: 1 },
    { subject: 'Sentiment Var', human: 0.7, bot: 0.2, fullMark: 1 },
    { subject: 'Word Length', human: 0.6, bot: 0.3, fullMark: 1 },
    { subject: 'Unique Words', human: 0.8, bot: 0.4, fullMark: 1 },
  ];

  // Sample sentiment distribution data
  const sentimentDistributionData = [
    { range: '-1.0 to -0.8', human: 5, bot: 15 },
    { range: '-0.8 to -0.6', human: 8, bot: 20 },
    { range: '-0.6 to -0.4', human: 10, bot: 30 },
    { range: '-0.4 to -0.2', human: 12, bot: 25 },
    { range: '-0.2 to 0', human: 20, bot: 40 },
    { range: '0 to 0.2', human: 30, bot: 35 },
    { range: '0.2 to 0.4', human: 25, bot: 15 },
    { range: '0.4 to 0.6', human: 15, bot: 10 },
    { range: '0.6 to 0.8', human: 10, bot: 5 },
    { range: '0.8 to 1.0', human: 5, bot: 2 },
  ];

  // POS tag distribution
  const posTagData = [
    { name: 'Nouns', human: 35, bot: 40 },
    { name: 'Verbs', human: 25, bot: 20 },
    { name: 'Adjectives', human: 15, bot: 10 },
    { name: 'Adverbs', human: 10, bot: 8 },
    { name: 'Pronouns', human: 12, bot: 5 },
    { name: 'Others', human: 3, bot: 17 },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Metrics Comparison Radar */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2 text-center">Bot vs Human Metrics Comparison</h3>
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={metricsComparisonData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={30} domain={[0, 1]} />
            <Radar name="Human" dataKey="human" stroke="#8884d8" fill="#8884d8" fillOpacity={0.5} />
            <Radar name="Bot" dataKey="bot" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.5} />
            <Legend />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Sentiment Distribution */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2 text-center">Sentiment Polarity Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={sentimentDistributionData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="human" fill="#8884d8" name="Human" />
            <Bar dataKey="bot" fill="#82ca9d" name="Bot" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* POS Distribution */}
      <div className="col-span-2 bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2 text-center">Parts of Speech Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={posTagData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'Percentage', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="human" fill="#8884d8" name="Human" />
            <Bar dataKey="bot" fill="#82ca9d" name="Bot" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ComparisonView;