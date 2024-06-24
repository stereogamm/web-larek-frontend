import { Form } from './Forms';
import { IEvents } from './base/events';
import type { TOrderForm  } from  '../types/index';

export class ContactsForm extends Form<TOrderForm> {
    protected _email: HTMLInputElement;
    protected _phone: HTMLInputElement;

    constructor (protected container: HTMLFormElement, protected events: IEvents) {
        super(container, events);

        this._email = container.querySelector('input[name="phone"]');
        this._phone = container.querySelector('input[name="email"]');

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