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

// интерфейс состояния приложения 
export interface IDataHandler {
    productList: IItem[];
    basket: IItem[];
    order: IOrder;
    preview: string; //id открытой карточки
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

//интерфейс полей формы 
export type TOrderForm = Pick<IOrder,  'address' | 'payment' | 'email' | 'phone'>

//тип данных для модального окна успешного завершения заказа
export type OrderSuccessPopup = Pick<IOrder, 'total'>;


