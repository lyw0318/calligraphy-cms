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
import { stringify } from 'qs';
import styles from './TableList.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ CourseProcess, student, loading }) => ({
  student,
  CourseProcess,
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
    //   hide: true,
    // },
    // {
    //   title: '用户id',
    //   dataIndex: 'id',
    //   display: false,
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
      title: '快递单号',
      dataIndex: 'expNo',
    },
    {
      title: '操作',
      render: record => (
        <Fragment>
          <a href="javascript:;" onClick={() => this.handleSign(true)}>
            标注
          </a>
          <Divider type="vertical" />
          <a href="javascript:;" onClick={() => this.handleModalVisible(true, record.id)}>
            详情
          </a>
        </Fragment>
      ),
    },
  ];

  processColumns = [
    // {
    //   title: '订单号',
    //   dataIndex: 'cOrderNo',
    //   render: text => <p>{text}</p>,
    // },
    {
      title: '课程id',
      dataIndex: 'nid',
    },
    {
      title: '进度',
      dataIndex: 'status',
      render: val => {
        const statusObj = {
          1: '已解锁',
          2: '已观看',
          3: '已上交作品',
          4: '已自评',
          5: '点评中',
          6: '老师已点评',
          7: '老师已拒绝',
        };
        return `${statusObj[val]}`;
      },
    },
    // {
    //   title: '开课时间',
    //   dataIndex: 'startTime',
    //   sorter: true,
    //   render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm')}</span>,
    // },
    {
      title: '完成时间',
      dataIndex: 'updateTime',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm')}</span>,
    },
  ];

  CreateProcessPanel = Form.create()(props => {
    const { modalVisible, handleModalVisible } = props;
    const {
      CourseProcess: { list },
      loading,
    } = this.props;
    return (
      <Modal
        destroyOnClose
        title="参课进度"
        visible={modalVisible}
        onOk={() => handleModalVisible()}
        onCancel={() => handleModalVisible()}
      >
        <div className={styles.tableList}>
          <Table rowKey="nid" loading={loading} dataSource={list} columns={this.processColumns} />
        </div>
      </Modal>
    );
  });

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
      window.console.log('xxxxx', values);
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

  handleModalVisible = (flag, userId) => {
    if (userId) {
      const { dispatch } = this.props;
      dispatch({
        type: 'CourseProcess/fetch',
        payload: {
          userId,
        },
      });
    }

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
      form,
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
          <Col md={8} sm={24}>
            <FormItem label="礼盒状态">
              {getFieldDecorator('expStatus')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">未发货</Option>
                  <Option value="1">已发货</Option>
                </Select>
              )}
            </FormItem>
          </Col>
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
            <Button
              style={{ marginLeft: 8 }}
              href={`/calligraphy/manager/excel/course_student?${stringify(form.getFieldsValue())}`}
            >
              导出
            </Button>
          </div>
        </div>
      </Form>
    );
  }

  render() {
    const {
      student: { list, count },
      loading,
    } = this.props;
    const { modalVisible } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const { CreateProcessPanel } = this;

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
        <CreateProcessPanel {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderWrapper>
    );
  }
}

export default StudentList;
