# tag-release

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.1.28. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

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
        uses: marco-souza/tag-release@0.0.1
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
        uses: marco-souza/tag-release@0.0.1
        with:
          version-file: deno.json
          token: ${{ secrets.GITHUB_TOKEN }}
```

