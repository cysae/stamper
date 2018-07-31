import Stampery from 'stampery';
const stampery = new Stampery('abad3702-839f-4e60-a8a4-6456a27f0cad');

export const validate = hash => {
  return stampery.getByHash(hash)
    .then((stampList) => {
      const stamp = stampList[0];
      const isVerified = (stamp === undefined) ? false : stampery.prove(stamp.receipts);
      return [isVerified, stamp];
    });
}

