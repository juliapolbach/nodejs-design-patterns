// Modify the asynchronous FindRegex class so that it emits
// an event when the find process starts, passing the input files
// list as an argument. Hint: beware of Zalgo!

import { readFile } from 'fs'
import EventEmitter from 'events'
export class FindRegex extends EventEmitter {
        constructor(regex) {
                super()
                this.regex = regex
                this.files = []
        }
        addFile(file) {
                this.files.push(file)
                return this
        }
        find() {
                // +++ 3.1 added line
                // Using nextTick() ensures that ALL events from this class
                // are emitted asynchronously
                process.nextTick(() => this.emit('started', this.files))

                for (const file of this.files) {
                        readFile(file, 'utf8', (err, content) => {
                                if (err) {
                                        return this.emit('error', err)
                                }
                                this.emit('fileread', file)
                                const match = content.match(this.regex)
                                if (match) {
                                        match.forEach(elem => this.emit('found',

                                                file, elem))
                                }
                        })
                }
                return this
        }
}

