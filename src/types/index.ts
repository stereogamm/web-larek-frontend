//интерфейс для данных товара
export interface IItem {
    category: string;
    title: string;
    image: string;
    price: number | null;
    description: string;
    id: string;
}
//интерфейс для данных пользователя
export interface IUserData {
    adress: string;
    email: string;
    phone: string;
    payment: string;
    getUserData(): IUserData;
    checkUserInfoValidation(): boolean;
}
//интерфейс для данных заказа
export interface IOrder {
    email: string;
    phone: string;
    address: string;
    payment: string;
    items: IItem[];
    total: number | null;
}

//интерфейс корзины товаров
export interface IBasket {
    items: IItem[];
    total: number | null;
    resetBasket(): void; //очищение данных после успешного заказа
}

//интерфейс открытой карточки товара для просмотра
export interface IExploreItem {
    items: IItem[];
    preview: string | null;
}

//интерфейс каталогa товаров
export interface IListItem {
    items: IItem[]; //массив карточек
    preview: string | null; //id открытой карточки
    addItemToBasket(item: string, payload: Function | null): void; //добавляем товар по id в корзину
    deleteItemFromBasket(item: string, payload: Function | null): void; //удаляем товар по id из корзины
    showOneItem(item: string): void; //открываем карточку для просмотра по id 
    getItems(): IItem[]; //получаем массив карточек с сервера
    saveItems(): IItem[]; //сохраняем массив карточек
}

//тип данных для модального окна с выбором способа оплаты
export type IPaymentPopup = Pick<IUserData, 'adress'>;

//тип данных для модального окна с данными пользователя
export type IDataUserPopup = Pick<IUserData, 'email' | 'phone'>;

//тип данных для модального окна успешного завершения заказа
export type IOrderSuccessPopup = Pick<IOrder, 'total'>;

//тип данных для отображения карточки товара в корзине
export type IPopupItemInBacket = Pick<IItem, 'title' | 'price'>

