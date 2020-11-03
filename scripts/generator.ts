
const fs = require('fs-extra');

const param: string = process.argv[2];
// Check if required parameter is provided
if(!param) {
  console.error('You must specify new component name!')
  process.exit(1);
}


const dir: string = `./src/components/${param}`;
const files: Array<string> = [
  `${param}.ts`,
  `${param}.scss`
];
const templates: Array<string> = [
  `./scripts/templates/index.ts`,
  `./scripts/templates/style.scss`
];



const findAll = (search: string): RegExp => new RegExp(search, 'g');


// Create folder for component code
fs.ensureDir(dir)
  .then((): void => {
    console.log(`1. Created folder ${dir}...`);
  })
  .catch((err: Error): void => {
    console.error(err);
  })

// Create files for component code
Promise.all(
  templates.map((e: string): any => fs.readFile(e, 'utf8'))
)
  .then((data: Array<string>): Array<string> => 
    data.map((e: string): string => e.replace(findAll('%%%'), param))
  )
  .then((data: Array<string>): Array<string> => 
    data.map((e: string,i: number): any => 
      fs.outputFile(`${dir}/${files[i]}`, data[i]))
  )
  .then((data: Array<string>): void => 
    console.log(`2. Created starter files...`)
  );
