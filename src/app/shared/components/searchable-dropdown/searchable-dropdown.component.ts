import { Component, Input, forwardRef, HostListener, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-searchable-dropdown',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './searchable-dropdown.component.html',
    styleUrls: ['./searchable-dropdown.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SearchableDropdownComponent),
            multi: true
        }
    ]
})
export class SearchableDropdownComponent implements ControlValueAccessor {
    @Input() options: any[] = [];
    @Input() placeholder: string = 'Select an option';
    @Input() inputId: string = '';
    @Input() optionLabel: string = 'label'; // Property to display
    @Input() optionValue: string = 'value'; // Property to use as value (optional, if not provided, uses whole object or mapped value logic below)

    // If options are simple strings, handle that too.
    @Input() isSimpleStringArray: boolean = false;

    @Output() selectionChange = new EventEmitter<any>();

    @ViewChild('inputElement') inputElement!: ElementRef;

    value: any = '';
    inputValue: string = '';
    filteredOptions: any[] = [];
    showDropdown: boolean = false;
    disabled: boolean = false;

    onChange: any = () => { };
    onTouched: any = () => { };

    constructor(private elementRef: ElementRef) { }

    @HostListener('document:click', ['$event'])
    clickout(event: Event) {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.closeDropdown();
        }
    }

    writeValue(value: any): void {
        this.value = value;
        this.setInputValue(value);
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    setInputValue(value: any) {
        if (value) {
            if (this.isSimpleStringArray) {
                this.inputValue = value;
            } else {
                // Find option object that matches the value
                // If optionValue is provided, we expect value to be that property.
                // If optionValue is NOT provided or empty, we expect value to be the object itself, but here we usually store primitive IDs or strings in forms.
                // Let's assume typical usage: value is a string/ID, options are objects.
                const selectedOption = this.options.find(opt => {
                    // If optionValue is specified, compare property
                    // e.g. optionValue="id", value=1. opt.id === 1
                    if (this.optionValue && opt[this.optionValue] !== undefined) {
                        return opt[this.optionValue] === value;
                    }
                    // Fallback: compare whole object or simple string
                    return opt === value;
                });

                if (selectedOption) {
                    this.inputValue = selectedOption[this.optionLabel];
                } else if (typeof value === 'string') {
                    // Case where value might be just the string name itself (like in our Consignataria case where we use the name as value)
                    this.inputValue = value;
                }
            }
        } else {
            this.inputValue = '';
        }
    }


    onInput(event: any) {
        const value = event.target.value;
        this.inputValue = value;
        this.filterOptions(value);
        this.showDropdown = true;

        // If the user clears the input, we should probably emit null/empty
        if (!value) {
            this.value = null;
            this.onChange(this.value);
            this.selectionChange.emit(this.value);
        }
    }

    onFocus() {
        if (this.disabled) return;
        this.filterOptions(this.inputValue);
        this.showDropdown = true;
        this.onTouched();
    }

    filterOptions(query: string) {
        if (!query) {
            this.filteredOptions = this.options;
        } else {
            const lowerQuery = query.toLowerCase();
            this.filteredOptions = this.options.filter(opt => {
                if (this.isSimpleStringArray) {
                    return opt.toLowerCase().includes(lowerQuery);
                } else {
                    return opt[this.optionLabel].toLowerCase().includes(lowerQuery);
                }
            });
        }
    }

    selectOption(option: any) {
        if (this.isSimpleStringArray) {
            this.value = option;
            this.inputValue = option;
        } else {
            // If optionValue is specified, use that property, else use the object
            // However, looking at the previous implementation, we were just storing the name (string) in the form model.
            // So `optionValue` input is key here. In `nuevo-informe`, we used `est.nombre`. 
            // So parent checks: `optionValue="nombre"`.

            if (this.optionValue) {
                this.value = option[this.optionValue];
            } else {
                this.value = option;
            }
            this.inputValue = option[this.optionLabel];
        }

        this.onChange(this.value);
        this.selectionChange.emit(this.value);
        this.closeDropdown();
    }

    closeDropdown() {
        this.showDropdown = false;
        // On close, if we have a value but input text doesn't match a valid option label? 
        // Usually we reset input to current value's label logic.
        this.setInputValue(this.value);
    }
}
