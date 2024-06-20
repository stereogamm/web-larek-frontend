import { IEvents } from '../components/base/events'

//интерфейс данных 1 товара
export interface IItem {
    category: string;
    title: string;
    image: string;
    price: number | null;
    description: string;
    id: string;
}

//интерфейс данных 1 товара в корзине
// export interface IItemInBasket extends IItem{
//     inBasket: boolean;
// }

//интерфейс  данных пользователя
// export interface IUserData {
//     adress: string;
//     email: string;
//     phone: string;
//     payment: string;
//     getUserData(): IUserData;
//     checkUserInfoValidation(): boolean;
// }

// интерфейс состояния приложения 
export interface IDataHandler {
    productList: IItem[];
    basket: IItem[];
    order: IOrder;
    preview: string | null; //id открытой карточки
    saveProductList(items : IItem[]): void;// сохранение списка продуктов, полученных с сервера
    addItemToBasket(item: string, payload: Function | null): void; //добавляем товар по id в корзину
    deleteItemFromBasket(item: string, payload: Function | null): void; //удаляем товар по id из корзины
    resetBasket(): void; //очищение данных после успешного заказа
    showOneItem(items: IItem[], id: string): object; //открываем карточку для просмотра по id 
    getTotalSum(): number; //общая сумма товаров в корзине/общая стоимость заказа
}
//интерфейс для данных заказа
export interface IOrder {
    email: string;
    phone: string;
    address: string;
    payment: string;
    items: string[];
    total: number | null;
}

//интерфейс результата заказа 
export interface IOrderResult {
    id: string;
    total: number | null; 
}

//интерфейс для валидации ошибок 
export type IFormErrors = Partial<Record<keyof IOrder, string>>;

//тип данных для модального окна с выбором способа оплаты
// export type IPaymentPopup = Pick<IUserData, 'adress'>;

// //тип данных для модального окна с данными пользователя
// export type IDataUserPopup = Pick<IUserData, 'email' | 'phone'>;

export type ValidateAdress = Pick<IOrder,  'address' | 'payment'>

export type ValidatePhone = Pick<IOrder, 'email' | 'phone' >

//тип данных для модального окна успешного завершения заказа
export type OrderSuccessPopup = Pick<IOrder, 'total'>;

//тип данных для отображения карточки товара в корзине
export type PopupItemInBasket = Pick<IItem, 'title' | 'price'>


//типы данных для ИНТЕРФЕЙСА ПРЕДСТАВЛЕНИЯ

//*Абстрактный!* класс  служит шаблоном для создания компонентов, которые будут работать с элементами DOM. 
// export interface Component {
//     toggleClass(element: HTMLElement, className: string, force?: boolean): void;
//     setText(element: HTMLElement, value: unknown): void;
//     setDisabled(element: HTMLElement, state: boolean): void;
//     setHidden(element: HTMLElement): void;
//     setVisible(element: HTMLElement): void;
//     render(): HTMLElement;
// }

// //Отвечает за отображение карточек на главной странице, в модальном окне просмотра карточки, в корзине. 
// export interface Card extends Component {
//     setData(cardData: IItem): void;
//     getCard(card: object): HTMLElement;
//     getIdCard(card: object): string;
// }

// //*ОБЩИЙ* класс модального окна.
// export interface ModalPopUp {
//     modal: HTMLElement;
//     event: IEvents; 
//     openPopupWindow(): void;
//     closePopupWindow(): void;
//     addContentToPopupWindow(template: HTMLElement): void;
// }
 
// //Расширяет класс `ModalPopUp`. Отвечает за отображениие выбранных товаров в корзине
// export interface BasketPopUp extends ModalPopUp {
//     basketList: HTMLElement;
//     submitButton: HTMLButtonElement;
//     totalSum: HTMLElement;
//     showCards(card: HTMLElement): void;
// }

// //Расширяет класс `ModalPopUp`. Отвечает за работу с полями ввода формы. 
// export interface FormsPopUp extends ModalPopUp {
//     submitButton: HTMLButtonElement;
//     formName: string;
//     form: HTMLElement;
//     inputs: [];
//     errors: Record<string, HTMLElement>;
//     setValid(isValid: boolean): void;
//     getInputValues(): Record<string, string>;
//     setError(data: { field: string, value: string, validInformation: string }): void;
//     get (form: HTMLElement): HTMLElement;
// }

// //Расширяет класс `ModalPopUp`. Отвечает за отображение модального окна после успешного завершения заказа. 
// export interface SucessOrderPopup extends ModalPopUp {
//     submitButton: HTMLElement;
//     totalSum: HTMLElement;
//     goBackToMainPage(): void;
// }