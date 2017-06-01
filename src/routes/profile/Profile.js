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
import { FormGroup, ControlLabel,HelpBlock,FormControl  } from 'react-bootstrap';
import FileUpload from 'react-fileupload';


class Profile extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  render() {
	
	const options={
        baseUrl:'./upload',
        param:{

        }
    }
	
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
        <form>
          <FieldGroup
            id="formControlsFile"
            type="file"
            label="File"
            help="upload your avatar."
          />
        </form>
        )

    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>{this.props.title}</h1>
          {formInstance}
		  <FileUpload options={options}>
            <button ref="chooseBtn">choose</button>
            <button ref="uploadBtn">upload</button>
		  </FileUpload>
          <p>{this.props.username}</p>
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
