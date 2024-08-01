import { getTrainData } from '../../controllers/trainController';

export default (req, res) => {
  if (req.method === 'GET') {
    return getTrainData(req, res);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
};

  