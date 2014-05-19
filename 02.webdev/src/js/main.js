(function () {

  $(function () {
    var input = $('#username'),
      button = $('#feedBtn'),
      container = $('#result'),
      tmplTweet = $('#tmpl_tweet').html(),
      tmplError = $('#tmpl_error').html();

    function loadFeed() {
      laziness.github.getFeed(input.val())
        .done(function (data) {
          data = data
            .filter(laziness.github.pushEvents)
            .map(laziness.github.transform);
          laziness.github.render(tmplTweet, { feed: data }, container);
        })
        .fail(function (err) {
          laziness.github.render(tmplError, err, container);
        });
    }

    button.click(loadFeed);

    input.keyup(function (e) {
      if(e.which === 13) {
        e.preventDefault();
        loadFeed();
      }
    });

    input.focus();
  });

})();