const handlePost = (e) => {
  e.preventDefault();
  
  if($("#postValue").val() == '') {
    handleError("Your post cannot be as blank as your mind");
    return false;
  }
  
  sendAjax("POST", $("#postForm").attr("action"), $("#postForm").serialize(), function() {
    loadPostsFromServer();
  });
  
  return false;
};

const handleBlurb = (e) => {
  e.preventDefault();
  
  sendAjax("POST", $("#profile").attr("action"), $("#profile").serialize(), function(){
    loadBlurbFromServer();
  });
  
  return false;
}

const Profile = (props) => {
  return(
    <form id="profile"
      name="profile"
    onSubmit={handleBlurb}
    action="/blurb"
    method="POST"
    className="profile"
    >
      <h1>{props.username}</h1>
      <textarea id="blurbField" name="theBlurb" value={props.blurb}/>
      <input type="hidden" name="_csrf" value={props.csrf} />
      <br/>
      <input className="updateBlurb" type="submit" value="Update" />
    </form>)
};

const PostForm = (props) => {
  return(
    <form id="postForm"
      name="postForm"
      onSubmit={handlePost}
      action="/new"
      method="POST"
      className="postForm"
      >
      <h3>Remember, 30 characters per line!</h3>
      <textarea id="postValue" name="thePost" placeholder="Share your thoughts..."/>
      <input type="hidden" name="_csrf" value={props.csrf} />
      <br/>
      <input className="makePostSubmit" type="submit" value="Post!" />
      </form>
      );
};

const PostList = (props) => {
  if(props.posts.length === 0) {
    return (
      <div className="postList">
        <h3 className="emptyPost">No Posts yet</h3>
      </div>
    );
  }
  
  const postNodes = props.posts.map(function(post) {
    return (
    <div key={post._id} className="post">
        <pre><p>{post.contents}</p></pre>
      </div>
    );
  });
  
  return (
    <div classNames="postList">
      {postNodes}
    </div>
  );
};

const loadPostsFromServer = () => {
  sendAjax("GET", "/getPosts", null, (data) => {
    ReactDOM.render(
    <PostList posts={data.posts} />, document.querySelector("#content")
    );
  });
};

const loadProfileFromServer = () => {
  sendAjax("GET", "/blurb", null, (data) => {
    reactDOM.render(
      <Profile csrf={csrf} />, document.querySelector("#header")
    );
  });
};

const setup = function(csrf) {
  ReactDOM.render(
    <Profile csrf={csrf} />, document.querySelector("#header")
  );
  
  ReactDOM.render(
    <PostForm csrf={csrf} />, document.querySelector("#form")
  );
  
  ReactDOM.render(
    <PostList posts={[]} />, document.querySelector("#content")
  );
  
  loadPostsFromServer();
};

const getToken = () => {
  sendAjax("GET", '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});