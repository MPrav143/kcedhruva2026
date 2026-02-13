const express = require('express');
const router = express.Router();
const Sponsor = require('../models/Sponsor');
const Club = require('../models/Club');
const PastEvent = require('../models/PastEvent');
const SiteConfig = require('../models/SiteConfig');
const { protect, admin } = require('../middlewares/authMiddleware');

// --- PAST EVENTS ---

router.get('/pastEvents', async (req, res) => {
    try {
        const events = await PastEvent.find({});
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/pastEvents', protect, admin, async (req, res) => {
    try {
        const event = await PastEvent.create(req.body);
        res.status(201).json(event);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put('/pastEvents/:id', protect, admin, async (req, res) => {
    try {
        const event = await PastEvent.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json(event);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/pastEvents/:id', protect, admin, async (req, res) => {
    try {
        const event = await PastEvent.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        await event.deleteOne();
        res.json({ message: 'Event removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- SPONSORS ---

router.get('/sponsors', async (req, res) => {
    try {
        const sponsors = await Sponsor.find({});
        res.json(sponsors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/sponsors', protect, admin, async (req, res) => {
    try {
        const sponsor = await Sponsor.create(req.body);
        res.status(201).json(sponsor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put('/sponsors/:id', protect, admin, async (req, res) => {
    try {
        const sponsor = await Sponsor.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!sponsor) return res.status(404).json({ message: 'Sponsor not found' });
        res.json(sponsor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/sponsors/:id', protect, admin, async (req, res) => {
    try {
        const sponsor = await Sponsor.findById(req.params.id);
        if (!sponsor) return res.status(404).json({ message: 'Sponsor not found' });
        await sponsor.deleteOne();
        res.json({ message: 'Sponsor removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- CLUBS ---

router.get('/clubs', async (req, res) => {
    try {
        const clubs = await Club.find({});
        res.json(clubs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/clubs', protect, admin, async (req, res) => {
    try {
        const club = await Club.create(req.body);
        res.status(201).json(club);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put('/clubs/:id', protect, admin, async (req, res) => {
    try {
        const club = await Club.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!club) return res.status(404).json({ message: 'Club not found' });
        res.json(club);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/clubs/:id', protect, admin, async (req, res) => {
    try {
        const club = await Club.findById(req.params.id);
        if (!club) return res.status(404).json({ message: 'Club not found' });
        await club.deleteOne();
        res.json({ message: 'Club removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- SITE CONFIG (RULES & CONTACT) ---

router.post('/config', protect, admin, async (req, res) => {
    try {
        const { key, value } = req.body;
        const config = await SiteConfig.findOneAndUpdate(
            { key },
            { value, type: req.body.type || 'text' },
            { new: true, upsert: true }
        );
        res.json(config);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// SiteConfig GET is already handled in uploadRoutes but we can direct fetch here if needed
// For simplicity, we stick to the one in uploadRoutes for getting all configs

module.exports = router;
