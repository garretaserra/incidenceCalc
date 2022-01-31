import express = require('express');
import testScripts from '../controllers/testScripts';


let router: express.Router = express.Router();

router.get('/get', testScripts.test);

router.post('/post', testScripts.test);

module.exports = router;
