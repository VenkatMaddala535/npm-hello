# npm Hello

A Node.js 22+ website using the built-in HTTP server. npm manages the build, tests, and package. There are no runtime dependencies.

Run these commands **inside `npm-hello/`**:

```bash
npm ci
npm test
npm run pack:artifact
npm start
```

Open http://localhost:3001. Stop with **Ctrl+C**.

| Task | Command / output |
| --- | --- |
| Run source while learning | `npm run dev` |
| Test + coverage | `npm test` |
| Build server and static assets | `npm run build` |
| Build + package | `npm run pack:artifact` |
| Run built app | `npm start` |
| Greeting | `/api/greet?name=Balaji` → `Hello, Balaji!` |
| Health | `/health` → `{"status":"ok","stack":"npm"}` |
| Package | `artifacts/jenkins-lab-npm-hello-1.0.0.tgz` |
| Test reports | `reports/junit.xml` |
| Coverage | `coverage/lcov.info` and `coverage/lcov-report/index.html` |

Use another port: `PORT=3001 npm start`.

The build copies the server and its website from `src/` into `dist/`. `npm pack` creates a tarball containing that runnable app. Use `npm ci` in CI: it installs from `package-lock.json` and fails if the manifest and lockfile disagree.

To try the saved tarball in a separate, empty directory:

```bash
npm install /absolute/path/to/npm-hello/artifacts/jenkins-lab-npm-hello-1.0.0.tgz
./node_modules/.bin/jenkins-hello-npm
```

The Jenkinsfile installs dependencies, runs tests, builds the app, and saves the tarball.

For a Docker build agent, select **`npm-hello/Jenkinsfile.docker`** as the Jenkins Script Path. It uses `node:22-bookworm` on a node labeled `docker`. See the [Docker agent runbook](../runbooks/05-docker-agents.md).

[Local runbook](../runbooks/01-local-projects.md) · [Jenkins runbook](../runbooks/02-jenkins-ci.md) · [Optional integrations](../runbooks/03-sonarqube-jfrog.md)
