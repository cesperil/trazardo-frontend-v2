const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/app/shared/components/searchable-dropdown/searchable-dropdown.component.ts');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
    /ngOnChanges\(changes: SimpleChanges\): void \{/,
    `ngOnChanges(changes: SimpleChanges): void {
        console.log('SearchableDropdown ngOnChanges:', Object.keys(changes), 'value:', this.value, 'inputValue:', this.inputValue, 'options length:', this.options ? this.options.length : 0);`
);

content = content.replace(
    /writeValue\(value: any\): void \{/,
    `writeValue(value: any): void {
        console.log('SearchableDropdown writeValue:', value, 'options length:', this.options ? this.options.length : 0);`
);

fs.writeFileSync(file, content);
