import express from 'express';
import domainsRouter from './domains';
import auth from './auth';


const router = express.Router();

router.use('/domains', domainsRouter);
router.use('/auth', auth);


export default router;
