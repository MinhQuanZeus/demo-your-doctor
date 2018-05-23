import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { VideoCallServices } from 'meteor/elmarti:video-chat';
import { Layout, Icon, Modal, Row, Col, Card } from 'antd';
const { Content } = Layout;
import { Header, Footer } from '../';
import { CallUsers } from '../../users';
const confirm = Modal.confirm;
const error = Modal.error;
const info = Modal.info;

class Wrapper extends React.Component {
    constructor() {
        super();
        VideoCallServices.init({
            iceServers: [
                { url: 'stun:stun.l.google.com:19302' }
            ]
        });
        VideoCallServices.setOnError((err, data) => {
            switch (err.name) {
                case "NotFoundError":
                    error({
                        title: "Could not find webcam",
                        content: "Please ensure a webcam is connected",
                        okText: "OK"
                    });
                    VideoCallServices.endCall();
                    break;
                case "NotAllowedError":
                    error({
                        title: "Not allowed error",
                        content: "Could not access media device",
                        okText: "OK"
                    });
                    VideoCallServices.endCall();
                    break;
                case "NotReadableError":
                    error({
                        title: "Hardware error",
                        content: "Could not access your device.",
                        okText: "OK"
                    });
                    VideoCallServices.endCall();
                    break;
                case "SecurityError":
                    error({
                        title: "Security error",
                        content: "Media support is disabled in this browser.",
                        okText: "OK"
                    });
                    VideoCallServices.endCall();
                    break;
                default:
                    console.log(err, data);
            }
        });
        VideoCallServices.onReceiveCall = (_id) => {
            this.setState({
                showChat: _id
            });
            const { caller, target } = this.refs;
            confirm({
                title: 'You are receiving a call',
                onOk() {
                    VideoCallServices.answerCall({
                        localElement: caller,
                        remoteElement: target,
                        audio: true,
                        video: true
                    });
                },
                okText: "Answer",
                cancelText: "Ignore",
                onCancel() {
                    VideoCallServices.rejectCall();
                },
            });
        };
        VideoCallServices.onTerminateCall = () => {
            Modal.info({
                title: "Call ended",
                okText: "OK"
            });
            this.setState({
                showChat: false
            });
        };
        VideoCallServices.onCallRejected = () => {
          Modal.error({
              title: "Call rejected",
              okText: "OK"
          })  
        };
        this.state = {
            showChat: false
        };
    }

    callUser(showChat) {
        const user = Meteor.users.findOne({
            _id: showChat
        });
        if (!user || !user.status.online)
            throw new Meteor.Error(500, "user offline");
        this.setState({
            showChat
        });
        VideoCallServices.call({
            id: showChat,
            localElement: this.refs.caller,
            remoteElement: this.refs.target,
            audio: true,
            video: true
        });
    }
    render() {
        const { WrapperContent } = this.props;

        return (<Layout className="layout">
            <Header/>
            <Content style={{ padding: '0 50px' }}>
                <Row style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                    <Col span="11">
                        <CallUsers callUser={this.callUser.bind(this)}/>
                    </Col>
                    <Col span="2"></Col>

                </Row>
            </Content>
        <Footer/>
            <video ref="caller"/>
            <video ref="target"/>
        </Layout>);
    }
}
export default withTracker(() => {
    if (!(Meteor.loggingIn() || Meteor.user()))
        FlowRouter.go("/login");
    return {

    };
})(Wrapper);
