const express = require('express');
const domainsRouter = require('./domains');
const auth = require('./auth');

const router = express.Router();

router.use('/domains', domainsRouter);
router.use('/auth', auth);

module.exports = router;
