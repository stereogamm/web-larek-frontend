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

    // создаем метод для переключения модального окна, чтобы не передавать селектор и контейнер каждый раз
    // сразу по умолчанию указываем `true`, чтобы лишний раз не передавать при открытии
   _toggleModal(state: boolean = true) {
    this.toggleClass(this.container, 'modal_active', state);
}

    // Обработчик в виде стрелочного метода, чтобы не терять контекст `this`
    _handleEscape = (evt: KeyboardEvent) => {
        if (evt.key === 'Escape') {
            this.closeModalWindow();
    }
};

    closeModalWindow() {
        this._toggleModal(false); // закрываем
        // правильно удаляем обработчик при закрытии
        document.removeEventListener('keydown', this._handleEscape);
        this.content = null;
        this.events.emit('modal:close');
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    openModalWindow(){
        this._toggleModal(); // открываем
        // навешиваем обработчик при открытии
        document.addEventListener('keydown', this._handleEscape);
        this.events.emit('modal:open');
    }

    render(data: IModalWindow): HTMLElement {
        super.render(data);
        this.openModalWindow();
        return this.container;
    }
}

