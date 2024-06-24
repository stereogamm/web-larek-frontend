# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами 
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей 
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

# Описание интерфейсов данных и типов данных, используемых в приложении
```

интерфейс для данных товара
export interface IItem {
    category: string;
    title: string;
    image: string;
    price: number | null;
    description: string;
    id: string;
}
```
```

интерфейс состояния приложения 
export interface IDataHandler {
    productList: IItem[];
    basket: IItem[];
    order: IOrder;
    preview: string; id открытой карточки
    saveProductList(items : IItem[]): void;  сохранение списка продуктов, полученных с сервера
    addItemToBasket(item: string, payload: Function | null): void;  добавляем товар по id в корзину
    deleteItemFromBasket(item: string, payload: Function | null): void;  удаляем товар по id из корзины
    resetBasket(): void;  очищение данных после успешного заказа
    showOneItem(items: IItem[], id: string): object;  открываем карточку для просмотра по id 
    getTotalSum(): number; общая сумма товаров в корзине/общая стоимость заказа
}
```
```

интерфейс для данных заказа
interface IOrder {
    email: string;
    phone: string;
    address: string;
    payment: string;
    items: string[];
    total: number | null;
}
```
```
интерфейс экземпляра класса Card
interface ICard {
    title: string;
    description?: string;
    image?: string;
    price: number | null;
    category?: string;
    itemNumber?: number;
    deleteButton?: string;
    id: string;
}
```
```

интерфейс корзины товаров
interface IBacket {
    items: IItem[];
    total: number | null;
    resetBasket(): void; очищение данных после успешного заказа
}
```
```

интерфейс результата заказа 
export interface IOrderResult {
    id: string;
    total: number | null; 
}
```
```

интерфейс для валидации ошибок 
export type IFormErrors = Partial<Record<keyof IOrder, string>>;
```
```

интерфейс полей формы 
export type TOrderForm = Pick<IOrder,  'address' | 'payment' | 'email' | 'phone'>
```
```

тип данных для модального окна успешного завершения заказа
export type OrderSuccessPopup = Pick<IOrder, 'total'>;
```
```

интерфейс экземпляра класса Api
interface IApi {
    getItems: () => Promise<IItem[]>;
    createOrder: (order: IOrder) => Promise<IOrderResult>;
}
```
```

типы для экземпляра класса эвент эмиттера
type EventName = string | RegExp;
type Subscriber = Function;
type EmitterEvent = {
    eventName: string,
    data: unknown
}
```

```

интерфейс экземпляра класса корзины
interface IBasket {
    items: HTMLElement[];
    total: number;
}
```

```

IInputsValidate {
    valid: boolean;
    errors: string[];
}
```

```

интерфейс экземпляра класса страницы
IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}
```


# Архитектура приложения

## Приложение реализует разделение на слои в парадигме MVP 

- *Слой данных* - отвечает за хранение и работу с данными - `Models`
- *Слой отображения* - отвечает за отображение данных на странице - `View`
- *Связующий слой* с доступом к моделям и вью - `Presenter` 

# Базовый код

### Базовый класс `Api`

 Реализует логику работы с сервером. Содержит конструктор для создания объекта со свойствами базового url адреса и хэдеров запроса.

- `constructor(baseUrl: string, options: RequestInit = {})`- принимает базовый URL и глобальные опции для всех запросов(опционально).

 Также содержит `get` и `post` методы, которые отвечают за формирование и асинхронную отправку запроса и вызов защищенного метода `handleResponse`. Метод `handleResponse` асинхронно преобразовывает ответ сервера в формат json в случае успеха и возвращает его, в случае неуспеха - возвращает значение поля statusText  


 ### Базовый класс `Component`

 Представляет собой `абстрактный` базовый класс для создания компонентов, которые работают с DOM-элементами. Он предоставляет ряд методов для управления элементами на странице. Подклассы могут использовать методы этого класса для управления элементами DOM.

 Конструктор принимает container и сохраняет его. Конструктор  защищен, что означает, что нельзя создавать экземпляры этого класса напрямую, но его можно вызывать из подклассов.

 HTML элемент передается в конструктор и сохраняется в приватном поле container. Это позволяет дочерним классам работать с этим элементом.

 Содержит методы: 

- `toggleClass` Метод для переключения класса у элемента. Использует classList.toggle для добавления или удаления класса в зависимости от значения force.
- `setText` Устанавливает текстовое содержимое элемента. Преобразует value в строку и назначает его textContent.
- `setDisabled` Устанавливает или снимает атрибут disabled у элемента в зависимости от значения state.
- `setHidden`Скрывает элемент, устанавливая его стиль display в none.
- `setVisible` Показывает элемент, удаляя свойство display.
- `setImage` Устанавливает источник изображения и альтернативный текст.
- `render` Обновляет данные экземпляра класса, копируя свойства из data в текущий объект с использованием Object.assign. Затем возвращает контейнер container.


