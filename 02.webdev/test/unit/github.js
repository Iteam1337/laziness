describe('github', function () {
  var data;

  beforeEach(function () {
    data = [
        {
          id: "2098603082",
          type: "PushEvent",
          actor: {
            login: "JohanObrink",
            gravatar_id: "50482b910549e7ace138a79d3e23e112",
            url: "https://api.github.com/users/JohanObrink",
            avatar_url: "https://avatars.githubusercontent.com/u/548783?"
          },
          repo: {
            id: 19776534,
            name: "Iteam1337/laziness",
            url: "https://api.github.com/repos/Iteam1337/laziness"
          },
          payload: {
            push_id: 366302828,
            size: 4,
            distinct_size: 4,
            ref: "refs/heads/master",
            head: "ffcba64510167cfa100f1d7da663472b41880154",
            before: "17594f2e30c3f2dfc6cd45d6f4747be04ade7d09",
            commits: [
              {
                sha: "2eb25fe0ff6bec96ffb308f2f6cd31d816ead534",
                author: {
                  email: "johan.obrink@gmail.com",
                  name: "Johan Öbrink"
                },
                message: "Setup - first commit",
                distinct: true,
                url: "https://api.github.com/repos/Iteam1337/laziness/commits/2eb25fe0ff6bec96ffb308f2f6cd31d816ead534"
              },
              {
                sha: "5a02f5e97e693386e288bca332952bb37eabe938",
                author: {
                  email: "johan.obrink@gmail.com",
                  name: "Johan Öbrink"
                },
                message: "Starting point for first example",
                distinct: true,
                url: "https://api.github.com/repos/Iteam1337/laziness/commits/5a02f5e97e693386e288bca332952bb37eabe938"
              }
            ]
          },
          public: true,
          created_at: "2014-05-14T14:31:09Z",
          org: {
            id: 1397500,
            login: "Iteam1337",
            gravatar_id: "f46fd1cc02c26449bf8d991503f35b0d",
            url: "https://api.github.com/orgs/Iteam1337",
            avatar_url: "https://avatars.githubusercontent.com/u/1397500?"
          }
        },
        {
          type: "GollumEvent",
        }
      ];
    });

  describe('#getFeed', function () {
    var jsonPromise;
    beforeEach(function () {
      sinon.stub($, 'getJSON');
    });
    afterEach(function () {
      $.getJSON.restore();
    });

    it('calls the correct url', function () {
      laziness.github.getFeed('JohanObrink');
      expect($.getJSON).calledOnce;
      expect($.getJSON).calledWith('https://api.github.com/users/JohanObrink/events');
    });
  });

  describe('#transform', function () {
    it('transforms the results correctly', function () {
      var result = [data[0]].map(laziness.github.transform);
      expect(result[0]).to.eql({
        gravatar: '50482b910549e7ace138a79d3e23e112',
        login: 'JohanObrink',
        repositoryName: 'Iteam1337/laziness',
        repositoryOwner: 'Iteam1337',
        createdAt: '2014-05-14T14:31:09Z',
        commits: [
          {
            name: 'Johan Öbrink',
            message: 'Setup - first commit'
          },
          {
            name: 'Johan Öbrink',
            message: 'Starting point for first example'
          }
        ]
      });
    });
  });

  describe('#pushEvents', function () {
    it('filters out non PushEvent', function () {
      var result = data.filter(laziness.github.pushEvents);
      expect(result).to.eql([data[0]]);
    });
  });

  describe('#render', function () {
    var template, target, html;
    beforeEach(function () {
      
      template = {};

      html = '<div/>';

      target = {
        html: sinon.stub()
      };

      sinon.stub(Mustache, 'render').returns(html);
    });
    afterEach(function () {
      Mustache.render.restore();
    });
    it('puts result in target container', function () {
      laziness.github.render(template, data, target);
      expect(target.html).calledOnce;
      expect(target.html).calledWith(html);
    });
  });
});