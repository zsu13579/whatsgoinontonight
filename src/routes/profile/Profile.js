/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Profile.css';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { FormGroup, Button, ControlLabel,HelpBlock,FormControl  } from 'react-bootstrap'
import Upload from 'rc-upload';

class Profile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      imgAvatar: "/uploads/default.png",uploadReady:0
    };
  }

  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  handleUpload = (filename) =>{
    console.log(filename);
    if(this.state.uploadReady==1)
    {
      this.setState({imgAvatar: "/uploads/"+filename, uploadReady: 0});
    }
  }

  render() {

    const uploaderProps = {
      action: '/profile',
      name: 'avatar',
      multiple: true,
      supportServerRender: true,

      beforeUpload(file) {
        console.log('beforeUpload', file.name);
      },
      onStart: (file) => {
        console.log('onStart', file.name);
        // this.refs.inner.abort(file);
      },
      onSuccess: (file) => {
        console.log('onSuccess', file);
        setTimeout(function(){this.handleUpload(file.filename);},2000)
        
      },
      onProgress: (step, file) => {
        console.log('onProgress', Math.round(step.percent), file.name);
      },
      onReady: () => {
        this.setState({uploadReady : 1});
      },
      onError(err) {
        console.log('onError', err);
      },
    };

    function FieldGroup({ id, label, help, ...props }) {
      return (
        <FormGroup controlId={id}>
          <ControlLabel>{label}</ControlLabel>
          <FormControl {...props} />
          {help && <HelpBlock>{help}</HelpBlock>}
        </FormGroup>
      );
    }

    const formInstance = (
        <form action="/profile" method="post" encType="multipart/form-data">
          <FieldGroup
            id="formControlsFile"
            type="file"
            label="File"
            help="upload your avatar."
            name="avatar1"
          />
          <Button type="submit">Submit</Button>
        </form>
        )

    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>{this.props.title}</h1>
          <img src={this.state.imgAvatar} />
          {formInstance}
          <div>
            <Upload {...uploaderProps} ref="inner"><a>开始上传</a></Upload>
          </div>
          <p>{this.props.username}{this.state.imgAvatar}</p>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  if (state.user){
    return {username: state.user.email}
  }
  return {}
}

export default compose(
  withStyles(s),
  connect(mapStateToProps),
  )(Profile);
