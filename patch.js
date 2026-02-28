const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/app/shared/components/searchable-dropdown/searchable-dropdown.component.ts');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
    /setInputValue\(value: any\) \{/,
    `setInputValue(value: any) {
        console.log('SearchableDropdown setInputValue called with value:', value, 'inputId:', this.inputId, 'options length:', this.options.length);`
);

content = content.replace(
    /if \(selectedOption\) \{/,
    `if (selectedOption) {
                    console.log('Found selected option:', selectedOption);`
);

content = content.replace(
    /this\.inputValue = selectedOption\[this\.optionLabel\];/,
    `this.inputValue = selectedOption[this.optionLabel];
                    console.log('Set inputValue to:', this.inputValue);`
);

fs.writeFileSync(file, content);
console.log('Patched component');
