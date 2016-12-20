const fs = require('fs');
const os = require('os');
const path = require('path');
const _ = require('lodash');

const parseDocument = require('./document');

let menu = {};
let content = '';

var walkDir = function(dir, submenu) {
  let files = fs.readdirSync(dir);

  files.forEach(function (file) {
    if (fs.statSync(dir + file).isDirectory()) {
      let newSubmenu = submenu[file] = [];
      return walkDir(dir + file + '/', newSubmenu);
    }
    else {
      if (path.extname(file) === '.md') {
        console.info('Currently on ' + dir + file);
        let fileContent = fs.readFileSync(dir + file).toString().split(os.EOL);
        let output = parseDocument(fileContent);
        let fileName = path.basename(file, '.md');

        submenu.push(fileName);
        content += '<div id="' + fileName + '" class="doc-page">' + output + '</div>';
      }
    }
  });
};

var generateMenu = function(menu) {
  let output = '<ul class="nav navbar-nav">';

  for (var key in menu) {
    if (menu.hasOwnProperty(key)) {
      output += '<h4 class="menu-title">' + _.upperCase(key) + '</h4>';
      menu[key].forEach(function(menuItem) {
        output += '<li class="nav-item"><a class="nav-link" href="#target=' + menuItem +'">' + _.capitalize(_.lowerCase(menuItem)) + '</a></li>';
      });
    }
  }
  output += '</ul>';
  return output;
}

walkDir('./export/v2.2.0/', menu);

let indexContent = fs.readFileSync('index.html').toString();
indexContent = indexContent.replace('{{placeholder-menu}}', generateMenu(menu));
indexContent = indexContent.replace('{{placeholder-content}}', content);
fs.writeFileSync('doc.html', indexContent);
