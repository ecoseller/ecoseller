## ecoseller.io - Elasticsearch

If you keen to use Elasticsearch as a search engine for your ecoseller.io instance with Hunspell support, you need to download dictionaries first.
We recommend using provided script to download dictionaries for all supported languages from [OpenOffice](https://www.openoffice.org/lingucomponent/dictionary.html) website.
See [download-hunspell.sh](download-hunspell.sh) script for details.

Hunspell dictionaries will be copied to your Elasticsearch Docker container on startup and you can then use them in your index settings.