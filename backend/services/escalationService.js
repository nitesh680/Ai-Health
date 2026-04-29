// Escalation Service - Crisis alert system
const User = require('../models/User');

class EscalationService {
  constructor() {
    this.activeAlerts = [];
  }

  async createAlert(userId, sessionId, riskScore, crisisPhrase, io) {
    const alert = {
      id: Date.now().toString(),
      userId,
      sessionId,
      riskScore,
      crisisPhrase,
      status: 'active',
      createdAt: new Date(),
      acknowledgedBy: null,
      acknowledgedAt: null
    };

    this.activeAlerts.push(alert);

    // Emit to admin and doctor rooms
    if (io) {
      io.to('admin-room').emit('crisis-alert', alert);
      io.to(`doctor-${userId}`).emit('crisis-alert', alert);
      io.to('doctors-room').emit('crisis-alert', alert);
    }

    console.log(`🚨 CRISIS ALERT: User ${userId} - Risk Score: ${riskScore} - Phrase: "${crisisPhrase}"`);
    
    // Notify trusted contacts with consent
    this.notifyTrustedContacts(userId, riskScore, crisisPhrase).catch(err => console.error("Error notifying trusted contacts:", err));

    return alert;
  }

  async notifyTrustedContacts(userId, riskScore, crisisPhrase) {
    try {
      const user = await User.findById(userId);
      if (user && user.trustedContacts && user.trustedContacts.length > 0) {
        const consentedContacts = user.trustedContacts.filter(c => c.consentGiven);
        consentedContacts.forEach(contact => {
          // Simulate sending SMS/Email
          console.log(`📞 ALERT TO TRUSTED CONTACT:
          To: ${contact.name} (${contact.phone} / ${contact.email || 'N/A'})
          Message: High distress alert for ${user.name}. Action required. Please check on them.`);
        });
      }
    } catch (error) {
      console.error("Failed to notify trusted contacts", error);
    }
  }

  acknowledgeAlert(alertId, doctorId) {
    const alert = this.activeAlerts.find(a => a.id === alertId);
    if (alert) {
      alert.status = 'acknowledged';
      alert.acknowledgedBy = doctorId;
      alert.acknowledgedAt = new Date();
    }
    return alert;
  }

  resolveAlert(alertId) {
    const alert = this.activeAlerts.find(a => a.id === alertId);
    if (alert) {
      alert.status = 'resolved';
      alert.resolvedAt = new Date();
    }
    return alert;
  }

  getActiveAlerts() {
    return this.activeAlerts.filter(a => a.status === 'active');
  }

  getAllAlerts() {
    return this.activeAlerts;
  }

  getAlertsByUser(userId) {
    return this.activeAlerts.filter(a => a.userId === userId);
  }
}

module.exports = new EscalationService();
