import React from 'react'
import Stampery from 'stampery';
import { Modal } from 'antd'
import Certificate from '../components/certificate'
const stampery = new Stampery('abad3702-839f-4e60-a8a4-6456a27f0cad');

export const validate = hash => {
    return stampery.getByHash(hash)
        .then((stampList) => {
            const stamp = stampList[0];
            const isVerified = (stamp === undefined) ? false : stampery.prove(stamp.receipts);
            return [isVerified, stamp];
        });
}

export const displayValidationModal = (isVerified, stampList) => {
  if (isVerified) {
    Modal.success({
      title: 'El documento se encuentra en la Blockchain.',
      content: (
        <div>
          <p>Hemos encontrado el hash de tu documento en la Blockchain.</p>
          <Certificate {...stampList} />
        </div>
      ),
      width: '90%',
    });
  } else {
    Modal.error({
      title: 'El documento no se encuentra en la Blockchain.',
      content: 'Tenga en cuenta que el proceso de sellado en la Blockchain no es inmediato, necesitaremos un plazo de tiempo para su estampación.',
    });
  }
}
