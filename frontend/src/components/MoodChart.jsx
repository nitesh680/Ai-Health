import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const MoodChart = ({ data = [], height = 300 }) => {
  const chartData = data.map((item, index) => ({
    name: new Date(item.date || item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: item.score || item.moodScore || 50,
    label: item.label || 'okay'
  })).reverse();

  if (chartData.length === 0) {
    // Demo data
    const demoData = Array.from({ length: 14 }, (_, i) => ({
      name: new Date(Date.now() - (13 - i) * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: Math.floor(Math.random() * 40) + 40
    }));
    chartData.push(...demoData);
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const score = payload[0].value;
      const emoji = score >= 80 ? '😊' : score >= 60 ? '🙂' : score >= 40 ? '😐' : score >= 20 ? '😔' : '😢';
      return (
        <div className="glass-card p-3 shadow-lg">
          <p className="font-semibold text-slate-800 dark:text-white">{label}</p>
          <p className="text-sm text-slate-600 dark:text-slate-300">{emoji} Mood Score: {score}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="score" stroke="#0ea5e9" strokeWidth={3} fill="url(#moodGradient)" dot={{ fill: '#0ea5e9', r: 4, strokeWidth: 2, stroke: 'white' }} activeDot={{ r: 6 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default MoodChart;
