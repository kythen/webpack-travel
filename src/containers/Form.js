/**
 * @file 新建编辑算法
 * @author （）
 */

import React from 'react';
import {Breadcrumb, Button, Col, Form, Input, message, Radio, Row, Select, Upload} from 'antd';
import {config, prefix} from '../utils/config';
import {callApi} from '../utils/fetchApi';
import './style.less';

const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 12}
};
const formTailLayout = {
    wrapperCol: {span: 12, offset: 6}
};
const algPattern = /^[-a-zA-Z0-9_]{1,30}$/;

class AddAlgorithm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList: [],
            loading: false
        };
        this.handleMarkdownChange = this.handleMarkdownChange.bind(this);
    }

    handleSubmit = (e, isSave) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const {fileList} = this.state;
                const {name} = values;
                const formData = new FormData();
                fileList.forEach(file => {
                    formData.append('pluginFile', file);
                });
                const algorithm = {
                    algorithmName: name,
                    description: this.state.markdownSrc
                };
                this.setState({loading: true});
         
                formData.append(
                    'algorithm',
                    new Blob([JSON.stringify(algorithm)], {
                        type: 'application/json'
                    })
                );
                callApi('post', `${prefix}/algorithm`, '', formData).then(res => {
                    this.setState({loading: false});
                });
            }
        });
    };

    normFile = e => {
        if (Array.isArray(e)) {
            return e;
        }
        const file = e && e.fileList.slice(-1);
        return file;
    };


    handleMarkdownChange(editor) {
        this.setState({markdownSrc: editor.getValue()});
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {
            fileList,
            loading
        } = this.state;
        return (
            <div>
                   <article>
                        <Form onSubmit={this.handleSubmit}>
                            <section>
                                <div className="content">
                                    <Form.Item {...formItemLayout} label="名称">
                                        {getFieldDecorator('name', {
                                            initialValue: '',
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '名称必填'
                                                },
                                                {
                                                    pattern: algPattern,
                                                    message: '仅支持30个字以内的字母、数字、中划线、下划线'
                                                },
                                                {
                                                    validator: this.algNameRepeat
                                                }
                                            ]
                                        })(
                                            <Input
                                                size="large"
                                                placeholder="仅支持30个字以内的字母、数字、中划线、下划线"
                                            />
                                        )}
                                    </Form.Item>
                              
                                </div>
                            </section>
                            <section>

                                <div className="content">
                                    <Form.Item
                                        {...formItemLayout}
                                        label= "上传文件"
                                    >
                                        {getFieldDecorator('upload', {
                                            valuePropName: 'fileList',
                                            initialValue: fileList,
                                            getValueFromEvent: this.normFile,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请上传程序包'
                                                }
                                            ]
                                        })(
                                            <Upload
                                                name="logo"
                                                listType="text"
                                                beforeUpload={file => {
                                                    this.setState(state => ({
                                                        fileList: [file],
                                                        isChanged: true
                                                    }));
                                                    return false;
                                                }}
                                            >
                                                <Button>选择文件</Button>
                                            </Upload>
                                        )}
                                    </Form.Item>
                                
                                </div>
                            </section>
                            <Form.Item {...formTailLayout}>
                                <Button
                                    className={'mar-r10'}
                                    type="default"
                                    onClick={e => {
                                    }}
                                >
                                    取消
                                </Button>
                                <Button
                                    style={{marginLeft: '20px'}}
                                    type="default"
                                    loading={loading}
                                    onClick={e => this.handleSubmit(e, true)}
                                >
                                    保存
                                </Button>
                               
                            </Form.Item>
                        </Form>
                </article>
            </div>
        );
    }
}
export default Form.create({name: 'addAlg'})(AddAlgorithm);
