/**
 * Generates realistic health data for analytics
 * Used for demonstration purposes until connected to real backend
 */

export function generateHealthData(timeRange) {
  const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
  const data = [];
  
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Generate realistic health metrics with natural variation
    const baseHeartRate = 70;
    const baseSteps = 8000;
    const baseSleep = 7.5;
    const baseActiveMinutes = 45;
    const baseCalories = 2100;
    
    // Add some variation and weekly patterns
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    data.push({
      date: date.toISOString().split('T')[0],
      displayDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      heartRate: Math.round(baseHeartRate + (Math.random() - 0.5) * 8 + (isWeekend ? -2 : 0)),
      steps: Math.round(baseSteps + (Math.random() - 0.3) * 2000 + (isWeekend ? 1500 : 0)),
      sleep: parseFloat((baseSleep + (Math.random() - 0.5) * 1.5 + (isWeekend ? 0.5 : 0)).toFixed(1)),
      activeMinutes: Math.round(baseActiveMinutes + (Math.random() - 0.3) * 15 + (isWeekend ? 10 : 0)),
      calories: Math.round(baseCalories + (Math.random() - 0.5) * 400),
      restingHeartRate: Math.round(60 + (Math.random() - 0.5) * 6),
      maxHeartRate: Math.round(150 + (Math.random() - 0.5) * 20),
      deepSleep: parseFloat(((baseSleep * 0.3) + (Math.random() - 0.5) * 0.5).toFixed(1)),
      lightSleep: parseFloat(((baseSleep * 0.5) + (Math.random() - 0.5) * 0.5).toFixed(1)),
      remSleep: parseFloat(((baseSleep * 0.2) + (Math.random() - 0.5) * 0.3).toFixed(1)),
    });
  }
  
  return data;
}

export function calculateMetrics(data) {
  if (!data || data.length === 0) return null;
  
  const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
  const sum = (arr) => arr.reduce((a, b) => a + b, 0);
  
  const heartRates = data.map(d => d.heartRate);
  const steps = data.map(d => d.steps);
  const sleep = data.map(d => d.sleep);
  const activeMinutes = data.map(d => d.activeMinutes);
  
  // Calculate previous period for comparison
  const halfPoint = Math.floor(data.length / 2);
  const recentData = data.slice(halfPoint);
  const previousData = data.slice(0, halfPoint);
  
  const recentAvgHR = avg(recentData.map(d => d.heartRate));
  const previousAvgHR = avg(previousData.map(d => d.heartRate));
  const hrChange = ((recentAvgHR - previousAvgHR) / previousAvgHR * 100).toFixed(1);
  
  const recentAvgSteps = avg(recentData.map(d => d.steps));
  const previousAvgSteps = avg(previousData.map(d => d.steps));
  const stepsChange = ((recentAvgSteps - previousAvgSteps) / previousAvgSteps * 100).toFixed(1);
  
  const recentAvgSleep = avg(recentData.map(d => d.sleep));
  const previousAvgSleep = avg(previousData.map(d => d.sleep));
  const sleepChange = ((recentAvgSleep - previousAvgSleep) / previousAvgSleep * 100).toFixed(1);
  
  const recentAvgActive = avg(recentData.map(d => d.activeMinutes));
  const previousAvgActive = avg(previousData.map(d => d.activeMinutes));
  const activeChange = ((recentAvgActive - previousAvgActive) / previousAvgActive * 100).toFixed(1);
  
  return {
    averageHeartRate: Math.round(avg(heartRates)),
    minHeartRate: Math.min(...heartRates),
    maxHeartRate: Math.max(...heartRates),
    heartRateChange: hrChange,
    
    totalSteps: sum(steps),
    averageSteps: Math.round(avg(steps)),
    stepsChange: stepsChange,
    
    averageSleep: avg(sleep).toFixed(1),
    totalSleep: sum(sleep).toFixed(1),
    sleepChange: sleepChange,
    
    totalActiveMinutes: sum(activeMinutes),
    averageActiveMinutes: Math.round(avg(activeMinutes)),
    activeChange: activeChange,
    
    totalCalories: sum(data.map(d => d.calories)),
    averageCalories: Math.round(avg(data.map(d => d.calories))),
  };
}

