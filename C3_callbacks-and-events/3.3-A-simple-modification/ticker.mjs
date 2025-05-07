// 3.3 A simple modification: Modify the function created in exercise 3.2
// so that it emits a tick event immediately after the function is invoked.

import { EventEmitter } from 'events'

function ticker(ms, cb) {
        const emitter = new EventEmitter()
        let count = 0
        const endTime = Date.now() + ms

        // +++ 3.3 added line
        // Using nextTick() ensures that initial event
        // is declared after listener declaration,
        // otherwise it wouldn't be recorded.

        process.nextTick(()=> emitter.emit('tick'))
        count++

        tick(endTime, count, emitter, cb)
        return emitter
}

function tick(endTime, count, emitter, cb) {
        const currentTime = Date.now()
        if (currentTime >= endTime) {
                return cb(count)
        }

        setTimeout(() => {
                emitter.emit('tick')
                count++
                tick(endTime, count, emitter, cb)
        }, 50)
}

ticker(300, count => console.log(`Total count of ticks: ${count}`)).on('tick', () => console.log('Tick!'))