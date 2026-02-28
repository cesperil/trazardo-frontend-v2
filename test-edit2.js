const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/app/shared/components/searchable-dropdown/searchable-dropdown.component.ts');
let content = fs.readFileSync(file, 'utf8');

// Restore original just in case
content = content.replace(/console\.log\('SearchableDropdown setInputValue[^]*?this\.options\.length\);/, '');
content = content.replace(/console\.log\('Found selected option:', selectedOption\);/, '');
content = content.replace(/console\.log\('Set inputValue to:', this\.inputValue\);/, '');
fs.writeFileSync(file, content);