export function generateInsights(data, metrics) {
  if (!data || !metrics) return [];
  
  const insights = [];
  
  // Heart rate insights
  const hrVariability = metrics.maxHeartRate - metrics.minHeartRate;
  if (hrVariability < 10) {
    insights.push({
      type: 'positive',
      category: 'heart',
      title: 'Excellent Heart Rate Stability',
      description: `Your heart rate has been very consistent, varying only ${hrVariability} bpm over this period. This indicates good cardiovascular health.`,
      metric: `${metrics.averageHeartRate} bpm average`,
    });
  } else if (hrVariability > 25) {
    insights.push({
      type: 'warning',
      category: 'heart',
      title: 'Heart Rate Variability',
      description: `Your heart rate has varied by ${hrVariability} bpm. Consider monitoring stress levels and recovery.`,
      metric: `${metrics.averageHeartRate} bpm average`,
    });
  } else {
    insights.push({
      type: 'positive',
      category: 'heart',
      title: 'Healthy Heart Rate',
      description: `Your average heart rate of ${metrics.averageHeartRate} bpm is within the normal range for adults.`,
      metric: `${hrVariability} bpm variation`,
    });
  }
  
  // Steps insights
  const stepGoal = 8000;
  const daysAboveGoal = data.filter(d => d.steps >= stepGoal).length;
  const achievementRate = ((daysAboveGoal / data.length) * 100).toFixed(0);
  
  if (daysAboveGoal >= data.length * 0.8) {
    insights.push({
      type: 'positive',
      category: 'activity',
      title: 'Outstanding Step Achievement',
      description: `You've reached your step goal ${daysAboveGoal} out of ${data.length} days (${achievementRate}%)! Keep up the excellent work.`,
      metric: `${metrics.averageSteps.toLocaleString()} avg steps`,
    });
  } else if (daysAboveGoal >= data.length * 0.5) {
    insights.push({
      type: 'info',
      category: 'activity',
      title: 'Good Step Progress',
      description: `You achieved your step goal ${achievementRate}% of the time. Try to increase consistency.`,
      metric: `${metrics.averageSteps.toLocaleString()} avg steps`,
    });
  } else {
    insights.push({
      type: 'warning',
      category: 'activity',
      title: 'Step Goal Opportunity',
      description: `You've reached your step goal ${daysAboveGoal} out of ${data.length} days. Consider adding short walks throughout the day.`,
      metric: `${metrics.averageSteps.toLocaleString()} avg steps`,
    });
  }
  
  // Sleep insights
  if (parseFloat(metrics.averageSleep) >= 7.5) {
    insights.push({
      type: 'positive',
      category: 'sleep',
      title: 'Optimal Sleep Duration',
      description: `You're averaging ${metrics.averageSleep} hours of sleep, which is excellent for recovery and health.`,
      metric: `${parseFloat(metrics.sleepChange) > 0 ? '+' : ''}${metrics.sleepChange}% vs previous period`,
    });
  } else if (parseFloat(metrics.averageSleep) >= 6.5) {
    insights.push({
      type: 'info',
      category: 'sleep',
      title: 'Adequate Sleep',
      description: `You're getting ${metrics.averageSleep} hours of sleep on average. Consider aiming for 7-8 hours for optimal health.`,
      metric: `${parseFloat(metrics.sleepChange) > 0 ? '+' : ''}${metrics.sleepChange}% vs previous period`,
    });
  } else {
    insights.push({
      type: 'warning',
      category: 'sleep',
      title: 'Sleep Improvement Needed',
      description: `Your average sleep of ${metrics.averageSleep} hours is below the recommended 7-8 hours. Prioritize rest for better health.`,
      metric: `${parseFloat(metrics.sleepChange) > 0 ? '+' : ''}${metrics.sleepChange}% vs previous period`,
    });
  }
  
  // Activity insights
  if (metrics.averageActiveMinutes >= 60) {
    insights.push({
      type: 'positive',
      category: 'activity',
      title: 'Exceeding Activity Goals',
      description: `You're averaging ${metrics.averageActiveMinutes} active minutes per day, exceeding WHO recommendations!`,
      metric: `${parseFloat(metrics.activeChange) > 0 ? '+' : ''}${metrics.activeChange}% change`,
    });
  } else if (metrics.averageActiveMinutes >= 30) {
    insights.push({
      type: 'positive',
      category: 'activity',
      title: 'Meeting Activity Guidelines',
      description: `Great job maintaining ${metrics.averageActiveMinutes} active minutes daily. You're meeting basic health guidelines.`,
      metric: `${parseFloat(metrics.activeChange) > 0 ? '+' : ''}${metrics.activeChange}% change`,
    });
  } else {
    insights.push({
      type: 'info',
      category: 'activity',
      title: 'Activity Opportunity',
      description: `Consider increasing your daily active minutes from ${metrics.averageActiveMinutes} to at least 30 for optimal health benefits.`,
      metric: `${parseFloat(metrics.activeChange) > 0 ? '+' : ''}${metrics.activeChange}% change`,
    });
  }
  
  // Trend insights
  if (parseFloat(metrics.stepsChange) > 10) {
    insights.push({
      type: 'positive',
      category: 'trend',
      title: 'Activity Trending Up',
      description: `Your daily steps have increased by ${metrics.stepsChange}% recently. Excellent progress!`,
      metric: 'Positive trend detected',
    });
  }
  
  if (parseFloat(metrics.sleepChange) < -10) {
    insights.push({
      type: 'warning',
      category: 'trend',
      title: 'Sleep Pattern Alert',
      description: `Your sleep has decreased by ${Math.abs(metrics.sleepChange)}% recently. Consider evaluating your bedtime routine.`,
      metric: 'Declining trend detected',
    });
  }
  
  return insights;
}