### Базовый класс  `EventEmitter`

Класс представляет собой систему управления событиями, позволяющую добавлять, удалять и вызывать обработчики событий.\
Конструктор создает пустой объект `Map`, который будет хранить события и их подписчиков.\

- `constructor()={}`

Класс используется в презентере для обработки событий и в слоях приложения для генерации событий. 
- Метод `on` - добавляет обработчик для конкретного события.
- Метод `off` - удаляет обработчик для конкретного события.
- Метод `emit` - вызывает все обработчики для указанного события, передавая им данные.
- Метод `onAll` - добавляет обработчик, который будет вызываться для всех событий.
- Метод `offAll` - удаляет все обработчики для всех событий.
- Метод `trigger` - создает функцию-триггер, которая при вызове инициирует событие с указанным именем и данными.

### Базовый класс `Model`

Этот класс предоставляет основу для создания моделей, которые могут управлять событиями, облегчая работу с изменениями данных и их синхронизацией. Абстрактный класс не может быть непосредственно инстанцирован, и предполагается, что от него будут наследоваться другие классы.

Содержит конструктор, принимающий объект data с частичными данными типа T и объект events, который отвечает за обработку событий.

- `Object.assign(this, data)` Метод используется для копирования всех перечисляемых свойств из объекта data в текущий экземпляр (this)
- `emitChanges(event: string, payload?: object)` Метод, который уведомляет о том, что модель изменилась, вызывая событие.

# Слой данных

### класс `DataHandler`

Отвечает за данные и логику работы с данными товаров\

