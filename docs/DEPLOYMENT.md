# Railway connection

- GitHub repository: https://github.com/KieKoongDev/project-01
- Testing branch: https://github.com/KieKoongDev/project-01/tree/testing
- Railway project: paperbound-project-01
- Service: paperbound-testing
- Environment name: production (used for this concept-test service; no separate live customer app)
- Test URL: https://paperbound-testing-production.up.railway.app
- Runtime environment: NODE_ENV=production, PORT=3000. No API keys are required.

## One-time connection still required

Railway's auto-deploy capability returned `enabled=false`, `canEnable=false`, `reason=NO_INSTALLATION`: the Railway GitHub App has not been granted access to this repository. The user's authorization in chat does not replace the GitHub installation grant.

Grant Railway GitHub App access to KieKoongDev/project-01 through GitHub installed-app settings / Railway's GitHub connection flow. Refresh repositories in Railway, select the testing branch and enable autodeploy. Verify the resulting deployment references the testing commit; the initial service creation accepted testing as input but its deployment metadata reported main, so do not infer success from the request alone.

Official guidance: https://docs.railway.com/deployments/github-autodeploys

## Release process after connection

1. Make requested code changes on testing.
2. Run pnpm check.
3. Commit and push without force.
4. Confirm Railway deploys the same SHA and /healthz reports the intended version.
5. Never silently substitute main for a testing deployment.

The Dockerfile runs validation during image creation. The GitHub Actions workflow also validates pushes; Wait for CI is not claimed enabled until confirmed in Railway.
