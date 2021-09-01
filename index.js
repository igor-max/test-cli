#!/usr/bin/env node

const inquirer = require('inquirer'); // 用于与命令行交互
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');	// 用于解析ejs模板
const { Transform } = require('stream');	// 用于流式传输

inquirer.prompt([{
  type: 'input',
  name: 'name',
  message: 'file name?'
},
{
  type: 'input',
  name: 'param1',
  message: 'param1?'
}
])
  .then(anwsers => {
    // 1.根据用户输入：得到文件名和文件夹路径（用户命令路径）
    const fileName = anwsers.name;
    const param1 = anwsers.param1;
    const dirPath = process.cwd();
    // 2.得到模板文件路径
    const tmplPath = path.join(__dirname, 'template.txt');
    const filePath = path.join(dirPath, fileName + '.txt');
    // 3.读取模板文件内容，写入到新创建的文件
    const read = fs.createReadStream(tmplPath);
    const write = fs.createWriteStream(filePath);
    // 转换流：用于ejs模板解析
    const transformStream = new Transform({
      transform: (chunk, encoding, callback) => {
        const input = chunk.toString();// 模板内容
        const output = ejs.render(input, { param1 }); // 模板解析
        callback(null, output);
      }
    })
    read.pipe(transformStream).pipe(write);
  })