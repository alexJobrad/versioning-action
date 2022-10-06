<p align="center">
  <a href="https://github.com/actions/typescript-action/actions"><img alt="typescript-action status" src="https://github.com/actions/typescript-action/workflows/build-test/badge.svg"></a>
</p>

# Create a new version

This versioning action creates a new version string based on available git tags.

## Usage

The action takes one argument `releaseType`. It can have one of the following values:
* `release`: perform a new release based on the current release candidate. The action will fail, if the current version isn't a release candidate.
* `major`: create candidate for new major release
* `minor`: create candidate for new minor release
* `patch`: create candidate for new patch release

A new release candidate will be based on the current latest version. If the current version is a release, a new release candidate with `-RC1` will be created, based on the value of `releaseType`. In case, the current version is a candidate, the action will check, if ht is of the same type as `releaseType` and then only increases the `-RC(X+1)`. Otherwise, a new release candidate will be created with `-RC1`.

To use this action, add the following block to the `action.yaml`:

```
      - name: Create new version
        id: versioning
        uses: alexJobrad/versioning-action@v0.0.10
        with:
          releaseType: ${{ inputs.releaseType }}
```

# Development

The main code is in `src/main.ts`.

## Tests

Run tests (uses jest): `npm test`

## Create release

```
npm run build && npm run package
```
