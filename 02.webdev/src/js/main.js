(function () {

  $(function () {
    var container = $('#result'),
      tmplTweet = $('#tmpl_tweet').html(),
      tmplError = $('#tmpl_error').html();

    $('#feedBtn').click(function () {
      laziness.github.getFeed($('#username').val())
        .done(function (data) {
          data = data
            .filter(laziness.github.pushEvents)
            .map(laziness.github.transform);
          laziness.github.render(tmplTweet, { feed: data }, container);
        })
        .fail(function (err) {
          laziness.github.render(tmplError, err, container);
        });
    });
  });

})();