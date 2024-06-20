// Базовый компонент
 
export abstract class Component<T> {
    protected constructor(protected readonly container: HTMLElement) {
        // Код в конструкторе исполняется ДО всех объявлений в дочернем классе
        //сохраняет переданный элемент и предоставляет его для дальнейшей работы
    }

    // Инструментарий для работы с DOM в дочерних компонентах

    // Переключить класс
    toggleClass(element: HTMLElement, className: string, force?: boolean) {
        element.classList.toggle(className, force);
    }

    // Установить текстовое содержимое
    protected setText(element: HTMLElement, value: unknown) {
        if (element) {
            element.textContent = String(value);
        }
    }

    // Сменить статус блокировки
    setDisabled(element: HTMLElement, state: boolean) {
        if (element) {
            if (state) {
                element.setAttribute('disabled', 'disabled');
            } else {
                element.removeAttribute('disabled');
            }
        }
    }

    // Скрыть элемент
    protected setHidden(element: HTMLElement) {
        element.style.display = 'none';
    }

    // Показать элемент
    protected setVisible(element: HTMLElement) {
        element.style.removeProperty('display');
    }

    // Установить изображение с альтернативным текстом
    protected setImage(element: HTMLImageElement, src: string, alt?: string) {
        if (element) {
            element.src = src;
            if (alt) {
                element.alt = alt;
            }
        }
    }

    // Метод для обновления данных экземпляра класса и возврата HTML-элемента. Object.assign(this as object, data ?? {}) копирует свойства из data в текущий объект, обновляя его. Затем возвращается контейнер container.
    render(data?: Partial<T>): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.container;
    }
}