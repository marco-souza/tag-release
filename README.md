# tag-release

![GitHub Release](https://img.shields.io/github/v/release/marco-souza/tag-release)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/marco-souza/tag-release/tag-release.yml)

**Tag Release** is a GitHub Action that creates **GitHub Releases** whenever your version file changes.

> [!NOTE]
> We only support `json` files with a `version` key on the root level, because it was initially created to support `package.json` and `deno.json`.
>
> You can also create a `version.json`, at the root level of your project, if you are not developing a JavaScript package.

## Usage

For NodeJS:

```yaml
# .github/workflows/release.yml
name: Create Release on version change

on:
  push:
    paths:
      - package.json

jobs:
  gh-release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Create release from tag
        uses: marco-souza/tag-release@1.2.0
        with:
          version-file: package.json
          token: ${{ secrets.GITHUB_TOKEN }}
```

For Deno:

```yaml
# .github/workflows/release.yml
name: Create Release on version change

on:
  push:
    paths:
      - deno.json

jobs:
  gh-release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Create release from tag
        uses: marco-souza/tag-release@1.2.0
        with:
          version-file: deno.json
          token: ${{ secrets.GITHUB_TOKEN }}
```
