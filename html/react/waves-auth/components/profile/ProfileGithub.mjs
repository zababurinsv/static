export default obj=>new Promise(async function(resolve,reject){bundle.default(obj,null,async function(error,config){let username={},count=0,sort="created: asc",clientId=null,clientSecret=null,template=config.babel.transform(`        \n      let React =   config['React']\n      let Component = config['Component']\n      let Link = config['Link']\n      let PropTypes = config['PropTypes']\n   \n            \n      class ProfileGithub extends Component {\n        constructor(props) {\n          super(props);\n          this.state = {\n            clientId: '26c196bacea7db10cf48',\n            clientSecret: '0885cb690e07d2a93a6afb0891fb552fd9f7aa53',\n            count: 5,\n            sort: 'created: asc',\n            repos: []\n          };\n        }\n      \n        componentDidMount() {\n          const { username } = this.props;\n          const { count, sort, clientId, clientSecret } = this.state;\n      \n          fetch(\n            \`https://api.github.com/users/${username}/repos?per_page=${count}&sort=${sort}&client_id=${clientId}&client_secret=${clientSecret}\`\n          )\n            .then(res => res.json())\n            .then(data => {\n              if (this.refs.myRef) {\n                this.setState({ repos: data });\n              }\n            })\n            .catch(err => console.log(err));\n        }\n      \n        render() {\n          const { repos } = this.state;\n      \n          const repoItems = repos.map(repo => (\n            <div key={repo.id} className="card card-body mb-2">\n              <div className="row">\n                <div className="col-md-6">\n                  <h4>\n                    <Link to={repo.html_url} className="text-info" target="_blank">\n                      {repo.name}\n                    </Link>\n                  </h4>\n                  <p>{repo.description}</p>\n                </div>\n                <div className="col-md-6">\n                  <span className="badge badge-info mr-1">\n                    Stars: {repo.stargazers_count}\n                  </span>\n                  <span className="badge badge-secondary mr-1">\n                    Watchers: {repo.watchers_count}\n                  </span>\n                  <span className="badge badge-success">\n                    Forks: {repo.forks_count}\n                  </span>\n                </div>\n              </div>\n            </div>\n          ));\n          return (\n            <div ref="myRef">\n              <hr />\n              <h3 className="mb-4">Latest Github Repos</h3>\n              {repoItems}\n            </div>\n          );\n        }\n      }\n      \n      ProfileGithub.propTypes = {\n        username: PropTypes.string.isRequired\n      };\n\n    \n      resolve(ProfileGithub)\n      \n            `,config.babel.availablePresets.react);eval(template.code)})});