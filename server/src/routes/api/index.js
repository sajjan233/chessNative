import {Router} from 'express'
const api = Router();
import Role from '../../features/role/index.js'

api.post('/role/add',Role.create)
export default api;