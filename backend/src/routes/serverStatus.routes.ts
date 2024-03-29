import { Request, Response, Router } from 'express';

const router = Router();

router.get('/', (re: Request, res: Response) => {
  res.status(200).json({ message: 'Server is up and running!' });
});

export default router;
