import express from 'express';
import { getShopLocations, getShopsNearby, getShopDetails } from '../controllers/shopController.js';

const router = express.Router();

router.get('/locations', getShopLocations);
router.get('/nearby', getShopsNearby);
router.get('/:id', getShopDetails);

export default router;