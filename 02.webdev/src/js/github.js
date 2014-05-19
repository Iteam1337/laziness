(function (window) {

  function getFeed(username, callback) {
    var url = 'https://api.github.com/users/' + username + '/events';
    return $.getJSON(url);
  }

  function pushEvents(event) {
    return event.type === 'PushEvent';
  }

  function transform(event) {
    return {
      gravatar: event.actor.gravatar_id,
      login: event.actor.login,
      repositoryName: event.repo.name,
      repositoryOwner: event.org && event.org.login,
      createdAt: event.created_at,
      commits: event.payload.commits.map(function (commit) {
        return {
          name: commit.author.name,
          message: commit.message
        };
      })
    };
  }

  function render(template, data, target) {
    var html = Mustache.render(template, data);
    target.html(html);
  }


  var laziness = window.laziness = window.laziness || {};
  laziness.github = {
    getFeed: getFeed,
    pushEvents: pushEvents,
    transform: transform,
    render: render
  };
})(window);