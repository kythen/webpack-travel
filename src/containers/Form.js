/**
 * @file 新建编辑算法
 * @author （）
 */

import React from 'react';
import SparkMD5 from 'spark-md5';
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
        this.chunkSize = 2 * 1024 * 1024;
    }


    hasFile = file => {
        console.log(this);
        return new Promise((resolve, reject) => {
            const chunks = Math.ceil(file.size / this.chunkSize);
            let currentChunk = 0;
            const spark = new SparkMD5.ArrayBuffer();
            const fileReader = new FileReader();
            const loadNext = () => {
                const start = this.chunkSize * currentChunk;
                const end = Math.min(file.size, start + this.chunkSize);
                fileReader.readAsArrayBuffer(file.slice(start, end));
            }
            fileReader.onload = e => {
                spark.append(e.target.result);
                currentChunk ++;
                if (currentChunk < chunks) {
                    loadNext();
                } else {
                    console.log('finish loading');
                    const result = spark.end();
                    const sparkMD5  = new SparkMD5();
                    sparkMD5.append(result);
                    sparkMD5.append(file.name);
                    const hexHash = sparkMD5.end();
                    resolve(hexHash);
                }
            }
            fileReader.onerror = () => {
                console.warn('文件读取失败');
            }
            loadNext();
        })
    }

    handleSubmit = (e, isSave) => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                this.setState({loading: true});
                const {fileList} = this.state;
                const {name} = values;
                console.log(fileList[0]);
                const file = fileList[0];
                const promiseList = [];
                const chunkSize = 4 * 1024 * 1024;
                const chunkCount = Math.ceil(file.size / chunkSize);
                const hash = await this.hasFile(file);
                const reqList = [];
                for (let i = 0; i < chunkCount; i++) {
                    reqList[i] = {};
                    const start = i * chunkSize;
                    const end = Math.min(file.size, start + chunkSize);
                    const formData = new FormData();
                    formData.append('file', file.slice(start, end));
                    formData.append('name', file.name);
                    formData.append('total', chunkCount);
                    formData.append('size', file.size);
                    formData.append('index', i);
                    formData.append('hash', hash);
                    promiseList.push(callApi('post', `${prefix}/upload`, '', formData, reqList[i]));
                }
                Promise.all(promiseList).then(res => {
                    console.log(res);
                    this.setState({loading: false});
                    const data = {
                        size: file.size,
                        name: file.name,
                        total: chunkCount,
                        hash
                    };
                    callApi('post', `${prefix}/merge_chunks`, '', data).then(res => {
                        alert('上传成功');
                    })
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
