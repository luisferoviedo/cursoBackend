const fs = require('node:fs')
const path = require('node:path')
const { execFileSync } = require('node:child_process')

const projectRoot = path.resolve(__dirname, '..')
const targets = ['server.js', 'src', 'scripts']

const collectJavaScriptFiles = (relativeTarget) => {
  const absoluteTarget = path.join(projectRoot, relativeTarget)
  const stat = fs.statSync(absoluteTarget)

  if (stat.isFile()) {
    return [absoluteTarget]
  }

  return fs.readdirSync(absoluteTarget, { withFileTypes: true }).flatMap((entry) => {
    const nextRelativeTarget = path.join(relativeTarget, entry.name)

    if (entry.isDirectory()) {
      return collectJavaScriptFiles(nextRelativeTarget)
    }

    return entry.name.endsWith('.js')
      ? [path.join(projectRoot, nextRelativeTarget)]
      : []
  })
}

const files = targets.flatMap(collectJavaScriptFiles)

for (const file of files) {
  execFileSync(process.execPath, ['--check', file], {
    stdio: 'inherit'
  })
}

console.log(`Syntax check passed for ${files.length} files`)
