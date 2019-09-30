/* eslint-disable no-script-url */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Button, Table, InputNumber } from 'antd';
// import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { stringify } from 'qs';
import styles from './TableList.less';

const FormItem = Form.Item;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ homework, loading }) => ({
  homework,
  loading: loading.models.homework,
}))
@Form.create()
class HomeworkList extends PureComponent {
  columns = [
    {
      title: '课程',
      dataIndex: 'courseName',
    },
    {
      title: '期数',
      dataIndex: 'issue',
    },
    {
      title: '作品编号',
      dataIndex: 'id',
    },
    {
      title: '作品图片',
      dataIndex: 'homework',
      render: val => {
        return (
          val && (
            <a href={val} target="_blank" rel="noopener noreferrer">
              <img src={val} width="42" height="42" alt="logo" />
            </a>
          )
        );
      },
    },
    {
      title: '作品状态',
      dataIndex: 'status',
      render: val => {
        const statusObj = {
          3: '已上交作品',
          4: '已自评',
          5: '点评中',
          6: '老师已点评',
          7: '老师已拒绝',
        };
        return `${statusObj[val]}`;
      },
    },
    {
      title: '是否上墙',
      dataIndex: 'recommend',
      render: val => {
        return val ? '是' : '-';
      },
    },
    {
      title: '微信昵称',
      dataIndex: 'wxNickname',
    },
    {
      title: '微信头像',
      dataIndex: 'wxIcon',
      render: val => {
        return val && <img src={val} width="42" height="42" alt="logo" />;
      },
    },
    {
      title: '学生姓名',
      dataIndex: 'studentName',
    },
    {
      title: '学生头像',
      dataIndex: 'studentIcon',
      render: val => {
        return val && <img src={val} width="42" height="42" alt="logo" />;
      },
    },
    {
      title: '自评',
      dataIndex: 'selfEvaluation',
      render: val => {
        return (
          val && (
            <a href={val} target="_blank" rel="noopener noreferrer">
              试听
            </a>
          )
        );
      },
    },
    {
      title: '点评老师',
      dataIndex: 'teacherName',
    },
    {
      title: '点评',
      dataIndex: 'voiceUrl',
      render: val => {
        return (
          val && (
            <a href={val} target="_blank" rel="noopener noreferrer">
              试听
            </a>
          )
        );
      },
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'homework/fetch',
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
        type: 'homework/fetch',
        payload: values,
      });
    });
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
            <FormItem label="作品状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="3">已上交作品</Option>
                  <Option value="4">已自评</Option>
                  <Option value="5">点评中</Option>
                  <Option value="6">老师已点评</Option>
                  <Option value="7">老师已拒绝</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="是否上墙">
              {getFieldDecorator('recommend')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">否</Option>
                  <Option value="1">是</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="点评人">
              {getFieldDecorator('teacherName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="学生姓名">
              {getFieldDecorator('studentName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="微信昵称">
              {getFieldDecorator('wxNickname')(<Input placeholder="请输入" />)}
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
              href={`/calligraphy/manager/excel/homework?${stringify(form.getFieldsValue())}`}
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
      homework: { list, count },
      loading,
    } = this.props;

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
      </PageHeaderWrapper>
    );
  }
}

export default HomeworkList;
