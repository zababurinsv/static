import{ADD_POST,GET_POSTS,GET_POST,DELETE_POST,POST_LOADING}from"../actions/types";const initialState={posts:[],post:{},loading:!1};export default function(t=initialState,a){switch(a.type){case POST_LOADING:return{...t,loading:!0};case GET_POSTS:return{...t,posts:a.payload,loading:!1};case GET_POST:return{...t,post:a.payload,loading:!1};case ADD_POST:return{...t,posts:[a.payload,...t.posts]};case DELETE_POST:return{...t,posts:t.posts.filter(t=>t._id!==a.payload)};default:return t}}