const core = require('@actions/core');
const github = require('@actions/github');

try {
  console.log('Creating a release');

  const token = core.getInput('token');
  const name = core.getInput('release_name');
  const body = core.getInput('release_body');

  const octokit = github.getOctokit(token);

  const tag = "1.0.0";

  const release = await octokit.repos.createRelease({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    tag_name: github.context.ref,
    name: name,
    body: body,
  });

  console.log(release);

  // Indicate success
  core.setOutput('status', 'success');
  core.setOutput('url', release.data.html_url);
  core.setOutput('tag', tag);

  console.log('Release created successfully');

} catch (error) {
  // Handle errors and indicate failure
  core.setFailed(error.message);
}
