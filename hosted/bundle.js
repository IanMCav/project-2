"use strict";

var handlePost = function handlePost(e) {
  e.preventDefault();

  if ($("#postValue").val() == '') {
    handleError("Your post cannot be as blank as your mind");
    return false;
  }

  sendAjax("POST", $("#postForm").attr("action"), $("#postForm").serialize(), function () {
    loadPostsFromServer();
  });

  return false;
};

var handleBlurb = function handleBlurb(e) {
  e.preventDefault();

  sendAjax("POST", $("#profile").attr("action"), $("#profile").serialize(), function () {
    loadBlurbFromServer();
  });

  return false;
};

var Profile = function Profile(props) {
  return React.createElement(
    "form",
    { id: "profile",
      name: "profile",
      onSubmit: handleBlurb,
      action: "/blurb",
      method: "POST",
      className: "profile"
    },
    React.createElement(
      "h1",
      null,
      props.username
    ),
    React.createElement("textarea", { id: "blurbField", name: "theBlurb", value: props.blurb }),
    React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
    React.createElement("br", null),
    React.createElement("input", { className: "updateBlurb", type: "submit", value: "Update" })
  );
};

var PostForm = function PostForm(props) {
  return React.createElement(
    "form",
    { id: "postForm",
      name: "postForm",
      onSubmit: handlePost,
      action: "/new",
      method: "POST",
      className: "postForm"
    },
    React.createElement(
      "h3",
      null,
      "Remember, 30 characters per line!"
    ),
    React.createElement("textarea", { id: "postValue", name: "thePost", placeholder: "Share your thoughts..." }),
    React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
    React.createElement("br", null),
    React.createElement("input", { className: "makePostSubmit", type: "submit", value: "Post!" })
  );
};

var PostList = function PostList(props) {
  if (props.posts.length === 0) {
    return React.createElement(
      "div",
      { className: "postList" },
      React.createElement(
        "h3",
        { className: "emptyPost" },
        "No Posts yet"
      )
    );
  }

  var postNodes = props.posts.map(function (post) {
    return React.createElement(
      "div",
      { key: post._id, className: "post" },
      React.createElement(
        "pre",
        null,
        React.createElement(
          "p",
          null,
          post.contents
        )
      )
    );
  });

  return React.createElement(
    "div",
    { classNames: "postList" },
    postNodes
  );
};

var loadPostsFromServer = function loadPostsFromServer() {
  sendAjax("GET", "/getPosts", null, function (data) {
    ReactDOM.render(React.createElement(PostList, { posts: data.posts }), document.querySelector("#content"));
  });
};

var loadProfileFromServer = function loadProfileFromServer() {
  sendAjax("GET", "/blurb", null, function (data) {
    reactDOM.render(React.createElement(Profile, { csrf: csrf }), document.querySelector("#header"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render(React.createElement(Profile, { csrf: csrf }), document.querySelector("#header"));

  ReactDOM.render(React.createElement(PostForm, { csrf: csrf }), document.querySelector("#form"));

  ReactDOM.render(React.createElement(PostList, { posts: [] }), document.querySelector("#content"));

  loadPostsFromServer();
};

var getToken = function getToken() {
  sendAjax("GET", '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#postMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
  $("#postMessage").animate({ width: 'hide' }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: 'false',
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
