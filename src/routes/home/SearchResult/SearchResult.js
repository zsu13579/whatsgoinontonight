
import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { graphql, compose } from 'react-apollo';
import s from './SearchResult.css';
import Link from '../Link';
import { connect } from 'react-redux';
import { Image,Glyphicon } from 'react-bootstrap';
import update from 'immutability-helper';
import SearchResultQuery from '../SearchResult/SearchResultQuery.graphql';
import SearchResultMutation from '../SearchResult/SearchResultMutation.graphql';
import Img from 'react-image';

class SearchResult extends React.Component {
  constructor(...args){
    super(...args);
  }

  addLike = (e) =>{
    let id = e.target.id;
    let addtype = "LIKE_TYPE";
    this.props.addLike({id, addtype});
  }

  addNotLike = (e) =>{
    let id = e.target.id;
    let addtype = "NOT_LIKE_TYPE";
    this.props.addLike({id, addtype});
  }

  deleteWin = (e) => {
    let id = e.target.id;
    this.props.deleteWin({ id });
  }

  render() {
    let { id , imgurl, title, owner, like, notlike, deleteFlag } = this.props;
    return (
      <div className={s.root}>
        <div className={s.container}>
    			<span className={s.myGallery} key={id} >
            <Img className={s.myImg} src={[
                  imgurl,
                  'default.png'
                ]} /> 
    				<h5 className={s.title}><a href={imgurl}>{title}</a></h5>
            {this.props.username == owner ? <p>You</p> : <p>{owner}</p>}
            {deleteFlag ? (<i><i className="fa fa-times" onClick={this.deleteWin} id={id}></i>&nbsp;&nbsp;</i>) : <i></i>}
            <i className="fa fa-heart-o" onClick={this.addLike} id={id}></i> {like}&nbsp;&nbsp;&nbsp;
            <i className="fa fa-refresh" onClick={this.addNotLike} id={id} > </i> {notlike} 
    			</span>			
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  if(state.user){
    return {
      username: state.user.email,
    }
  }
  return {}
}

const addLikeMutations = graphql(addLikeMutation,{
  props: ({ ownProps, mutate }) => ({
    addLike: ({ id,addtype }) =>
      mutate({
        variables: { id,addtype },
        refetchQueries: [{
          query: recentwinsQuery
        }],
      }),
  }),
});

const deleteWinMutations = graphql(deleteWinMutation,{
  props: ({ ownProps, mutate }) => ({
    deleteWin: ({ id }) =>
      mutate({
        variables: { id },
        refetchQueries: [{
          query: recentwinsQuery,
          },
          {
          query: yourwinsQuery,
          variables: { username: ownProps.username}
          },
        ],
      }),
  }),
});

export default compose(
  withStyles(s),
  connect(mapStateToProps),
  addLikeMutations,
  deleteWinMutations,
)(SearchResult);