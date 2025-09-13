const Tenant = require('../models/Tenant');

// @desc    Upgrade tenant plan to PRO
// @route   POST /api/tenants/:slug/upgrade
exports.upgradeTenant = async (req, res) => {
    try {
        const tenant = await Tenant.findById(req.user.tenantId);

        // Security check: ensure the slug matches the user's tenant
        if (!tenant || tenant.slug !== req.params.slug) {
            return res.status(403).json({ message: "Forbidden action" });
        }

        tenant.plan = 'PRO';
        await tenant.save();
        res.json({ message: `Tenant ${tenant.name} upgraded to PRO plan.` });
    } catch (error) {
        res.status(500).json({ message: 'Server error upgrading tenant' });
    }
};