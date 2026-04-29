const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');
const router = express.Router();

// Get all users (admin)
router.get('/', auth, authorize('admin'), async (req, res) => {
  try {
    const { role, status } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (status) filter.status = status;
    
    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user (admin)
router.put('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const { role, status, assignedDoctor } = req.body;
    const updateData = {};
    if (role) updateData.role = role;
    if (status) updateData.status = status;
    if (assignedDoctor) updateData.assignedDoctor = assignedDoctor;

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');

    // If assigning a doctor, also update the doctor's assignedPatients
    if (assignedDoctor) {
      await User.findByIdAndUpdate(assignedDoctor, {
        $addToSet: { assignedPatients: req.params.id }
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get doctors list
router.get('/doctors', auth, async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor', status: 'active' })
      .select('name email specialization avatar assignedPatients');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get patients assigned to doctor
router.get('/patients', auth, async (req, res) => {
  try {
    // Get all users with role 'patient'
    const patients = await User.find({ role: 'patient' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user profile
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('assignedDoctor', 'name email specialization')
      .populate('assignedPatients', 'name email');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add trusted contact
router.post('/trusted-contacts', auth, async (req, res) => {
  try {
    const { name, email, phone, relation, consentGiven } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    user.trustedContacts.push({ name, email, phone, relation, consentGiven });
    await user.save();
    
    res.status(201).json(user.trustedContacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update trusted contact consent
router.put('/trusted-contacts/:contactId/consent', auth, async (req, res) => {
  try {
    const { consentGiven } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const contact = user.trustedContacts.id(req.params.contactId);
    if (!contact) return res.status(404).json({ error: 'Contact not found' });
    
    contact.consentGiven = consentGiven;
    await user.save();
    
    res.json(user.trustedContacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove trusted contact
router.delete('/trusted-contacts/:contactId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    user.trustedContacts = user.trustedContacts.filter(
      (c) => c._id.toString() !== req.params.contactId
    );
    await user.save();
    
    res.json(user.trustedContacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Award activity badge
router.post('/activity-badge', auth, async (req, res) => {
  try {
    const { activityType, activityName } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // Define badge details based on activity type
    const badgeDetails = {
      meditation: { name: 'Mindful Meditator', icon: '🧘', color: 'purple', description: 'Completed a meditation session' },
      walk: { name: 'Active Walker', icon: '🚶', color: 'orange', description: 'Completed a walking session' },
      music: { name: 'Music Lover', icon: '🎵', color: 'blue', description: 'Listened to calming music' },
      journal: { name: 'Gratitude Writer', icon: '📝', color: 'green', description: 'Wrote a gratitude journal entry' }
    };
    
    const badge = badgeDetails[activityType];
    if (!badge) return res.status(400).json({ error: 'Invalid activity type' });
    
    // Check if user already has this badge
    const hasBadge = user.badges?.some(b => b.name === badge.name);
    if (hasBadge) {
      return res.json({ message: 'Badge already awarded', badge, alreadyHad: true });
    }
    
    // Add badge to user
    if (!user.badges) user.badges = [];
    user.badges.push({
      name: badge.name,
      icon: badge.icon,
      color: badge.color,
      description: badge.description,
      awardedAt: new Date()
    });
    
    // Add points for completing activity
    user.points = (user.points || 0) + 50;
    
    await user.save();
    
    res.status(201).json({ 
      message: 'Badge awarded successfully!', 
      badge,
      points: user.points,
      alreadyHad: false 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
