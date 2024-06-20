import { Form } from './Forms';
import { IEvents } from './base/events';
import type { ValidateAdress } from '../types/index';
import { ensureElement } from '../utils/utils';


export class PaymentAddressForm extends Form<ValidateAdress> {
    protected _card: HTMLButtonElement;
    protected _cash: HTMLButtonElement;
    protected _address: HTMLInputElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container, events);

        this._card = container.querySelector('button[name="card"]');
        this._cash = container.querySelector('button[name="cash"]');
        this._address = ensureElement<HTMLInputElement>(".form__input");

        this._card.addEventListener('click', () => this.events.emit('card:selected'));
        this._cash.addEventListener('click', () => this.events.emit('cash:selected'));
        this._address.addEventListener('input', () => this.events.emit('edit-adress:input'))
    }

    get address(): string {
        return this._address.value;
    }

    set address(value: string) {
        this._address.value = value;
    }

    clearAddressField() {
        this._address.value = ''
    }
}