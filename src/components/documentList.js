import React from 'react';
import { Table, Divider, Button, Popconfirm, Spin, message, Tooltip } from 'antd';
import Amplify, { Storage, API } from 'aws-amplify';
import Moment from 'moment';
import 'moment/locale/es';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import awsExports from '../aws-exports';
Amplify.configure(awsExports);
Storage.configure({ level: 'private' });

const truncate = (fullStr, strLen, separator) => {
  if (fullStr.length <= strLen) return fullStr;
  const xSeparator = separator || '...';
  const sepLen = xSeparator.length;
  const charsToShow = strLen - sepLen;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);

  return fullStr.substr(0, frontChars) +
    xSeparator +
    fullStr.substr(fullStr.length - backChars);
};

const dateFormat = (date) => {
  return Moment(date).utcOffset('+04:00').locale('es').format('DD.MM.YYYY - HH:mm');
};

class DocumentList extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.state = {
      files: [],
      isLoading: true,
      error: false,
    };

    this.getPrivateDocuments = this.getPrivateDocuments.bind(this);
    this.deletePrivateDocument = this.deletePrivateDocument.bind(this);
  }

  componentDidMount() {
    this.getPrivateDocuments()
      .then((files) => {
        this.setState({
          files,
          isLoading: false,
          error: false,
        });
      }).catch(() => this.setState({ error: true }));
  }

  getPrivateDocuments() {
    const state = this.state;
    return API.get('filesCRUD', '/files')
      .then((files) => {
        state.files = files;
        return files;
        /* const stamperyFiles = files.filter((file) => file.stamperyId);
         * const promises = stamperyFiles.map((file) => stampery.getById(file.stamperyId));
         * return Promise.all(promises); */
      })
      .catch((err) => console.error(err));
    /* .then((stamps) => {
     *   console.log(state.files);
     *   console.log(stamps);
     * }); */
  }

  deletePrivateDocument(fileId) {
    this.setState({ isLoading: true });

    return Storage.remove(fileId).then(() => API.del('filesCRUD', `/files/object/${fileId}`))
      .then(() => {
        const files = this.state.files.filter((file) => file.fileId !== fileId);

        this.setState({
          files,
          isLoading: false,
        });
      });
  }

  downloadPrivateDocument(fileId) {
    Storage.get(fileId)
      .then((fileUrl) => { window.location = fileUrl; })
      .catch((err) => console.log(err));
  }

  render() {
    const { isLoading, error, files } = this.state;

    const columns = [{
      title: 'Nombre',
      key: 'name',
      render: (file) => (
        <button onClick={() => this.downloadPrivateDocument(file.fileId)} style={{ color: '#1890ff', textDecoration: 'underline' }}>
          {file.name}
        </button>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    }, {
      title: 'Estampado en',
      dataIndex: 'stampedOn',
      key: 'stampedOn',
      render: (stampedOn) => <span>{dateFormat(stampedOn)}</span>,
      sorter: (a, b) => Moment(a.stampedOn).diff(Moment(b.stampedOn)),
    }, {
      title: 'Hash',
      dataIndex: 'hash',
      key: 'hash',
      render: (hash) => (
        <span>
          {truncate(hash, 20)} &nbsp;
          <CopyToClipboard
            text={hash}
            onCopy={() => { message.success("Hash copiado al portapapeles."); }}
          >
            <Button type="primary" shape="circle" icon="copy" size="small" />
          </CopyToClipboard>
        </span>
      ),
    }, {
      title: 'Acción',
      key: 'action',
      render: (file) => (
        <span>
          <Tooltip title="Descargar sello">
            <Button type="primary" icon="barcode" />
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip title="Descargar documento">
            <Button type="primary" icon="download" onClick={() => this.downloadPrivateDocument(file.fileId)} />
          </Tooltip>
          <Divider type="vertical" />
          <Popconfirm title="Seguro que quieres borrar este fichero?" onConfirm={() => this.deletePrivateDocument(file.fileId)} okText="Si" cancelText="No">
            <Tooltip title="Descargar documento">
              <Button type="danger" icon="delete" />
            </Tooltip>
          </Popconfirm>
        </span>
      ),
    }];

    if (error) {
      return <div>Error</div>;
    }
    if (isLoading) {
      return <Spin size="large" />;
    }

    return (
      <div>
        <Table columns={columns} dataSource={files} pagination={false} rowKey="fileId" />
      </div>
    );
  }
}

DocumentList.propTypes = {
};

export default DocumentList;
