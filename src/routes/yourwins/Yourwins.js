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
import s from './Yourwins.css';
import { graphql, compose } from 'react-apollo';
import yourwinsQuery from './yourwinsQuery.graphql';
import { Alert,Button,Panel,Accordion,Modal,FormGroup,FormControl,ControlLabel,HelpBlock,InputGroup,Image,Glyphicon,DropdownButton,MenuItem } from 'react-bootstrap';
import { connect } from 'react-redux';
// import { reqForMyBooks, confirmReqForMyBooks } from '../../actions/book';

class Yourwins extends React.Component {

  constructor(...args) {
	super(...args);
	const { wins } = this.props.data;
    this.state = { wins: wins, showModal: false, imgurl: null };
  };

  static propTypes = {
	  wins: PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
		owner: PropTypes.string.isRequired,
		img: PropTypes.string,
		like: PropTypes.string,
		notlike: PropTypes.string,
	  })).isRequired,
  };
    
  render() {
    let open = () => this.setState({ showModal: true});
    let close = () => this.setState({ showModal: false});
    let handleChange = (e) => this.setState({ imgurl: e.target.value });
    let addWin = () => {};

    const formInstance = (
      <form>
        <FormGroup
          controlId="formBasicText"
        >
          <ControlLabel>Title</ControlLabel>
          <FormControl
            type="text"
            placeholder="Enter title"
          />
        </FormGroup>
        <FormGroup
          controlId="formBasicText"
        >
          <ControlLabel>Image Url</ControlLabel>
          <FormControl
            type="text"
            placeholder="Enter image url"
            onChange={handleChange}
          />
        </FormGroup>
      </form>
    );

    return (
	   <div className={s.root}>
        <div className={s.container}>
          <h1>Your Wins</h1>
          <Button bsStyle="primary" bsSize="large" onClick={open}>Add a Win</Button>  
          {this.state.wins.map(item => (
            <article className={s.newsItem}>
              <h1 className={s.newsTitle}><a href={item.img}>{item.title}</a></h1>              
            </article>
          ))}
          <Modal
            show={this.state.showModal}
            onHide={close}
            container={this}
            aria-labelledby="contained-modal-title"
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title">Add a Win</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Image src={this.state.imgurl} responsive rounded />
              { formInstance }
            </Modal.Body>
            <Modal.Footer>
              <Button bsStyle="primary" onClick={addWin}>Submit</Button>
              <Button onClick={close}>Close</Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  }
}

const mapDispatch = () => {
  
}
export default compose(
  withStyles(s),
  graphql(yourwinsQuery),
  connect(false,mapDispatch),
)(Yourwins);

