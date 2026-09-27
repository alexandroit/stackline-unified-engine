import {engine, type Options, type Callback, type VFileReporter} from '../index.js'
import {unified} from 'unified'
import {VFile} from 'vfile'

const file = new VFile({path: 'example.txt', value: 'example'})
const options: Options = {processor: unified(), files: [file, '*.txt'], extensions: ['txt']}
const callback: Callback = (error, code, context) => {
  const status: number | undefined = code
  if (error) console.error(error.message)
  if (context) console.log(context.files?.length, status)
}
const reporter: VFileReporter = files => String(files)
engine({...options, reporter}, callback)
