// Write listNestedFiles(), a callback-style function that takes,
// as the input, the path to a directory in the local filesystem and that
// asynchronously iterates over all the subdirectories to eventually return
// a list of all the files discovered. Here is what the signature of the function
// should look like:  
// function listNestedFiles (dir, cb) { /* ... */ }
// Bonus points if you manage to avoid callback hell. 
// Feel free to create additional helper functions if needed.

import fs from 'fs'
const OUTPUT_FILE = 'list.txt'

function listNestedFiles(dir, cb) {
        if (!fs.existsSync(dir)) return cb(new Error(`Directory doesn't exists: "${dir}"`))
        if (fs.existsSync(OUTPUT_FILE)) fs.unlink(OUTPUT_FILE, (err) => { if (err) return cb(err) })

        appendFiles(dir, cb)

}

function appendFiles(dir, cb) {
        fs.readdir(dir, 'utf-8', (err, files) => {
                if (err) console.error(err)
                fs.readdir(dir, { encoding: 'utf-8', recursive: true }, (err, files) => {
                        if (err) return cb(err)
                        cb(null, files)
                })
        })
}

listNestedFiles(process.argv[2], (err, data) => { err ? console.error(err) : console.log(data) })