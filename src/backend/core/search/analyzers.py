from elasticsearch_dsl.analysis import token_filter
from elasticsearch_dsl import analyzer, tokenizer

czech_stemmer = token_filter(
    "czech_stemmer",
    type="stemmer",
    name="czech",
)

unique_on_same_position = token_filter(
    "unique_on_same_position",
    type="unique",
    only_on_same_position=True,
)


czech_length = token_filter(
    "czech_length",
    type="length",
    min=2,
)

czech_unique = token_filter(
    "czech_unique",
    type="unique",
    only_on_same_position=True,
)

german_stemmer = token_filter("german_stemmer", type="stemmer", name="light_german")

english_stemmer = token_filter("english_stemmer", type="stemmer", name="english")

"""FILTERS"""
word_delimiter_filter = token_filter(
    "word_delimiter_filter",
    type="word_delimiter",
    preserve_original=True,
    catenate_words=True,
    catenate_numbers=True,
    stem_english_possessive=False,
    generate_number_parts=True,
    split_on_case_change=False,
    type_table=["/ => DIGIT", ". => DIGIT", ", => DIGIT", "- => ALPHANUM"],
)

czech_hunspell = token_filter(
    "czech_hunspell",
    type="hunspell",
    locale="cs_CZ",
    dedup=True,
)

slovak_hunspell = token_filter(
    "slovak_hunspell",
    type="hunspell",
    locale="sk_SK",
    dedup=True,
)

english_hunspell = token_filter(
    "english_hunspell",
    type="hunspell",
    locale="en_GB",
    dedup=True,
)

german_hunspell = token_filter(
    "german_hunspell",
    type="hunspell",
    locale="de_DE",
    dedup=True,
)

lowercase_filter = token_filter(
    "lowercase_filter",
    type="lowercase",
)
min_length = token_filter(
    "min_length",
    type="length",
    min=2,
)
czech_stopwords = token_filter(
    "czech_stopwords",
    type="stop",
    stopwords=["že", "právě", "_czech_"],
)

slovak_stopwords = token_filter(
    "slovak_stopwords",
    type="stop",
    stopwords=["_slovak_"],
)
english_stopwords = token_filter(
    "english_stopwords",
    type="stop",
    stopwords=["_english_"],
)
german_stopwords = token_filter(
    "german_stopwords",
    type="stop",
    stopwords=["_german_"],
)

unique_filter = token_filter(
    "unique_filter",
    type="unique",
    only_on_same_position=False,
)

"""TOKENIZER"""
autocomplete_tokenizer = tokenizer(
    "autocomplete_tokenizer",
    type="edge_ngram",
    min_gram=2,
    max_gram=10,
    token_chars=[
        "letter",
        "digit",
    ],
)

"""ANYLZERS"""
words_analyzer = analyzer(
    "words_analyzer",
    tokenizer="keyword",
    filter=[word_delimiter_filter, lowercase_filter, "asciifolding", unique_filter],
)

autocomplete_analyzer = analyzer(
    "autocomplete_analyzer",
    tokenizer=autocomplete_tokenizer,
    type="custom",
    char_filter="html_strip",
    filter=[lowercase_filter, "asciifolding"],
)

autocomplete_search_analyzer = analyzer(
    "autocomplete_search_analyzer",
    tokenizer=autocomplete_tokenizer,
    type="custom",
    char_filter="html_strip",
    filter=["asciifolding"],
)

czech_hunspell_analyzer = analyzer(
    "czech_hunspell_analyzer",
    tokenizer="standard",
    type="custom",
    char_filter="html_strip",
    filter=[
        "asciifolding",
        min_length,
        czech_stopwords,
        czech_hunspell,
        lowercase_filter,
    ],
)

czech_autocomplete_hunspell_analyzer = analyzer(
    "czech_autocomplete_hunspell_analyzer",
    tokenizer=autocomplete_tokenizer,
    type="custom",
    char_filter="html_strip",
    filter=[
        "asciifolding",
        min_length,
        czech_stopwords,
        czech_hunspell,
        lowercase_filter,
    ],
)

# THIS NEEDS SOME EDITING!
slovak_autocomplete_hunspell_analyzer = analyzer(
    "slovak_autocomplete_hunspell_analyzer",
    tokenizer=autocomplete_tokenizer,
    type="custom",
    char_filter="html_strip",
    filter=[
        "asciifolding",
        min_length,
        slovak_stopwords,
        slovak_hunspell,
        lowercase_filter,
    ],
)

# other langs
english_autocomplete_hunspell_analyzer = analyzer(
    "english_autocomplete_hunspell_analyzer",
    tokenizer=autocomplete_tokenizer,
    type="custom",
    char_filter="html_strip",
    filter=[
        "asciifolding",
        min_length,
        english_stopwords,
        english_hunspell,
        lowercase_filter,
    ],
)
german_autocomplete_hunspell_analyzer = analyzer(
    "german_autocomplete_hunspell_analyzer",
    tokenizer=autocomplete_tokenizer,
    type="custom",
    char_filter="html_strip",
    filter=[
        "asciifolding",
        min_length,
        german_stopwords,
        german_hunspell,
        lowercase_filter,
    ],
)
general_autocomplete_hunspell_analyzer = analyzer(
    "general_autocomplete_hunspell_analyzer",
    tokenizer=autocomplete_tokenizer,
    type="custom",
    char_filter="html_strip",
    filter=[
        "asciifolding",
        min_length,
        lowercase_filter,
    ],
)
