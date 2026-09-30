# 𓇋𓈖𓊪𓅱𓏟 Inpu - Hieroglyphic Input
---
**Ancient Egyptian hieroglyphic input** inspired by Japanese [IME](https://en.wikipedia.org/wiki/Input_method), on the web. 
Demo currently hosted **[here](https://inpu.vercel.app)**.


---
Select an input mode between phonographic transliteration, Gardiner codes, and hieroglyph description keywords; type away, select your hieroglyph between the set of candidates presented, and the output will be [Unicode characters](https://en.wikipedia.org/wiki/Egyptian_Hieroglyphs_(Unicode_block)) that can have common text-processing tasks performed on them, like copying and searching.

Note that the [hieroglyph set](https://github.com/arsaccol/inpu-db/blob/main/002_hieroglyph_data.sql) is still incomplete, and we are working on expanding it.

The **Manuel de Codage** mode composes quadrats with live HieroJax rendering:
try `A1:O1` (vertical) or `W24*Z7` (horizontal). Copy produces Unicode text with
Egyptian format controls. See the [MdC guide](docs/mdc.md) for supported syntax,
conversion limits, and validation status, and [third-party notices](THIRD_PARTY.md)
for upstream licenses and attribution.

Your suggestions and contributions are welcome! You may use [issues](https://github.com/arsaccol/inpu/issues) to provide feedback, report bugs, and so on. Feel free to use [this Google form](https://forms.gle/iGvfAd5toML9Gxt57) as well. Pull requests are welcome, too! If you want to make a contribution with a PR, consider writing an issue first so we understand what you intend to implement, and then address the issue in your PR, or directly make your PR addressing an already existing issue.

## License

Inpu is licensed under GPL version 3 only. See [LICENSE](LICENSE) and
[third-party notices](THIRD_PARTY.md).

## Development

The database seed files are maintained in the public [inpu-db](https://github.com/arsaccol/inpu-db) repository and included here as a Git submodule.

Clone this repository together with its database:

```sh
git clone --recurse-submodules https://github.com/arsaccol/inpu.git
cd inpu
npm install
npm run dev
```

If you already cloned the repository without its submodules, initialize them before installing or building:

```sh
git submodule update --init --recursive
```

The parent repository pins an exact `inpu-db` commit so local and deployed builds use the same data. To intentionally update that pinned commit:

```sh
git submodule update --remote inpu-db
git add inpu-db
```
