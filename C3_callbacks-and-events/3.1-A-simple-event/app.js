import { FindRegex } from "./FindRegex.mjs";

const regex = process.argv[2]
const finder = new FindRegex(regex)

finder
        .addFile(process.argv[3])
        .find()
        .on('started', files => console.log(`Searching "${regex}" on this files: ${files}`))
        .on('found', file => console.log('Found on this files: ', file))