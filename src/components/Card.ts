import { IItem } from "../types";
import { Component } from "./base/component";
import { ensureElement } from "../utils/utils";

export interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICard {
    title: string;
    text?: string;
    image?: string;
    price: number | null;
    category?: string;
    itemNumber?: number;
    deleteButton?: string;
    id: string;
}

export class Card extends Component<ICard> {
    protected _title: HTMLElement;
    protected _text?: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _price: HTMLElement;
    protected _category?: HTMLElement;
    protected _button?: HTMLButtonElement;
    protected _itemNumber?: HTMLElement;
    protected _id: string;
    

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._text = container.querySelector(`.${blockName}__text`);
        this._image = container.querySelector(`.${blockName}__image`);
        this._price = container.querySelector(`.${blockName}__price`);
        this._category = container.querySelector(`.${blockName}__category`);
        this._button = container.querySelector(`.${blockName}__button`);
        this._itemNumber = container.querySelector(`.basket__item-index`);
       

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set title(value: string) {
        this.setText(this._title, value)
    }

    set text(value: string) {
        this.setText(this._text, value)
    }

    set image(value: string) {
        this.setImage(this._image, value)
    }

    set price(value: number | null) {
        if (value === null) {
            this.setDisabled(this._button, true);
            this.setText(this._price, 'Бесценно')
        } else {
            this.setText(this._price, `${value + ' ' + 'синапсов'}`);
        }
    }

    set category(value: string) {
        this.setText(this._category, value);
    }

    categoryColor(value: string) {
        this._category.classList.add(`${this.blockName}__category_${value}`);
    }

    set button(selected: boolean) {
        if(selected) {
            this.setText(this._button, 'Удалить')
        } else {
            this.setText(this._button, 'Добавить в корзину')
        }
    }

    // set id(value: string) {
    //     this.container.dataset.id = value;
    // }

    set id(id){
        this._id = id;
    }

    // get id(): string {
    //     return this.container.dataset.id || '';
    // }

    get id() {
        return this._id;
    }

    get title(): string {
        return this._title.textContent || '';
    }

    set itemNumber(value: number) {
        this._itemNumber.textContent = String(value);
    }

}

