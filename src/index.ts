import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import { Configuration, OpenAIApi } from "openai";

const {
    TARGET_LANG = 'French Canadian',
    OUTPUT_FILE = 'output.json',
    INPUT_FILE = 'input.json',
    OPENAI_API_KEY,
    OPENAI_ENGINE = 'gpt-3.5-turbo'
} = process.env

const inputFile = path.resolve(`./data/${INPUT_FILE}`)
const outputFile = path.resolve(`./data/${OUTPUT_FILE}`)

if (OPENAI_API_KEY == null || OPENAI_API_KEY === '') {
    console.error("OPENAI_API_KEY is required")
    process.exit(1)
}

const configuration = new Configuration({ apiKey: OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

const { data: engines } = await openai.listEngines();

const engine = engines.data.find((engine) => engine.id === OPENAI_ENGINE);

if (engine == null) {
    console.error(`Unable to find engine: ${OPENAI_ENGINE}`)
    process.exit(1)
}

const inputData = await readFile(inputFile, 'utf-8')
const jsonData = JSON.parse(inputData) as Record<string, string>

console.log(`Prompting GPT-3...`)
console.log(`Using engine: ${engine.id}`)
console.log(`Target language: ${TARGET_LANG}`)
console.log(`Input file: ${inputFile}`)
console.log(`Output file: ${outputFile}`)

const prompt = [
    `You are a helpful assistant that translates a i18n locale array content to ${TARGET_LANG}.`,
    "It's a array structure, contains many strings, translate each of them and make a new array of translated strings."
]
const gpt35Turbo = await openai.createChatCompletion({
    model: engine.id,
    messages: [
        {
            role: 'system',
            content: prompt.join('\n')
        },
        {
            role: 'user',
            content: `Translate this array to ${TARGET_LANG}: \n\n\n`
        },
        {
            role: 'user',
            content: JSON.stringify(Object.values(jsonData))
        }
    ]
})

const first = gpt35Turbo.data.choices.at(0)?.message?.content
if (first == null) {
    console.error("No choices returned")
    process.exit(1)
}

const translated = JSON.parse(first) as string[]

// Join data back together based on input keys
const result = Object.keys(jsonData).reduce<Record<string, string>>((acc, key, index) => {
    acc[key] = translated[index]
    return acc 
}, jsonData)

await writeFile(outputFile, JSON.stringify(result, null, 2))
console.log("Done!")
