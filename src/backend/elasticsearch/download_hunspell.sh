#bin/sh
HUNSPELL_BASE_URL="https://raw.githubusercontent.com/LibreOffice/dictionaries/master"

mkdir -p ./hunspell \
  && { \
       echo "de_AT de/de_AT_frami"; \
       echo "de_CH de/de_CH_frami"; \
       echo "de_DE de/de_DE_frami"; \
       echo "en_AU en/en_AU"; \
       echo "en_CA en/en_CA"; \
       echo "en_GB en/en_GB"; \
       echo "en_US en/en_US"; \
       echo "en_ZA en/en_ZA"; \
       echo "cs_CZ cs_CZ/cs_CZ"; \
       echo "sk_SK sk_SK/sk_SK"; \
     } > ./tmp/hunspell.txt \
  && cd ./hunspell \
  && cat ../tmp/hunspell.txt | while read line; do \
       name=$(echo $line | awk '{print $1}'); \
       file=$(echo $line | awk '{print $2}'); \
       echo "${HUNSPELL_BASE_URL}/${file}.aff"; \
       mkdir -p "${name}"; \
       wget -O "${name}/${name}.aff" "${HUNSPELL_BASE_URL}/${file}.aff"; \
       wget -O "${name}/${name}.dic" "${HUNSPELL_BASE_URL}/${file}.dic"; \
     done