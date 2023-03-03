import express from 'express'
const router = express.Router()
import { createUrl, getUrl }  from '../controller/urlController.js'

router.post('/', createUrl)
router.get('/:urlCode', getUrl)

export default router