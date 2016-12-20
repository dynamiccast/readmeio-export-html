const https = require('https');
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

  if (!json.body) {
    json.body = "";
  }
  return `<div class="alert alert-${json.type}" role="alert">
    <strong>${json.title}</strong><br />
    ${json.body}
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

    if (!imageData.image || !imageData.image.length) {
      return ;
    }

    let image = {
      url: imageData.image[0],
      name: imageData.image[1],
      heigh: imageData.image[2],
      width: imageData.image[3],
      color: imageData.image[4]
    };

    var file = fs.createWriteStream("images/" + image.name);
    var request = https.get(image.url, function(response) {
      response.pipe(file);
    });

    output += `<img class="page-image" src="images/${image.name}" width="${image.width}" height="${image.heigth}">`;
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

function parseApiHeader(fileContent, index) {
  let size = fileContent.indexOf('[/block]', index) - index;
  let json = fileContent.splice(index + 1, size - 1).join('');

  try {
    json = JSON.parse(json);
  } catch (e) {
    console.log(json);
    console.error(e);

    throw (e);
  }

  return `<h2>${json.title}</h2>`;
}

function parseMarkdown(line) {

  // Test for links
  line = line.replace('](doc:', '](#target=');

  return md.render(line);
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
    } else if (line === '[block:api-header]'){
      output += parseApiHeader(fileContent, lineNbr);
      lineNbr++;
    } else {
      output += parseMarkdown(line);
    }

    lineNbr++;
  };

  return output;
};
