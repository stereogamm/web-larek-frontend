import { IItem } from "../types";
import { Component } from "./base/component";
import { ensureElement } from "../utils/utils";
import { IEvents, EventEmitter } from "./base/events"
import { colorSetting } from "../utils/constants";

// export interface ICardActions {
//     onClick: (event: MouseEvent) => void;
// }

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
    protected event?: IEvents
    

    constructor(protected blockName: string, container: HTMLElement, event: IEvents) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._description = container.querySelector(`.${blockName}__text`);
        this._image = container.querySelector(`.${blockName}__image`);
        this._price = container.querySelector(`.${blockName}__price`);
        this._category = container.querySelector(`.${blockName}__category`);
        this._button = container.querySelector(`.card__button`);
        this._itemNumber = container.querySelector(`.basket__item-index`);
        this.event = event;

        this.container.addEventListener('click', () => {
            this.event.emit('card:selected', {id: this._id}) 
        })
        // console.log("card__button",this._button = container.querySelector(`.card__button`))
        // this._button.addEventListener('click', () => {
        //     this.event.emit('button:selected') 
        // })
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

    set button(selected: boolean) {
        if(selected) {
            this.setText(this._button, 'Удалить')
        } else {
            this.setText(this._button, 'Добавить в корзину')
        }
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

    get button(): HTMLButtonElement {
        if(this._button){
            return this._button
        }
        
    }
}

