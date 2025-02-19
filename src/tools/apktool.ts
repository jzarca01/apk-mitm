import { join as joinPath } from 'path'
import { map } from 'rxjs/operators'
import chalk from 'chalk'

import { executeJar } from '../utils/execute-jar'
import observeProcess from '../utils/observe-process'

const defaultPath = joinPath(__dirname, '../../jar/apktool.jar')

export default class Apktool {
  constructor(private customPath?: string) {}

  decode(inputPath: string, outputPath: string) {
    return this.run([
      'decode', inputPath,
      '--output', outputPath,
    ])
  }

  encode(inputPath: string, outputPath: string, useAapt2: boolean) {
    return this.run([
      'build', inputPath,
      '--output', outputPath,
      ...(useAapt2 ? ['--use-aapt2'] : []),
    ])
  }

  private run(args: string[]) {
    return map((line: string) => line.replace(/I: /g, ''))(
      observeProcess(executeJar(this.path, args)),
    )
  }

  private get path() {
    return this.customPath || defaultPath
  }

  get version() {
    return this.customPath ? chalk.italic('custom version') : Apktool.version
  }

  static version = 'v2.4.1 SNAPSHOT@197d46'
}