Содержит поля:
- `productList: IItem[]`  список объектов карточек для отображения на главной\
- `basketList: IItem[]`   список объектов товаров корзины
- `preview: IItem` объект открытой карточки для превью     
- `total: number | null`  общая стоимость всех товаров
- `order: IOrder` = { объект заказа\
        `email: ,\`
        `phone: ,\`
        `address: ,\`
        `payment: ,\`
        `items: [,\`
        `total: \`
    };
- `formErrors: IFormErrors = {}` объект ошибок валидации формы

Методы класса для взаимодействия с данными: 

- `setProductList(items: IItem[])` присваивает полученные с сервера данные в ProductList
- `showOneItem(id: string)` возвращает объект открытой карточки для просмотра по id
- `addItemtoBasket(item: IItem)` добавление товара в корзину
- `removeItemFromBasket(id: string)` удаление товара из корзины
- `resetBasket()` очищает корзину
- `resetOrder()` очищает данные заказа после его успешного завершения
- `getTotalSum()` рассчитывает общую сумму всех товаров 
- `getCountBasketItems()` возвращает количество товаров в корзине для дальнейшего отображения счетчика на главной
- `validationOrderInfoIsChecked()` проверка на заполненность полей данными о способе оплаты и адресе
- `validationUserInfoIsChecked()` проверка на заполенность полей данными о емейле и телефоне
- `setOrder()` добавление id продукта в поле заказа
- `setPreview(id: string)`сохраняет в поле id открытой карточки
- `getPreview()` получает id открытой карточки
- `getBasketList()` получает список товаров корзины
- `setPaymentType (value: string)` сохраняет выбранный тип оплаты
- `get payment()` получает значение текущего способа оплаты
- `set _total` перезаписывает общую сумму товаров

# Слой представления 

Отвечает за отображение внутри DOM-элемента передаваемых в него данных

### класс `Basket`

Класс Basket расширяет базовый класс Component и отвечает за отображение списка товаров корзины 

Содержит поля: 
_list: HTMLElement; Список товаров в корзине\
_total: HTMLElement; Общее количество товаров в корзине\
_button:HTMLButtonElement;  Кнопка для оформления заказа\

Конструктор принимает HTMLElement и экземпляр класса эвент эмиттера

Методы класса: 

- `set items(items: HTMLElement[])` Устанавливает товары в корзине, заменяет содержимое списка товаров новыми элементами или сообщением об отсутствии товаров в корзине
- `set total(total: number)`  устанавливает общую сумму заказа 

### класс `Card` 

Отвечает за работу с данными для карточки товаров, расширяет базовый класс Component

Конструктор принимает название блока, контейнер и эклемпляр класса эвент эмиттера

Методы класса: 

- `set title(value: string)` устанавливает текст заголовка
- `set description(value: string)`  устанавливает текст описания
- `set image(value: string) `устанавливает URL изображения.
- `set price(value: number | null)` устанавливает цену. Если цена равна null, кнопка действия блокируется, и текст цены устанавливается в "Бесценно"
- `set category(value: string)` устанавливает категорию товара и добавляет соответствующий CSS класс
- `set id(id: string)` устанавливает идентификатор товара
- `set itemNumber(value: number) `устанавливает номер товара в корзине
- `set textButton(value: string)` устанавливает текст кнопки действия
- `get id()` возвращает идентификатор товара
- `get title()` возвращает текст заголовка товара
- `get cardButton()` возвращает кнопку действия, если она существует

### класс `ContactsForm` 

Класс наследуется от базового класса Form и предназначен для работы с формой контактных данных. Класс включает методы для управления значениями полей электронной почты и телефона, а также для их очистки.

constructor(protected container: HTMLFormElement, protected events: IEvents)

Вызывает конструктор базового класса Form, передавая контейнер формы и объект событий\
Инициализирует поля _email и _phone для хранения ссылок на соответствующие элементы ввода в форме\

Методы класса: 

- `get phone(): string `возвращает текущее значение поля телефона
- `set phone(value: string)` устанавливает новое значение для поля телефона
- `get email(): string` возвращает текущее значение поля электронной почты
- `set email(value: string)` устанавливает новое значение для поля электронной почты
- `clearContactsFormFields()` очищает значения полей телефона и электронной почты, устанавливая их пустыми строками


### класс `Form`

Класс наследуется от базового класса Component. Этот класс предназначен для управления формой и включает методы для обработки изменений ввода, управления состоянием формы и вывода ошибок.

constructor(protected container: HTMLFormElement, protected events: IEvents)

Конструктор принимает элемент формы и экземпляр эвент эмиттера\
Вызывает конструктор базового класса Component\
Инициализирует элементы _submit и _errors для хранения ссылки на кнопку отправки и контейнер ошибок в форме\
Добавляет обработчики событий для ввода и отправки формы\

Методы класса: 

- `protected onInputChange(field: keyof T, value: string)` вызывается при изменении ввода в форме, генерирует событие с именем в формате formName.fieldName:change, передавая измененное поле и его значение
- `set valid(isValid: boolean)` встанавливает состояние кнопки отправки (активна или неактивна) в зависимости от значения isValid
- `set errors(value: string)` устанавливает текстовое содержимое элемента ошибок
- `render(state: Partial<T> & IInputsValidate)` рендерит состояние формы, вызывает метод render базового класса Component и обновляет текущий объект значениями из state

### класс `Modal`

Класс наследуется от базового класса Component и предназначен для управления модальными окнами, включая их открытие, закрытие и изменение содержимого.

constructor(container: HTMLElement, protected events?: IEvents) 

Конструктор принимает элемент модального окна и экземпляр эвент эмиттера

Вызывает конструктор базового класса Component. Инициализирует элементы _content и _closeButton для хранения ссылки на содержимое модального окна и кнопку закрытия. Добавляет обработчики событий для закрытия модального окна при клике на кнопку закрытия, на контейнер модального окна (если клик был вне содержимого), и нажатии клавиши Escape.

Методы класса: 

- `closeModalWindow()` Удаляет класс modal_active с контейнера, скрывая модальное окно
- `set content(value: HTMLElement)` Заменяет содержимое _content новым значением value
- `openModalWindow()` Добавляет класс modal_active к контейнеру, показывая модальное окно
- `render(data: IModalWindow): HTMLElement` отвечает за рендер 

### класс `Page`

Класс наследуется от базового класса Component и управляет элементами на странице, такими как счетчик корзины, каталог товаров, обертка страницы и корзина\

constructor(container: HTMLElement, protected events: IEvents)

Конструктор принимает элемент и экземпляр эвент эмиттера, вызывает конструктор базового класса Component.
Инициализирует элементы _counter, _catalog, _wrapper и _basket, которые представляют счетчик корзины, каталог товаров, обертку страницы и корзину соответственно. Добавляет обработчик событий для элемента _basket, который при клике генерирует событие basketIs:opened

Методы класса: 

- `set catalog(items: HTMLElement[])` Заменяет содержимое элемента _catalog новыми элементами из массива items
- `set counter(value: number)` устанавливает значение элемента счктчика
- `set locked(value: boolean)` добавляет или удаляет класс page__wrapper_locked для элемента _wrapper в зависимости от значения value, блокируя страницу


### класс `PaymentAddressForm`

Класс расширяет функциональность базового класса Form для управления формой с выбором способа оплаты и вводом адреса. Этот класс включает обработку событий для кнопок выбора способа оплаты и поля ввода адреса, а также методы для переключения и стилизации кнопок.\

constructor(protected container: HTMLFormElement, protected events: IEvents)\

Конструктор принимает элемент и экземпляр эвент эмиттера. Вызывает конструктор базового класса Form. Инициализирует элементы _card, _cash и _address, представляющие кнопки для выбора оплаты картой и наличными, а также поле для ввода адреса. Добавляет обработчики событий для кнопок _card и _cash, которые переключают способ оплаты при клике. Добавляет обработчик события для поля _address, который генерирует событие при вводе текста\

Методы класса: 

- `toggleCashPayment(value: boolean)` Переключает класс button_alt-active для кнопки _cash в зависимости от значения value
- `toggleCardPayment(value: boolean)` Переключает класс button_alt-active для кнопки _card в зависимости от значения value
- `paymentSwitch(payment: string)` Определяет, какой способ оплаты выбран, и переключает соответствующие классы для кнопок _card и _cash и генерирует события paymentOnLine:selected или paymentCash:selected в зависимости от выбранного способа оплаты
- `clearAddressField()` Очищает значение поля _address

### класс `SuccessOrder`

Класс представляет собой компонент для отображения информации об успешно созданном заказе. Он расширяет функциональность базового класса Component и добавляет логику для отображения общей суммы заказа и закрытия попапа\ 

constructor(container: HTMLElement, protected events: IEvents)\

Конструктор принимает элемент и экземпляр эвент эмиттера. Вызывает конструктор базового класса Component с переданным контейнером. Инициализирует элементы _total и _close через функцию ensureElement, чтобы убедиться, что они присутствуют в DOM. Добавляет обработчик события клика на кнопку _close, который генерирует событие order:created через объект events.\

Метод класса: 
- `set total(value: number)` Устанавливает текстовое содержимое элемента _total с указанием общей суммы заказа, переданной в параметре value\


### класс `AppApi`

Наследуется от базового класса Api и реализует интерфейс IApi. Класс AppApi предназначен для взаимодействия с API и содержит методы для получения списка элементов и создания заказа.

- `getItems` Возвращает промис, который разрешается в массив объектов типа IItem
- `createOrder` Принимает объект типа IOrder и возвращает промис, который разрешается в объект типа IOrderResult

Конструктор принимает:
- `cdn` cтрока, представляющая URL до контента CDN 
- `baseUrl` Базовый URL для API
- `options` Опциональные настройки для запросов

Конструктор вызывает конструктор родительского класса Api, передавая baseUrl и options, и инициализирует поле cdn.

Методы класса: 

- `getItems` - Отправляет GET-запрос на путь /product/ и обрабатывает полученные данные. Возвращает промис, который разрешается в массив объектов типа IItem. Каждому элементу массива добавляется полный URL до изображения, используя свойство cdn
- `createOrder` - Отправляет POST-запрос с данными заказа на путь /order и возвращает промис, который разрешается в объект типа IOrderResult.


# Коммуникационный слой

Отвечает за взаимодействие с сервером\
Все взаимодействие строится на работе с событиями

получаем данные -> генерируем события -> выполняем действия\
данные в модели изменяются -> генерируем событие -> выполняем действия


## Взаимодействие компонентов

Код, описывающий взаимодействие слоя представления и слоя данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

*Список всех событий, которые могут генерироваться в системе:*\
*События изменения данных (генерируются классами моделями данных)*

- `itemsData:changed` - изменение массива карточек
- `itemsData:selected` - изменение открываемой в модальном окне карточки
- `basketData:changed` - изменение данных в корзине товаров
- `userData:changed` - изменение данных пользователя при заполнении формы
- `datapaymentform:opened` - добавление id продукта в поле заказа
- `order:ready` - формирование данных для заказа
- `preview:changed` - изменение данных в поле preview
- `paymentType:buttonSelected` - изменилось значение поля payment
- `Info: loaded` - произошла успешная загрузка серверных данных
- `item:addToBasket` - добавление товара в список корзины
- `item:rmFromPreorder` - удаление товара из списка корзины
- `orderItems:added` - добавление id выбранных товаров в заказ
- `paymentOnLine:selected` - выбран спосо оплаты картой
- `paymentCash:selected` -  выбран способ оплаты наличными
- `order:created` - успешный заказ


*События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)

- `card:selected` - клик по карточке на главной
- `basketIs:opened` - открытие модального окна со списком товаров при клике на иконку корзины на главной
- `item:updateBasket` - добавление/удаление товара при клике на кнопку в превью карточки
- `datapaymentform:opened` - открытие модального окна с формой оплаты
- `contacts:submit` - отправка заказа
- `formErrors:change` - событие валидации данных формы
- `modal:open` - модальное окно открыто
- `modal:close` - модальное окно закрыто