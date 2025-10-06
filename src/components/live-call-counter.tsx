import React, { useState, useEffect } from 'react';
import { Phone, Users, TrendingUp, Clock } from 'lucide-react';

interface LiveCallCounterProps {
  className?: string;
}

export default function LiveCallCounter({ className = '' }: LiveCallCounterProps) {
  const [callsToday, setCallsToday] = useState(1247);
  const [activeUsers, setActiveUsers] = useState(23);
  const [conversionRate, setConversionRate] = useState(23.4);
  const [lastCallTime, setLastCallTime] = useState(new Date());

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      // Increment calls randomly
      setCallsToday(prev => prev + Math.floor(Math.random() * 3) + 1);
      
      // Update active users
      setActiveUsers(prev => prev + Math.floor(Math.random() * 3) - 1);
      
      // Update conversion rate slightly
      setConversionRate(prev => Math.max(20, Math.min(30, prev + (Math.random() - 0.5) * 0.2)));
      
      // Update last call time
      setLastCallTime(new Date());
    }, 3000 + Math.random() * 2000); // Random interval between 3-5 seconds

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  };

  return (
    <div className={`bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-green-200/50 dark:border-green-700/50 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold text-green-700 dark:text-green-400">Live Activity</span>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Last updated: {formatTime(lastCallTime)}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Calls Today */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Calls Today</span>
          </div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {callsToday.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            +{Math.floor(Math.random() * 5) + 1} in last minute
          </div>
        </div>

        {/* Active Users */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Users</span>
          </div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {activeUsers}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Using AI calling now
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Avg. Conversion</span>
          </div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {conversionRate.toFixed(1)}%
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Lead to meeting rate
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-4 pt-4 border-t border-green-200/50 dark:border-green-700/50">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <span className="text-slate-600 dark:text-slate-400">Last call:</span>
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {getTimeAgo(lastCallTime)}
            </span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            📞 AI agent "Sarah" just closed a $2,500 deal
          </div>
        </div>
      </div>
    </div>
  );
}
