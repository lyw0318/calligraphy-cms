/* eslint-disable no-script-url */
import React, { Fragment, PureComponent } from 'react';
import copy from 'copy-to-clipboard';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Switch,
  Button,
  Table,
  InputNumber,
  Divider,
  Modal,
  message,
} from 'antd';
// import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './TableList.less';

const FormItem = Form.Item;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ coursenode, loading }) => ({
  coursenode,
  loading: loading.models.coursenode,
}))
@Form.create()
class HomeworkList extends PureComponent {
  state = {
    modalVisible: false,
  };

  columns = [
    {
      title: '课程种类',
      dataIndex: 'gid',
      render: val => {
        const statusObj = {
          1: '体验课',
          2: '系统课',
        };
        return `${statusObj[val]}`;
      },
    },
    {
      title: '序号',
      dataIndex: 'seq',
    },
    {
      title: '课程',
      dataIndex: 'title',
    },
    {
      title: '课程类型',
      dataIndex: 'type',
      render: val => {
        const statusObj = {
          1: '字',
          2: '闯关小能手',
          3: '重点笔画',
        };
        return `${statusObj[val]}`;
      },
    },
    {
      title: '内容',
      dataIndex: 'writing',
    },
    {
      title: '操作',
      render: record => (
        <Fragment>
          <a href="javascript:;" onClick={() => this.handleModalVisible(true, record)}>
            修改
          </a>
          <Divider type="vertical" />
          <a href="javascript:;" onClick={() => this.handleCopy(record.id)}>
            预览
          </a>
          <Divider type="vertical" />
          {record.canDel && (
            <a href="javascript:;" onClick={() => this.handleDelete(record)}>
              删除
            </a>
          )}
        </Fragment>
      ),
    },
  ];

  CreateForm = Form.create()(props => {
    const { modalVisible, form, handleAdd, handleModalVisible, choose, groupSeq } = props;

    console.log(props);
    console.log('choose::;', choose);
    console.log('groupSeq::;', groupSeq);
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        handleAdd(fieldsValue);
      });
    };
    const changeHandle = () => {
      const groupId = form.getFieldValue('groupId');
      console.log('groupId:::', groupId);
      // groupSeq[groupId]
    };
    return (
      <Modal
        destroyOnClose
        title="修改课程"
        visible={modalVisible}
        onOk={okHandle}
        onCancel={() => handleModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="科目">
          {form.getFieldDecorator('groupId', {
            initialValue: (choose && choose.gid && choose.gid.toString()) || '2',
          })(
            <Select placeholder="请选择" disabled={choose && choose.gid && choose.gid.toString()}>
              <Option value="1">体验课</Option>
              <Option value="2">系统课</Option>
            </Select>
          )}
        </FormItem>

        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="序号">
          {form.getFieldDecorator('seq', {
            initialValue: (choose && choose.seq) || groupSeq[form.getFieldValue('groupId')] + 1,
            rules: [{ required: true, message: '请输入序号！' }],
          })(<InputNumber disabled />)}
        </FormItem>

        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="课程类型">
          {form.getFieldDecorator('type', {
            initialValue: (choose && choose.type && choose.type.toString()) || '1',
          })(
            <Select placeholder="请选择">
              <Option value="1">字</Option>
              <Option value="2">闯关小能手</Option>
              <Option value="3">重点笔画</Option>
            </Select>
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="课程内容">
          {form.getFieldDecorator('writing', {
            initialValue: choose && choose.writing && choose.writing.toString(),
            rules: [{ required: true, message: '请输入至少1个字符！', min: 1 }],
          })(<Input placeholder="请输入" />)}
        </FormItem>

        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="自动视频地址">
          {form.getFieldDecorator('autoUrl', {})(
            <Switch defaultChecked={false} onChange={changeHandle} />
          )}
        </FormItem>

        {!form.getFieldValue('autoUrl') && (
          <Fragment>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="视频链接">
              {form.getFieldDecorator('srcUrl', {
                initialValue: choose && choose.srcUrl && choose.srcUrl.toString(),
                rules: [{ required: true }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="示范视频">
              {form.getFieldDecorator('exampleUrl', {
                initialValue: choose && choose.exampleUrl && choose.exampleUrl.toString(),
                rules: [{ required: true }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Fragment>
        )}

        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="自动gif地址">
          {form.getFieldDecorator('autoGif', {})(
            <Switch defaultChecked={false} onChange={changeHandle} />
          )}
        </FormItem>
        {!form.getFieldValue('autoGif') && (
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="gif链接">
            {form.getFieldDecorator('gifUrl', {
              initialValue: choose && choose.gifUrl && choose.gifUrl.toString(),
              rules: [{ required: false }],
            })(<Input placeholder="请输入" />)}
          </FormItem>
        )}
      </Modal>
    );
  });

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'coursenode/fetch',
    });
  }

  handleFormReset = () => {
    // 重置查询条件
    const { form } = this.props;
    form.resetFields();
  };

  // handleSelectRows = rows => {
  //   this.setState({
  //     selectedRows: rows,
  //   });
  // };

  handleSearch = e => {
    // 点击查询
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      window.console.log('xxxxx', values);
      dispatch({
        type: 'coursenode/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = (flag, courseNode) => {
    console.log(courseNode);
    const { dispatch } = this.props;
    dispatch({
      type: 'coursenode/choose',
      payload: {
        choose: courseNode,
      },
    });
    console.log(this.props);

    this.setState({
      modalVisible: !!flag,
    });
  };

  handleCopy = fields => {
    console.log('handleCopy::', fields);
    copy(`http://svrwx.snyjjy.cn/mycourseDetail/${fields}`);
    message.success('地址已复制，请在微信预览');
  };

  handleDelete = fields => {
    const { dispatch } = this.props;
    console.log('handleDelete::', fields);
    dispatch({
      type: 'coursenode/update',
      payload: {
        id: fields.id,
        isDel: true,
      },
    });
    message.success('删除成功');
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    console.log('handleAdd::', fields);
    dispatch({
      type: 'coursenode/update',
      payload: {
        ...fields,
        id: fields.id,
        writing: fields.writing,
        gid: fields.groupId,
        issue: fields.issue,
        seq: fields.seq,
        srcUrl: fields.srcUrl,
        exampleUrl: fields.exampleUrl,
        type: fields.type,
        autoUrl: fields.autoUrl,
        autoGif: fields.autoGif,
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
  };

  renderAdvancedForm() {
    // 查询条件
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="课程类型">
              {getFieldDecorator('groupId')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="1">体验课</Option>
                  <Option value="2">系统课</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="序号">
              {getFieldDecorator('seq')(<InputNumber style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={() => this.handleModalVisible(true, null)}>
              新增
            </Button>
          </div>
        </div>
      </Form>
    );
  }

  render() {
    const {
      coursenode: { list, count, choose, groupSeq },
      loading,
    } = this.props;
    const { modalVisible } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    const { CreateForm } = this;

    return (
      <PageHeaderWrapper title="查询表格">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderAdvancedForm()}</div>
            <Table
              rowKey="cOrderNo"
              loading={loading}
              dataSource={list}
              columns={this.columns}
              title={() => `总数: ${count}`}
            />
          </div>
        </Card>
        <CreateForm
          {...parentMethods}
          modalVisible={modalVisible}
          choose={choose}
          groupSeq={groupSeq}
        />
      </PageHeaderWrapper>
    );
  }
}

export default HomeworkList;
