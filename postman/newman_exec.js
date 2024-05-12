const { exec } = require('child_process')

const args = process.argv.slice(2)
const isExport = args.includes('--export')

const isProd = args.includes('--prod')
const nodeEnv = isProd ? 'prod' : 'dev'

const newmanCommand = `newman run \
  postman/resources/${nodeEnv}.postman_collection.json \
  --environment postman/resources/${nodeEnv}.postman_environment.json`

const execCommand = isExport
  ? `npm run pm:export -- --${nodeEnv} && ${newmanCommand}`
  : newmanCommand

exec(execCommand, (err, stdout, stderr) => {
  if (err) {
    console.error(`exec error: ${err}`)
    return
  }

  if (stdout) { console.log(`stdout: ${stdout}`) }
  if (stderr) { console.error(`stderr: ${stderr}`) }
})
