# Release Checklist

- [ ] Security fixes (make sure all available undisclosed security fixes are merged)
- [ ] Bump the version
- [ ] Update docker-compose in the docs
- [ ] Make sure `yarn.lock` is up to date
- [ ] Make sure translations are up to date
- [ ] Exclude `.github folder`
- [ ] Write release notes
  - [ ] General description
  - [ ] Things requiring special action beside updating the software
  - [ ] New features
  - [ ] Bug fixes
  - [ ] Enhancements
  - [ ] Add all contributors
- [ ] Run the tests described in the release test document (internal)
- [ ] Upload tar ball to github and add a release tag
- [ ] Update container images
- [ ] Update website by running the ["deploy" workflow](https://github.com/hedgedoc/hedgedoc.github.io/actions?query=workflow%3A%22Deploy+to+github+actions+branch%22) in hedgedoc/hedgedoc.github.io

