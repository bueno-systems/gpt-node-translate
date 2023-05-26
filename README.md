# node-gpt-translate

Minimal implementation of using OpenAI to translate JSON data. Inspired by <https://chatgpt-i18n.vercel.app> which doesn't seem to work anymore.

## usage

```shell
cp .envrc.example .envrc
# update values
yarn
yarn start
```

# configuration

| Environment Variable | Default Value   | Optional |
| -------------------- | --------------- | -------- |
| TARGET_LANG          | French Canadian | yes      |
| OUTPUT_FILE          | output.json     | yes      |
| INPUT_FILE           | input.json      | yes      |
| OPENAI_API_KEY       |                 | no       |
| OPENAI_ENGINE        | gpt-3.5-turbo   | yes      |
