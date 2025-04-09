// 4.3 Recursive find: Write recursiveFind(), a callback-style function
// that takes a path to a directory in the local filesystem and a keyword,
// as per the following signature:  function recursiveFind(dir, keyword, cb) { /* ... */ }
// The function must find all the text files within the given directory that contain
// the given keyword in the file contents. The list of matching files should be
// returned using the callback when the search is completed. If no matching file is found,
// the callback must be invoked with an empty array. As an example test case, if you have
// the files foo.txt, bar.txt, and baz.txt in myDir and the keyword 'batman' is contained
// in the files foo.txt and baz.txt, you should be able to run the following code:
// recursiveFind('myDir', 'batman', console.log) should print ['foo.txt', 'baz.txt']
// Bonus points if you make the search recursive (it looks for text files in any subdirectory
// as well). Extra bonus points if you manage to perform the search within different 
// files and subdirectories in parallel, but be careful to keep the number of parallel
// tasks under control!

import fs from 'fs'
import path from 'path'

/**
 * Recursively searches for text files containing a specific keyword
 * NOTE: This solution doesn't manage concurrency control
 * 
 * @param {string} dir - The directory to search in
 * @param {string} keyword - The keyword to search for in file contents
 * @param {number} nesting - Maximum depth for recursive search (0 means no recursion)
 * @param {function} cb - Callback function with signature (err, matches)
 *                        where matches is an array of file paths
 * @returns {void}
 */

const set = new Set()
export function recursiveFind(dir, keyword, nesting, cb) {
        const matches = []

        fs.readdir(dir, { encoding: 'utf-8' }, (err, files) => {
                if (err) return cb(err)
                processArray(files, dir, keyword, nesting, matches, (err) => {
                        if (err) return cb(err)
                        cb(null, matches)
                })
        })
}

function processArray(files, dir, keyword, nesting, matches, cb) {
        // If code reaches a terminating condition, use process.nextTick
        // instead of directly calling cb() to ensure callback is invoked
        // asynchronously, preventing potential issues with call stack
        // depth during recursive operations.  

        if (nesting === 0) {
                return process.nextTick(cb)
        }

        if (files.length === 0) {
                return process.nextTick(cb)
        }

        // The done() function allows us to invoke the final callback
        // only when all of them have completed their execution.

        let completed = 0
        let hasErrors = false

        function done(err) {
                if (err) {
                        hasErrors = true
                        return cb(err)
                }
                if (++completed === files.length && !hasErrors) {
                        return cb()
                }
        }

        // Tasks starts all at once

        files.forEach(file => matchFile(dir, file, keyword, nesting - 1, matches, done))
}

function matchFile(dir, file, keyword, nesting, matches, cb) {
        const filePath = path.join(dir, file)

        // Avoids race conditions excluding the same file
        // from being processed multiple times
        if (set.has(filePath)) {
                return process.nextTick(cb())
        }

        set.add(filePath)

        fs.stat(filePath, (err, stat) => {
                if (err) return cb(err)

                if (stat.isDirectory()) {
                        recursiveFind(filePath, keyword, nesting, (err, subMatches) => {
                                if (err) return cb(err)
                                if (subMatches) {
                                        matches.push(...subMatches)
                                }
                                cb(null)
                        })
                } else if (stat.isFile() && path.extname(file).toLowerCase() === '.txt') {
                        fs.readFile(filePath, 'utf-8', (err, fileContent) => {
                                if (err) return cb(err)
                                if (fileContent.toLowerCase().includes(keyword.toLowerCase())) {
                                        matches.push(filePath)
                                }
                                cb(null)
                        })
                } else {
                        cb(null)
                }
        })
}


recursiveFind(process.argv[2], process.argv[3], process.argv[4], (err, matches) => err ? console.error(err) : console.log(matches))