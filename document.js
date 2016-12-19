const fs = require('fs');
const yaml = require('yaml');
const MarkdownIt = require('markdown-it');
md = new MarkdownIt();

function parseCallout(fileContent, index) {
  let size = fileContent.indexOf('[/block]', index) - index;
  let json = fileContent.splice(index + 1, size - 1).join('');

  try {
    json = JSON.parse(json);
  } catch (e) {
    console.log(json);
    console.error(e);

    throw (e);
  }

  return `<div class="alert alert-${json.type}" role="alert">
    ${json.title}
  </div>`;
}

function parseImage(fileContent, index) {
  let size = fileContent.indexOf('[/block]', index) - index;
  let json = fileContent.splice(index + 1, size - 1).join('');

  try {
    json = JSON.parse(json);
  } catch (e) {
    console.log(json);
    console.error(e);

    throw (e);
  }

  let output = '';
  json.images.forEach((imageData) => {
    if (!imageData.length) {
      return ;
    }

    let image = {
      url: imageData.image[0],
      name: imageData.image[1],
      heigh: imageData.image[2],
      width: imageData.image[3],
      color: imageData.image[4]
    };

    output += `<img src="${image.url}">`;
  });

  return output;
}

function parseTitle(fileContent, index) {
  let data = fileContent.splice(index + 1, 2).join('');
  let output = '';

  let variables = yaml.eval(data);
  output += '<div class="page-title"><h1>' + variables.title + '</h1> <p class="lead">' + variables.excerpt + '</p></div><hr>';

  return output;
}

module.exports = function(fileContent) {

  let output = "";
  let lineNbr = 0;

  while (lineNbr != fileContent.length) {

    let line = fileContent[lineNbr];

    if (line === '[block:callout]') {
      output += parseCallout(fileContent, lineNbr);
      lineNbr++;
    } else if (line === '[block:image]') {
      output += parseImage(fileContent, lineNbr);
      lineNbr++;
    } else if (lineNbr === 0 && line === '---') {
      output += parseTitle(fileContent, lineNbr);
      lineNbr++;
    } else {
      output += md.render(line);
    }

    lineNbr++;
  };

  return output;
};
