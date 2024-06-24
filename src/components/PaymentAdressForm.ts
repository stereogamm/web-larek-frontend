import { Form } from './Forms';
import { IEvents } from './base/events';
import type { TOrderForm } from '../types/index';


export class PaymentAddressForm extends Form<TOrderForm> {
    protected _card: HTMLButtonElement;
    protected _cash: HTMLButtonElement;
    protected _address: HTMLInputElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container, events);

        this._card = container.querySelector('button[name="card"]');
        this._cash = container.querySelector('button[name="cash"]');
        this._address = container.querySelector('input[name="address"]');

        this._cash.addEventListener('click', () => this.paymentSwitch('cash'))
        this._card.addEventListener('click', () => this.paymentSwitch('card'));
        this._address.addEventListener('input', () => this.events.emit('edit-adress:input'))
    }

    toggleCashPayment(value: boolean) {
        this.toggleClass(this._cash, 'button_alt-active', value);
    }

    toggleCardPayment(value: boolean) {
        this.toggleClass(this._card, 'button_alt-active', value);
    }

    paymentSwitch(payment: string) {
        const cashActive = this._cash.classList.contains('button_alt-active');
        const cardActive = this._cash.classList.contains('button_alt-active');

        if (payment === 'card') {
            this.toggleCardPayment(cardActive);
            this.toggleCashPayment(!cardActive);
            this.events.emit('paymentOnLine:selected')
        } else if(payment === 'cash') {
            this.toggleCashPayment(!cashActive);
            this.toggleCardPayment(cashActive);
            this.events.emit('paymentCash:selected')
        }
    }
    clearAddressField() {
        this._address.value = ''
    }
}