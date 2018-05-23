import React from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { withTracker } from 'meteor/react-meteor-data';
const pStyle = {
    width: '25%',
    marginTop: '20px',
    alignContent: 'center',
    padding: '10px',
    marginLeft: '40%'
};


export default class Component extends React.Component {
    constructor() {
        super();
        this.state = {
            newUser: false
        };
    }


    render() {
        const { WrapperContent } = this.props;
        return (
            <div className="card text-center" style={pStyle}>
                <div>
                    <img width="200px" height="200px" src="https://cdn.psychologytoday.com/sites/default/files/styles/article-inline-half/public/blogs/56377/2014/02/143686-169772.jpg?itok=LCuZ8NFy"/>
                </div>
                <div style={{marginTop: '10px'}}>
                    <WrapperContent/>
                </div>
            </div>
        );
    }
}

const Container =  withTracker(() => {
    const loggedIn =  Meteor.user();
    if (loggedIn)
        FlowRouter.go("/");
    return {};
})(Component);

export {
    Container, Component
}