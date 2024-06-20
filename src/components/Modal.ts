import { Component } from "./base/component";
import { IEvents } from "./base/events";
import { ensureElement } from "../utils/utils";


export interface IModalWindow {
    content: HTMLElement;
}

export class Modal extends Component<IModalWindow> {
    protected _content: HTMLElement;
    protected _closeButton: HTMLButtonElement;
    

    constructor(container: HTMLElement, protected events?: IEvents) {
        super(container)

        this._content = ensureElement<HTMLElement>('.modal__content');
        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close');
        

        this._closeButton.addEventListener('click', this.closeModalWindow.bind(this));
        this._content.addEventListener('click', (event) => event.stopPropagation());
        this.container.addEventListener('click', this.closeModalWindow.bind(this));
    }

    closeModalWindow() {
        this.container.classList.remove('modal_active');
        this.events.emit('modal:close');
        this.content = null;
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    openModalWindow() {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    render(data: IModalWindow): HTMLElement {
        super.render(data);
        this.openModalWindow();
        return this.container;
    }
}
