import { Form } from './Forms';
import { IEvents } from './base/events';
import type { ValidatePhone } from  '../types/index';

export class ContactsForm extends Form<ValidatePhone> {
    protected _email: HTMLInputElement;
    protected _phone: HTMLInputElement;

    constructor (protected container: HTMLFormElement, protected events: IEvents) {
        super(container, events);

        this._email = container.querySelector('text[name="email"]');
        this._phone = container.querySelector('text[name="phone"]');

        // this._email.addEventListener('input', () => this.events.emit('edit-email:input'));
        // this._phone.addEventListener('input', () => this.events.emit('edit-phone:input'));
    }

    get phone(): string {
        return this._phone.value;
    }

    set phone(value: string) {
        this._phone.value = value;
    }

    get email(): string {
       return this._email.value
    }

    set email(value: string) {
        this._email.value = value
    }

    clearContactsFormFields() {
        this._phone.value = '',
        this._email.value = ''
    }
}