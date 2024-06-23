import { ensureElement, createElement,  } from "../utils/utils";
import { Component } from "./base/component";
import { IEvents } from "./base/events";


interface IBasket {
    items: HTMLElement[];
    total: number;
}

export class Basket extends Component<IBasket> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLElement;
  
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
  
        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = this.container.querySelector('.basket__price');
        this._button = this.container.querySelector('.basket__button');
  
        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('orderItems:added');
            });
        }
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
            this.setDisabled(this._button, false);
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'В корзине пока нет выбранных товаров'
            }));
            this.setDisabled(this._button, true);
        }
    }

    set total(total: number) {
        this.setText(this._total, `${(total)} синапсов`);
    }
}