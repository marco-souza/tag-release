const core = require('@actions/core');
const github = require('@actions/github');

try {
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

  // Indicate success
  core.setOutput('status', 'success');
  core.setOutput('url', release.data.html_url);
  core.setOutput('tag', tag);

} catch (error) {
  // Handle errors and indicate failure
  core.setFailed(error.message);
}
