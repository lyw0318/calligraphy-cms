import { Upload, message, Button, Icon, Form } from 'antd';
import React, { PureComponent } from 'react';

@Form.create()
class ExpressUpload extends PureComponent {
  render() {
    const props = {
      name: 'file',
      action: './calligraphy/manager/express/upload',
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };

    return (
      <Upload {...props}>
        <Button>
          <Icon type="upload" /> Click to Upload
        </Button>
      </Upload>
    );
  }
}

export default ExpressUpload;
