const Event = require('../models/Event');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (event) {
            res.json(event);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create an event
// @route   POST /api/events
// @access  Private/Admin
const createEvent = async (req, res) => {
    try {
        const { title, description, category, eventType, club, department, date, venue, image, pptTemplateUrl, registrationFee, coordinators, facultyCoordinators, studentCoordinators, artistName, timings, prize, rules, rounds, winnerPrize, runnerPrize, fromTime, toTime } = req.body;

        const event = new Event({
            title,
            description,
            category,
            eventType: eventType || 'Normal',
            club,
            department,
            date,
            venue,
            image,
            pptTemplateUrl,
            registrationFee,
            coordinators,
            facultyCoordinators,
            studentCoordinators,
            artistName,
            timings,
            prize,
            rules,
            rounds,
            winnerPrize,
            runnerPrize,
            fromTime,
            toTime,
            createdBy: req.admin._id
        });

        const createdEvent = await event.save();
        res.status(201).json(createdEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private/Admin
const updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (event) {
            console.log('Update Event Body:', req.body);
            // Check if updating generic fields
            const { title, description, category, eventType, club, department, date, venue, image, pptTemplateUrl, registrationFee, coordinators, facultyCoordinators, studentCoordinators, artistName, timings, prize, rules, rounds, winnerPrize, runnerPrize, fromTime, toTime } = req.body;

            event.title = title || event.title;
            event.description = description || event.description;
            event.category = category || event.category;
            if (eventType) event.eventType = eventType;
            event.club = club || event.club;
            event.department = department || event.department;
            event.date = date || event.date;
            event.venue = venue || event.venue;
            event.image = image || event.image;
            event.pptTemplateUrl = pptTemplateUrl !== undefined ? pptTemplateUrl : event.pptTemplateUrl;
            event.registrationFee = registrationFee !== undefined ? registrationFee : event.registrationFee;
            event.coordinators = coordinators || event.coordinators;
            event.facultyCoordinators = facultyCoordinators || event.facultyCoordinators;
            event.studentCoordinators = studentCoordinators || event.studentCoordinators;
            event.artistName = artistName || event.artistName;
            event.timings = timings || event.timings;
            event.prize = prize || event.prize;
            event.rules = rules || event.rules;
            event.rounds = rounds || event.rounds;
            event.winnerPrize = winnerPrize || event.winnerPrize;
            event.runnerPrize = runnerPrize || event.runnerPrize;
            event.fromTime = fromTime || event.fromTime;
            event.toTime = toTime || event.toTime;

            const updatedEvent = await event.save();
            res.json(updatedEvent);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (event) {
            await event.deleteOne();
            res.json({ message: 'Event removed' });
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
};
