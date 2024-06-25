import { IItem } from "../types";
import { Component } from "./base/component";
import { ensureElement } from "../utils/utils";
import { IEvents } from "./base/events"
import { colorSetting } from "../utils/constants";


export interface ICard {
    title: string;
    description?: string;
    image?: string;
    price: number | null;
    category?: string;
    itemNumber?: number;
    deleteButton?: string;
    id: string;
}

export class Card extends Component<ICard> {
    protected _title: HTMLElement;
    protected _description?: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _price: HTMLElement;
    protected _category?: HTMLElement;
    protected _button: HTMLButtonElement;
    protected _itemNumber?: HTMLElement;
    protected _id: string;
    protected event?: IEvents;
    protected _deleteButton?: HTMLButtonElement;
    

    constructor(protected blockName: string, container: HTMLElement, event: IEvents) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._description = container.querySelector(`.${blockName}__text`);
        this._image = container.querySelector(`.${blockName}__image`);
        this._price = container.querySelector(`.${blockName}__price`);
        this._category = container.querySelector(`.${blockName}__category`);
        this._button = container.querySelector(`.${blockName}__button`);
        this._itemNumber = container.querySelector(`.basket__item-index`);
        this._deleteButton = container.querySelector(`.basket__item-delete`);
        this.event = event;

        // if (this._button) {
        //     this._button.addEventListener('click', () => {
        //         this.event.emit('item:updateBasket', {id: this._id});
        //     });
        // } else if (this._deleteButton) {
        //     this._deleteButton.addEventListener('click', () => {
        //         this.event.emit('item:rmFromBasket', {id: this._id});
        //     });
        // } else {
        //     this.container.addEventListener('click', () => {
        //         this.event.emit('card:selected', {id: this._id});
        //     });
        // }

        if (this._button) {
            if (this._deleteButton) {
                this._button.addEventListener('click', () => {
                    this.event.emit('item:rmFromBasket', { id: this.id });
                });
            } else {
                this._button.addEventListener('click', () => {
                    this.event.emit('item:updateBasket', { id: this._id });
                });
            }
        } else {
            this.container.addEventListener('click', () => {
                this.event.emit('card:selected', { id: this._id });
            });
        }
    
    }

    set title(value: string) {
        this.setText(this._title, value)
    }

    set description(value: string) {
        this.setText(this._description, value)
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
        this.categoryColor(colorSetting[value as keyof typeof colorSetting]);
        this.setText(this._category, value);
    }

    categoryColor(value: string) {
        this._category.classList.add(`${this.blockName}__category_${value}`);
    }

    set id(id){
        this._id = id;
    }

    get id() {
        return this._id;
    }

    get title(): string {
        return this._title.textContent || '';
    }

    set itemNumber(value: number) {
        this._itemNumber.textContent = String(value);
    }

    get cardButton(): HTMLButtonElement {
        if(this._button){
            return this._button
        } else {
            console.log('error')
        }
    }

    set textButton(value: string) {
        if (this._button) {
            this.setText(this._button, value)
        }
    }
}

