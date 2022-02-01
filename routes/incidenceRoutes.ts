import { Router } from 'express';
import incidenceScripts from '../controllers/incidenceScripts';

let router = Router();

router.post('/city', incidenceScripts.addCity);
router.post('/city/:city/incidence/', incidenceScripts.addIncidence);

router.get('/city/:city/incidence/:date', incidenceScripts.getCityDayIncidence);
router.get('/city/:city/incidence/:from/:to', incidenceScripts.getCityRangeIncidence);

router.get('/region/:region/incidence/:date', incidenceScripts.getRegionDayIncidence);
router.get('/region/:region/incidence/:from/:to', incidenceScripts.getRegionRangeIncidence);

export default router;