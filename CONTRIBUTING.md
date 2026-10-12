# Corrections and contributions

This is a personal reference kit, not a community-maintained biography. Technical fixes and well-supported factual corrections are welcome, while changes to portrait permissions, personal disclosures, and biographical framing require Paul's explicit approval.

## Good contributions

- **Broken links:** Identify the file and link, and propose a current canonical replacement.
- **Technical fixes:** Include a clear explanation and run `npm test`.
- **Factual corrections:** Point to a public first-party record and distinguish confirmed facts from interpretation.

## Before opening an issue

Check the current document and the relevant project's own materials first. A media-kit snapshot may be older than a product release, but that does not justify inventing a new claim or changing the meaning of a personal statement.

A useful report names the affected file, identifies the problem, and suggests a specific correction. For a broken asset, include its filename and the application or browser in which the problem occurred rather than uploading another person's photograph as an alternative.

Do not submit alternative photographs, personal records, private correspondence, or medical speculation. Use an [official direct-contact route](docs/MEDIA-GUIDE.md#official-contact-and-profiles) for a sensitive correction rather than a public issue.

## Biography and identity changes

The country history is Paul's own account and is deliberately not a chronology. Please do not add details it does not contain.

Keep biographical changes grounded in public first-party material and the [editorial accuracy notes](docs/MEDIA-GUIDE.md#accuracy-notes-for-editors). Corrections should make the record more accurate, not simply more impressive.

## Technical changes

Keep a pull request focused and explain what it changes. Run `npm test`, check local links, and inspect any changed asset's dimensions and metadata before proposing it.

Never include the original portrait, credentials, private backups, internal deployment details, or unrelated files in a pull request. The build tooling and media materials have different licensing scopes, and a code change must not silently broaden the permissions for the portrait or personal copy.

Do not assume that a pull request licenses an image or personal statement for reuse. The root [media permission](LICENSE) and the [tooling license](LICENSES/MIT.txt) have different scopes.
