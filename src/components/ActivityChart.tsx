import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from './ui/button';

const mockData7Days = [
  { date: '15 ноя', projects: 5 },
  { date: '16 ноя', projects: 8 },
  { date: '17 ноя', projects: 6 },
  { date: '18 ноя', projects: 12 },
  { date: '19 ноя', projects: 9 },
  { date: '20 ноя', projects: 14 },
  { date: '21 ноя', projects: 11 }
];

const mockData30Days = [
  { date: '22 окт', projects: 15 },
  { date: '29 окт', projects: 18 },
  { date: '5 ноя', projects: 12 },
  { date: '12 ноя', projects: 20 },
  { date: '19 ноя', projects: 25 },
  { date: '21 ноя', projects: 22 }
];

const mockData90Days = [
  { date: 'Авг', projects: 45 },
  { date: 'Сен', projects: 52 },
  { date: 'Окт', projects: 68 },
  { date: 'Ноя', projects: 47 }
];

type Period = '7' | '30' | '90';

export const ActivityChart = () => {
  const [period, setPeriod] = useState<Period>('7');

  const data = {
    '7': mockData7Days,
    '30': mockData30Days,
    '90': mockData90Days
  }[period];

  return (
    <div className="bg-card rounded-xl border p-4 md:p-6 lg:p-8 shadow-sm hover:shadow-md transition-smooth animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-lg md:text-xl font-bold">Активность проектов</h3>
        
        <div className="flex gap-2 flex-wrap">
          {(['7', '30', '90'] as Period[]).map((p) => (
            <Button
              key={p}
              size="sm"
              variant={period === p ? 'default' : 'outline'}
              onClick={() => setPeriod(p)}
            >
              {p} дней
            </Button>
          ))}
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <ResponsiveContainer width="100%" height={300} minWidth={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorProjects" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.3} />
          <XAxis
            dataKey="date"
            stroke="hsl(var(--muted-foreground))"
            fontSize={14}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={14}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          />
          <Area
            type="monotone"
            dataKey="projects"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            fill="url(#colorProjects)"
            dot={{ fill: 'hsl(var(--primary))', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
};
