import { Router } from 'express';
import {
  editUser,
  getUserData,
  getUserProfileComments,
  getUserProfilePosts,
  getUserProfileSaved,
  signUp,
} from '../controllers/user.controllers';
import { body, check } from 'express-validator';
import { verifyJwt } from '../middlewares/auth.middleware';

const router = Router();
router.post('/sign-up', signUp);

router.get('/get/:username', verifyJwt, getUserData);
router.get('/posts/:username', verifyJwt, getUserProfilePosts);
router.get('/saved/:username', verifyJwt, getUserProfileSaved);
router.get('/comments/:username', verifyJwt, getUserProfileComments);
router.post('/:editUser', verifyJwt, editUser);

export default router;
