export default obj=>new Promise(async function(resolve,reject){bundle.default(obj,null,async function(error,config){let template=config.babel.transform('        \n      let React =   config[\'React\']\n      let Component = config[\'Component\']\n      let isEmpty = config[\'isEmpty\']\n\n            \n      class ProfileHeader extends Component {\n        render() {\n          const { profile } = this.props;\n      \n          return (\n            <div className="row">\n              <div className="col-md-12">\n                <div className="card card-body bg-info text-white mb-3">\n                  <div className="row">\n                    <div className="col-4 col-md-3 m-auto">\n                      <img\n                        className="rounded-circle"\n                        src={profile.user.avatar}\n                        alt=""\n                      />\n                    </div>\n                  </div>\n                  <div className="text-center">\n                    <h1 className="display-4 text-center">{profile.user.name}</h1>\n                    <p className="lead text-center">\n                      {profile.status}{\' \'}\n                      {isEmpty(profile.company) ? null : (\n                        <span>at {profile.company}</span>\n                      )}\n                    </p>\n                    {isEmpty(profile.location) ? null : <p>{profile.location}</p>}\n                    <p>\n                      {isEmpty(profile.website) ? null : (\n                        <a\n                          className="text-white p-2"\n                          href={profile.website}\n                          target="_blank"\n                        >\n                          <i className="fas fa-globe fa-2x" />\n                        </a>\n                      )}\n      \n                      {isEmpty(profile.social && profile.social.twitter) ? null : (\n                        <a\n                          className="text-white p-2"\n                          href={profile.social.twitter}\n                          target="_blank"\n                        >\n                          <i className="fab fa-twitter fa-2x" />\n                        </a>\n                      )}\n      \n                      {isEmpty(profile.social && profile.social.facebook) ? null : (\n                        <a\n                          className="text-white p-2"\n                          href={profile.social.facebook}\n                          target="_blank"\n                        >\n                          <i className="fab fa-facebook fa-2x" />\n                        </a>\n                      )}\n      \n                      {isEmpty(profile.social && profile.social.linkedin) ? null : (\n                        <a\n                          className="text-white p-2"\n                          href={profile.social.linkedin}\n                          target="_blank"\n                        >\n                          <i className="fab fa-linkedin fa-2x" />\n                        </a>\n                      )}\n      \n                      {isEmpty(profile.social && profile.social.youtube) ? null : (\n                        <a\n                          className="text-white p-2"\n                          href={profile.social.youtube}\n                          target="_blank"\n                        >\n                          <i className="fab fa-youtube fa-2x" />\n                        </a>\n                      )}\n      \n                      {isEmpty(profile.social && profile.social.instagram) ? null : (\n                        <a\n                          className="text-white p-2"\n                          href={profile.social.instagram}\n                          target="_blank"\n                        >\n                          <i className="fab fa-instagram fa-2x" />\n                        </a>\n                      )}\n                    </p>\n                  </div>\n                </div>\n              </div>\n            </div>\n          );\n        }\n      }\n    \n      resolve(ProfileHeader)\n      \n            ',config.babel.availablePresets.react);eval(template.code)})});