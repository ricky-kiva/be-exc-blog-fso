const { exec } = require('child_process')

const args = process.argv.slice(2)
const isExport = args.includes('--export')

const isProd = args.includes('--prod')
const nodeEnv = isProd ? 'prod' : 'dev'

const newmanCommand = `newman run \
  postman/resources/${nodeEnv}.postman_collection.json \
  --environment postman/resources/${nodeEnv}.postman_environment.json --color on`

const execCommand = isExport
  ? `npm run pm:export -- --${nodeEnv} && ${newmanCommand}`
  : newmanCommand

const execProcess = exec(execCommand)

execProcess.stdout.on('data', (data) => { console.log(data) })
execProcess.stderr.on('data', (data) => { console.error(data) })
execProcess.on('close', (code) => {
  console.log(`Child process exited with code ${code}`)
})
