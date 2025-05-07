// 3.4 Playing with errors: Modify the function created in exercise 3.3
// so that it produces an error if the timestamp at the moment of a tick
// (including the initial one that we added as part of exercise 3.3)
// is divisible by 5. Propagate the error using both the callback and the
// event emitter. Hint: use Date.now() to get the timestamp and the
// remainder (%) operator to check whether the timestamp is divisible by 5.

import { error } from 'console'
import { EventEmitter } from 'events'

const DIVISION_ERROR = Error(`Timestamp is divisible by 5.`)

function ticker(ms, cb) {
        const emitter = new EventEmitter()
        let count = 0
        const startTime = Date.now()
        const endTime = Date.now() + ms

        if (startTime % 5 === 0) {
                DIVISION_ERROR.cause = startTime
                process.nextTick(() => emitter.emit('error', DIVISION_ERROR))
                cb(DIVISION_ERROR, count)
                return emitter
        }

        process.nextTick(() => emitter.emit('tick'))
        count++

        tick(endTime, count, emitter, cb)
        return emitter
}

function tick(endTime, count, emitter, cb) {
        const currentTime = Date.now()
        if (currentTime >= endTime) {
                return cb(null, count)
        }

        if (currentTime % 5 === 0) {
                DIVISION_ERROR.cause = currentTime
                emitter.emit('error', DIVISION_ERROR)
                return cb(DIVISION_ERROR, count)
        }

        setTimeout(() => {
                emitter.emit('tick')
                count++
                tick(endTime, count, emitter, cb)
        }, 50)
}

ticker(300, (err, count) => {
        if (err) {
                console.error(err.message, err.cause, '(callback)')
                console.log(`Total count of ticks: ${count}`)
        } else {
                console.log(`Total count of ticks: ${count}`)
        }
})
        .on('tick', () => console.log('Tick!'))
        .on('error', (err) => {
                console.error(err.message, err.cause, '(emitter)')
        })