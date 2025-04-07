// 4.1 File concatenation: Write the implementation of concatFiles(),
// a callback-style function that takes two or more paths to text files in the filesystem and a destination file.
// function must copy the contents of every source file into the destination file,
// respecting the order of the files, as provided by the arguments list. For instance, given two files,
// if the first file contains foo and the second file contains bar, the function should write foobar
// (and not barfoo) in the destination file.
import fs from 'fs'

function concatFiles(destination, cb, ...files) {
        resetDestinationFile(destination, (err) => {
                if (err) return cb(err)
                appendContent(destination, files, (err, data) => { return cb(err, data) })

        })
}

function resetDestinationFile(destination, cb) {
        if (fs.existsSync(destination)) {
                fs.unlink(destination, (err, data) => { return err ? cb(err) : cb(null, data) })
        } else {
                return cb(null)
        }
}

function appendContent(destination, files, cb) {
        for (const file of files) {
                try {
                        fs.appendFileSync(destination, fs.readFileSync(file, 'utf-8'))
                } catch (err) {
                        return cb(err)
                }
        }
        fs.readFile(destination, (err, data) => {
                if (err) return cb(err)
                return cb(null, data)
        }
        )
}

concatFiles('./destination-file.txt', (err, data) => {
        if (err) {
                console.error(err)
        } else {
                console.log(`Appended content: ${data.toString().replace(/(\r\n|\n|\r)/gm, " ")}`)
        }
}, './files-to-concat/foo.txt', './files-to-concat/bar.txt', './files-to-concat/baz.txt')