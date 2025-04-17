import React from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';

const ComparisonView = ({ predictionData }) => {
  // Radar chart data - comparing the current tweet to typical human/bot patterns
  const currentMetrics = predictionData.metrics;
  const hasExclamation = currentMetrics.exclamation_count > 0;
  const hasHashtag = currentMetrics.hashtag_count > 0;
  const hasLink = currentMetrics.link_count > 0;
  const hasMention = currentMetrics.mention_count > 0;
  
  // Create normalized values for radar chart 
  // (values between 0-1 for better visualization)
  const normalizedCurrentMetrics = {
    link_density: normalizeValue(hasLink ? 1 : 0, 0, 1, 0, 1),
    hashtag_density: normalizeValue(hasHashtag ? currentMetrics.hashtag_count / currentMetrics.word_count : 0, 0, 0.2, 0, 1),
    exclamation_use: normalizeValue(hasExclamation ? 1 : 0, 0, 1, 0, 1),
    sentiment_strength: normalizeValue(Math.abs(currentMetrics.sentiment_polarity || 0), 0, 1, 0, 1),
    word_complexity: normalizeValue(currentMetrics.avg_word_length || 4.5, 3, 7, 0, 1),
    mention_use: normalizeValue(hasMention ? 1 : 0, 0, 1, 0, 1),
  };
  
  const metricsComparisonData = [
    { subject: 'Link Usage', human: 0.3, bot: 0.8, current: normalizedCurrentMetrics.link_density, fullMark: 1 },
    { subject: 'Hashtag Usage', human: 0.4, bot: 0.7, current: normalizedCurrentMetrics.hashtag_density, fullMark: 1 },
    { subject: 'Exclamation Use', human: 0.5, bot: 0.8, current: normalizedCurrentMetrics.exclamation_use, fullMark: 1 },
    { subject: 'Sentiment Strength', human: 0.7, bot: 0.2, current: normalizedCurrentMetrics.sentiment_strength, fullMark: 1 },
    { subject: 'Word Complexity', human: 0.6, bot: 0.3, current: normalizedCurrentMetrics.word_complexity, fullMark: 1 },
    { subject: 'Mention Usage', human: 0.5, bot: 0.7, current: normalizedCurrentMetrics.mention_use, fullMark: 1 },
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

  // Get sentiment range for highlighting current tweet
  const getSentimentRange = (value) => {
    value = Math.max(-1, Math.min(1, value)); // Clamp between -1 and 1
    const ranges = [
      '-1.0 to -0.8', '-0.8 to -0.6', '-0.6 to -0.4', '-0.4 to -0.2', 
      '-0.2 to 0', '0 to 0.2', '0.2 to 0.4', '0.4 to 0.6', '0.6 to 0.8', '0.8 to 1.0'
    ];
    const index = Math.floor((value + 1) * 5);
    return ranges[index];
  };

  const currentSentimentRange = getSentimentRange(currentMetrics.sentiment_polarity || 0);
  
  // POS tag distribution - using actual metrics or sample data
  let posTagData = [];
  
  // Check if we have the actual POS data
  if (currentMetrics.pos_noun_count !== undefined) {
    const totalPOS = (
      (currentMetrics.pos_noun_count || 0) + 
      (currentMetrics.pos_verb_count || 0) + 
      (currentMetrics.pos_adj_count || 0) + 
      (currentMetrics.pos_adv_count || 0) + 
      (currentMetrics.pos_propn_count || 0) + 
      (currentMetrics.pos_pron_count || 0)
    );
    
    posTagData = [
      { name: 'Nouns', human: 35, bot: 40, current: ((currentMetrics.pos_noun_count || 0) / totalPOS) * 100 || 0 },
      { name: 'Verbs', human: 25, bot: 20, current: ((currentMetrics.pos_verb_count || 0) / totalPOS) * 100 || 0 },
      { name: 'Adjectives', human: 15, bot: 10, current: ((currentMetrics.pos_adj_count || 0) / totalPOS) * 100 || 0 },
      { name: 'Adverbs', human: 10, bot: 8, current: ((currentMetrics.pos_adv_count || 0) / totalPOS) * 100 || 0 },
      { name: 'Pronouns', human: 12, bot: 5, current: ((currentMetrics.pos_pron_count || 0) / totalPOS) * 100 || 0 },
      { name: 'Proper Nouns', human: 8, bot: 17, current: ((currentMetrics.pos_propn_count || 0) / totalPOS) * 100 || 0 },
    ];
  } else {
    // Fallback sample data
    posTagData = [
      { name: 'Nouns', human: 35, bot: 40, current: 38 },
      { name: 'Verbs', human: 25, bot: 20, current: 22 },
      { name: 'Adjectives', human: 15, bot: 10, current: 12 },
      { name: 'Adverbs', human: 10, bot: 8, current: 9 },
      { name: 'Pronouns', human: 12, bot: 5, current: 8 },
      { name: 'Others', human: 3, bot: 17, current: 11 },
    ];
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Metrics Comparison Radar */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2 text-center">Bot vs Human Metrics Comparison</h3>
        <p className="text-sm text-gray-600 mb-4 text-center">
          Comparing key metrics of this tweet against typical human and bot writing patterns.
        </p>
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={metricsComparisonData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={30} domain={[0, 1]} />
            <Radar name="Human" dataKey="human" stroke="#8884d8" fill="#8884d8" fillOpacity={0.5} />
            <Radar name="Bot" dataKey="bot" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.5} />
            <Radar name="Current Tweet" dataKey="current" stroke="#ff7300" fill="#ff7300" fillOpacity={0.4} />
            <Legend />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Sentiment Distribution */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2 text-center">Sentiment Polarity Distribution</h3>
        <p className="text-sm text-gray-600 mb-4 text-center">
          How sentiment is distributed across human and bot tweets, with this tweet highlighted.
        </p>
        <p className="text-sm text-center text-gray-600 mb-2">
          Current sentiment: {(currentMetrics.sentiment_polarity || 0).toFixed(2)}
        </p>
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
            {/* Highlight current sentiment range */}
            {sentimentDistributionData.map((entry) => 
              entry.range === currentSentimentRange ? (
                <Bar 
                  key={`highlight-${entry.range}`}
                  dataKey={() => 5} 
                  name="Current Tweet" 
                  fill="#ff7300" 
                  stackId="current"
                  barSize={10}
                />
              ) : null
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* POS Distribution */}
      <div className="col-span-2 bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2 text-center">Parts of Speech Distribution</h3>
        <p className="text-sm text-gray-600 mb-4 text-center">
          Comparison of parts of speech usage between humans, bots, and the current tweet.
        </p>
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
            <Bar dataKey="current" fill="#ff7300" name="Current Tweet" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Helper function to normalize values
const normalizeValue = (value, minInput, maxInput, minOutput, maxOutput) => {
  // Clamp the input value to the input range
  const clampedValue = Math.max(minInput, Math.min(maxInput, value));
  
  // Calculate the normalized value
  return minOutput + (clampedValue - minInput) * (maxOutput - minOutput) / (maxInput - minInput);
};

export default ComparisonView;