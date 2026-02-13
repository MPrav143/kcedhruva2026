const express = require('express');
const router = express.Router();
const Pass = require('../models/Pass');
const { protect, admin } = require('../middlewares/authMiddleware');

// @desc    Get all passes
// @route   GET /api/passes
// @access  Public
router.get('/', async (req, res) => {
    try {
        const passes = await Pass.find({});
        res.json(passes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create a pass
// @route   POST /api/passes
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    try {
        const pass = new Pass(req.body);
        const createdPass = await pass.save();
        res.status(201).json(createdPass);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Update a pass
// @route   PUT /api/passes/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const { name, price, type, perks, color, isActive } = req.body;
        const pass = await Pass.findById(req.params.id);

        if (pass) {
            pass.name = name || pass.name;
            pass.price = price || pass.price;
            pass.type = type || pass.type;
            pass.perks = perks || pass.perks;
            pass.color = color || pass.color;
            pass.isActive = isActive !== undefined ? isActive : pass.isActive;

            const updatedPass = await pass.save();
            res.json(updatedPass);
        } else {
            res.status(404).json({ message: 'Pass not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Delete a pass
// @route   DELETE /api/passes/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const pass = await Pass.findById(req.params.id);

        if (pass) {
            await pass.deleteOne();
            res.json({ message: 'Pass removed' });
        } else {
            res.status(404).json({ message: 'Pass not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
