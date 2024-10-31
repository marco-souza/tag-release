import fs from "node:fs";
import core from "@actions/core";
import github from "@actions/github";

async function main() {
  const token = core.getInput("token");
  const filename = core.getInput("version-file");
  const title = core.getInput("title");

  const content = fs.readFileSync(filename, "utf8");
  const versionInfo = JSON.parse(content);
  const releaseTag = versionInfo?.version;

  if (!releaseTag) {
    throw new Error("invalid version-file: missing version key");
  }

  const octokit = github.getOctokit(token);

  const allTagsSet = await getTagsSet(octokit);
  const isNewTag = !allTagsSet.has(releaseTag);
  if (isNewTag) {
    console.log("Creating a new tag");
    await createTag(releaseTag, octokit);
  }

  const releaseResp = await getRelease(releaseTag, octokit);
  if (releaseResp) {
    console.log("Release already exists for tag", releaseTag);

    core.setOutput("status", "exists");
    core.setOutput("tag", releaseTag);
    core.setOutput("url", releaseResp.data.url);

    return;
  }

  console.log("Creating a new release for tag", releaseTag);
  const createReleaseRes = await createRelease(
    { title, tag: releaseTag },
    octokit,
  );

  core.setOutput("status", "created");
  core.setOutput("tag", releaseTag);
  core.setOutput("url", createReleaseRes.data.url);

  console.log("Release created successfully! 🚀");
}

async function getRelease(
  release: string,
  octokit: ReturnType<typeof github.getOctokit>,
) {
  const resp = await octokit.request(
    "GET /repos/{owner}/{repo}/releases/tags/{tag}",
    {
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      tag: release,
    },
  ).catch((err) => {
    if (err.status === 404) {
      return null;
    }
    throw err;
  });

  return resp;
}

async function createTag(
  tag: string,
  octokit: ReturnType<typeof github.getOctokit>,
) {
  const createTagResp = await octokit.request(
    "POST /repos/{owner}/{repo}/git/tags",
    {
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      tag: tag,
      message: `Release ${tag}`,
      object: github.context.sha,
      tagger: {
        name: "GitHub Actions",
        email: "octocat@github.com",
        date: new Date().toISOString(),
      },
      type: "commit",
    },
  );

  if (createTagResp.status !== 201) {
    throw new Error("Failed to create tag");
  }
}

type CreateRelease = {
  tag: string;
  title?: string;
};

async function createRelease({
  tag,
  title,
}: CreateRelease, octokit: ReturnType<typeof github.getOctokit>) {
  const name = title ? `${title} ${tag}` : tag;
  const resp = await octokit.request("POST /repos/{owner}/{repo}/releases", {
    name,
    tag_name: tag,
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    draft: false,
    prerelease: false,
    generate_release_notes: true,
  });

  if (resp.status !== 201) {
    throw new Error("Failed to create release");
  }

  return resp;
}

async function getTagsSet(octokit: ReturnType<typeof github.getOctokit>) {
  const tagsResp = await octokit.request("GET /repos/{owner}/{repo}/tags", {
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
  });

  const allTags = tagsResp.data.map((tag) => tag.name);
  return new Set(allTags);
}

await main().catch((error) => {
  // Handle errors and indicate failure
  core.setFailed(error.message);
});
