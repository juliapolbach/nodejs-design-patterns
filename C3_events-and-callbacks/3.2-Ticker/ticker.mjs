// Write a function that accepts a number and a callback as the arguments.
// The function will return an EventEmitter that emits an event called tick
// every 50 milliseconds until the number of milliseconds is passed from the
// invocation of the function. The function will also call the callback when
// the number of milliseconds has passed, providing, as the result, the total
// count of tick events emitted. Hint: you can use setTimeout() to schedule
// another setTimeout() recursively.
import { EventEmitter } from 'events'

function ticker(ms, cb) {
        const emitter = new EventEmitter()
        let count = 0
        const endTime = Date.now() + ms

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