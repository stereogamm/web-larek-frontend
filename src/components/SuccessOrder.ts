import { Component } from "./base/component";
import { IEvents } from "./base/events";
import { ensureElement } from "../utils/utils";
import type { OrderSuccessPopup } from "../types/index";

export class SuccessOrder extends Component<OrderSuccessPopup> {
    protected _total: HTMLElement;
    protected _close: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._total = ensureElement<HTMLElement>('.order-success__description', this.container);
        this._close = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

        this._close.addEventListener('click', () => {
            this.events.emit('order:created')
        } )
    }

    set total(value: number) {
        this.setText(this._total, 'Списано' + ' ' + `${value}` + ' ' + 'синапсов') 
    }
}
