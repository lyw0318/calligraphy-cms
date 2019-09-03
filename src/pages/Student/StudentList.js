/* eslint-disable no-script-url */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  Table,
  Divider,
  InputNumber,
  Modal,
  message,
} from 'antd';
// import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './TableList.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="参课进度"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="课程名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入至少五个字符！', min: 5 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="课程期数">
        {form.getFieldDecorator('issue', {
          rules: [{ required: true }],
        })(<InputNumber placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ student, loading }) => ({
  student,
  loading: loading.models.student,
}))
@Form.create()
class StudentList extends PureComponent {
  state = {
    modalVisible: false,
    formValues: {},
  };

  columns = [
    // {
    //   title: '订单号',
    //   dataIndex: 'cOrderNo',
    //   render: text => <p>{text}</p>,
    // },
    {
      title: '课程名',
      dataIndex: 'courseName',
    },
    {
      title: '期数',
      dataIndex: 'issue',
    },
    // {
    //   title: '开课时间',
    //   dataIndex: 'startTime',
    //   sorter: true,
    //   render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm')}</span>,
    // },
    {
      title: '报名时间',
      dataIndex: 'createTime',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm')}</span>,
    },
    {
      title: '微信昵称',
      dataIndex: 'nickname',
    },
    {
      title: '微信头像',
      dataIndex: 'headimgurl',
      render: val => {
        return val && <img src={val} width="42" height="42" alt="logo" />;
      },
    },
    {
      title: '收件人',
      dataIndex: 'name',
    },
    {
      title: '电话',
      dataIndex: 'phone',
    },
    {
      title: '地址',
      dataIndex: 'address',
      render: val => {
        if (val) {
          return `${JSON.parse(val).city.toString()} ${JSON.parse(val).address.toString()}`;
        }
        return val;
      },
    },
    {
      title: '操作',
      render: () => (
        <Fragment>
          <a href="javascript:;" onClick={() => this.handleSign(true)}>
            标注
          </a>
          <Divider type="vertical" />
          <a href="javascript:;" onClick={() => this.handleModalVisible(true)}>
            详情
          </a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'student/fetch',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'student/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    // 重置查询条件
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'student/fetch',
      payload: {},
    });
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

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'student/fetch',
        payload: values,
      });
    });
  };

  handleSign = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'student/add',
      payload: {
        desc: fields.desc,
      },
    });

    message.success('标注成功');
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'student/add',
      payload: {
        desc: fields.desc,
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    dispatch({
      type: 'student/update',
      payload: {
        query: formValues,
        body: {
          name: fields.name,
          desc: fields.desc,
          key: fields.key,
        },
      },
    });

    message.success('配置成功');
    this.handleUpdateModalVisible();
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
            <FormItem label="期数">
              {getFieldDecorator('issue')(<InputNumber style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          {/* <Col md={8} sm={24}>
            <FormItem label="课程状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">预约</Option>
                  <Option value="1">报名中</Option>
                  <Option value="2">准备中</Option>
                  <Option value="3">学习中</Option>
                  <Option value="4">已结课</Option>
                </Select>
              )}
            </FormItem>
          </Col>  */}
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="微信昵称">
              {getFieldDecorator('nickname')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="手机号">
              {getFieldDecorator('phone')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="订单号">
              {getFieldDecorator('cOrderNo')(<Input placeholder="请输入" />)}
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
          </div>
        </div>
      </Form>
    );
  }

  render() {
    const {
      student: { list },
      loading,
    } = this.props;
    const { modalVisible } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <PageHeaderWrapper title="查询表格">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderAdvancedForm()}</div>
            <Table rowKey="cOrderNo" loading={loading} dataSource={list} columns={this.columns} />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderWrapper>
    );
  }
}

export default StudentList;
