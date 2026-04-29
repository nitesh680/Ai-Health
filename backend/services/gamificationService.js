const User = require('../models/User');

class GamificationService {
  async addPoints(userId, action) {
    try {
      const pointsMap = {
        'mood_log': 10,
        'journal_entry': 20,
        'daily_streak': 5
      };
      
      const pointsToAdd = pointsMap[action] || 5;
      const user = await User.findById(userId);
      if (!user) return null;
      
      user.points = (user.points || 0) + pointsToAdd;
      
      // Check badges
      const newBadges = [];
      const userBadges = user.badges || [];
      if (user.points >= 100 && !userBadges.includes('Bronze Planner')) newBadges.push('Bronze Planner');
      if (user.points >= 500 && !userBadges.includes('Silver Mind')) newBadges.push('Silver Mind');
      if (user.points >= 1000 && !userBadges.includes('Gold Soul')) newBadges.push('Gold Soul');
      
      // Streak logic on mood log
      if (action === 'mood_log') {
        const today = new Date();
        const lastActiveDate = new Date(user.lastActive || Date.now());
        
        // Reset times to midnight to just compare days
        const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const la = new Date(lastActiveDate.getFullYear(), lastActiveDate.getMonth(), lastActiveDate.getDate());
        
        const diffDays = Math.floor((t - la) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          user.streaks = (user.streaks || 0) + 1; // Consecutive day
        } else if (diffDays > 1) {
          user.streaks = 1; // Reset streak
        } else if (diffDays === 0 && !user.lastActive) {
          user.streaks = 1; // First mood log ever
        }
        
        if (user.streaks >= 7 && !userBadges.includes('7-Day Streak')) newBadges.push('7-Day Streak');
        if (user.streaks >= 30 && !userBadges.includes('30-Day Streak')) newBadges.push('30-Day Streak');
      }
      
      user.lastActive = new Date();
      user.badges = [...userBadges, ...newBadges];
      
      await user.save();
      return { pointsAdded: pointsToAdd, newBadges, currentPoints: user.points, currentStreak: user.streaks };
    } catch (error) {
      console.error('Gamification tracking error', error);
      return null;
    }
  }
}

module.exports = new GamificationService();
