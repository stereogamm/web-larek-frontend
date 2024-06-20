import './scss/styles.scss';
import { DataHandler } from './components/DataHandler';
import { EventEmitter } from './components/base/events'
import { AppApi} from './components/AppApi';
import { API_URL, CDN_URL, options, colorSetting} from './utils/constants';
import { Component } from './components/base/component';
import { Page } from './components/Page'
import { Card, ICardActions, ICard } from './components/Card';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/Modal';
import { Basket } from './components/Basket';
import { Form } from './components/Forms';
import { PaymentAddressForm } from './components/PaymentAdressForm';
import type { IItem, ValidateAdress } from './types/index';
import { ContactsForm } from './components/EmailPhoneForm';
import { SuccessOrder } from './components/SuccessOrder';


const events = new EventEmitter();

const api = new AppApi(CDN_URL, API_URL, options);
// ПОЛУЧЕНИЕ КАРТОЧЕК С СЕРВЕРА
const dataHandler = new DataHandler({}, events);

// Чтобы мониторить все события, для отладки
// events.onAll(({ eventName, data }) => {
//     console.log(eventName, data);
// })


const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');

const basket = ensureElement<HTMLTemplateElement>("#basket");
const cardInBasket = ensureElement<HTMLTemplateElement>("#card-basket");
const adressPaymentTemplate = ensureElement<HTMLTemplateElement>("#order");
const contactsFormTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successOrderTemplate = ensureElement<HTMLTemplateElement>('#success');


const basketComponent = new Basket(cloneTemplate(basket), events);
const paymentAddressForm = new PaymentAddressForm(cloneTemplate(adressPaymentTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsFormTemplate), events);


const modalContainer = ensureElement<HTMLElement>('.modal');
const gallery = document.querySelector('.gallery');

const page = new Page(document.body, events);
const modal = new Modal(modalContainer, events);


//Получение массива карточек с сервера 
api.getItems()
  .then((res) => {
    dataHandler.setProductList(res)
    events.emit('Info: loaded')
  })
  .catch((error) => {
    console.error('Error:', error);
  });


events.on('Info: loaded', () => {
    dataHandler.productList.forEach(item => {
        const card = new Card('card', cloneTemplate(cardTemplate), {
            onClick: () => events.emit('card:select', item)
        });
        const category: string = item.category
        card.categoryColor(colorSetting[item.category as keyof typeof colorSetting]);
        const catalog = card.render({
            title: item.title,
            image: item.image,
            price: item.price,
            text: item.description,
            category: item.category,
            id: item.id,
        });
        gallery.appendChild(catalog);
    })
})


// const testDataObject = {
//     "id": "b06cde61-912f-4663-9751-09956c0eed67",
//     "description": "Будет стоять над душой и не давать прокрастинировать.",
//     "image":"/Shell.svg",
//     "title": "Мамка-таймер",
//     "category": "кнопка",
//     "price": 999
// }

// const testDataArray =  {
//     "total": 10,
//     "items": [
//         {
//             "id": "854cef69-976d-4c2a-a18c-2aa45046c390",
//             "description": "Если планируете решать задачи в тренажёре, берите два.",
//             "image": "/5_Dots.svg",
//             "title": "+1 час в сутках",
//             "category": "софт-скил",
//             "price": 750
//         },
//         {
//             "id": "c101ab44-ed99-4a54-990d-47aa2bb4e7d9",
//             "description": "Лизните этот леденец, чтобы мгновенно запоминать и узнавать любой цветовой код CSS.",
//             "image": "/Shell.svg",
//             "title": "HEX-леденец",
//             "category": "другое",
//             "price": 1450
//         },
//         {
//             "id": "b06cde61-912f-4663-9751-09956c0eed67",
//             "description": "Будет стоять над душой и не давать прокрастинировать.",
//             "image": "/Asterisk_2.svg",
//             "title": "Мамка-таймер",
//             "category": "софт-скил",
//             "price": null
//         },
//         {
//             "id": "412bcf81-7e75-4e70-bdb9-d3c73c9803b7",
//             "description": "Откройте эти куки, чтобы узнать, какой фреймворк вы должны изучить дальше.",
//             "image": "/Soft_Flower.svg",
//             "title": "Фреймворк куки судьбы",
//             "category": "дополнительное",
//             "price": 2500
//         },
//         {
//             "id": "1c521d84-c48d-48fa-8cfb-9d911fa515fd",
//             "description": "Если орёт кот, нажмите кнопку.",
//             "image": "/mute-cat.svg",
//             "title": "Кнопка «Замьютить кота»",
//             "category": "кнопка",
//             "price": 2000
//         },
//         {
//             "id": "f3867296-45c7-4603-bd34-29cea3a061d5",
//             "description": "Чтобы научиться правильно называть модификаторы, без этого не обойтись.",
//             "image": "Pill.svg",
//             "title": "БЭМ-пилюлька",
//             "category": "другое",
//             "price": 1500
//         },
//         {
//             "id": "54df7dcb-1213-4b3c-ab61-92ed5f845535",
//             "description": "Измените локацию для поиска работы.",
//             "image": "/Polygon.svg",
//             "title": "Портативный телепорт",
//             "category": "другое",
//             "price": 100000
//         },
//         {
//             "id": "6a834fb8-350a-440c-ab55-d0e9b959b6e3",
//             "description": "Даст время для изучения React, ООП и бэкенда",
//             "image": "/Butterfly.svg",
//             "title": "Микровселенная в кармане",
//             "category": "другое",
//             "price": 750
//         },
//         {
//             "id": "48e86fc0-ca99-4e13-b164-b98d65928b53",
//             "description": "Очень полезный навык для фронтендера. Без шуток.",
//             "image": "Leaf.svg",
//             "title": "UI/UX-карандаш",
//             "category": "хард-скил",
//             "price": 10000
//         },
//         {
//             "id": "90973ae5-285c-4b6f-a6d0-65d1d760b102",
//             "description": "Сжимайте мячик, чтобы снизить стресс от тем по бэкенду.",
//             "image": "/Mithosis.svg",
//             "title": "Бэкенд-антистресс",
//             "category": "другое",
//             "price": 1000
//         }
//     ]
// }


//ТЕСТ МОДАЛЬНОГО ОКНА УСПЕШНОГО ЗАКАЗА 
// const successOrder = new SuccessOrder(cloneTemplate(successOrderTemplate),  {
//     onClick: () => {
//         modal.closeModalWindow();
//     }
// }) 

// modal.render({
//     content: successOrder.render({
//         total: 99
//     })
// })


//TECT МОДАЛЬНОГО ОКНА С ПОЛЕМ ТЕЛЕФОНА И ИМЕЙЛА
// modal.render({
//     content: contactsForm.render({
//         valid: true,
//         errors: []
//     })
// })




//ТЕСТ МОДАЛЬНОГО ОКНА С ФОРМОЙ СПОСОБА ОПЛАТЫ И ПОЛЕМ АДРЕСА
// modal.render({
//     content: paymentAddressForm.render({
//         address: '',
//         payment: '',
//         valid: true,
//         errors: []
//     })
// })



// ТЕСТ МОДАЛЬНОГО ОКНА с корзиной
// const basketArrayItems: HTMLElement[] = testDataArray.items.map(item => {
//    const basketCard = new Card('card', cloneTemplate(cardInBasket), actions);
//      return basketCard.render({
//        title: item.title,
//        price: item.price,
//        itemNumber: testDataArray.items.indexOf(item) +1
//    })
// });

// modal.render({ 
//         content: basketComponent.render({
//         items: basketArrayItems,
//         total: 400
//     })
// });
 

//ТЕСТ ПРЕВЬЮ КАРТОЧКИ ПО КЛИКУ 
events.on('card:select', () => {
    const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
    const card = new Card ('card', cloneTemplate(cardPreviewTemplate));

   
    const item = dataHandler.showOneItem('412bcf81-7e75-4e70-bdb9-d3c73c9803b7');
    console.log("one item", item)
    // const category: string = card.category
    // card.categoryColor(colorSetting[item.category as keyof typeof colorSetting]);
    const cardElement = card.render({
        text: item.description,
        image: item.image,
        title: item.title,
        category: item.category,
        price: item.price,
        id: item.id
    })
    modal.render({content: cardElement});
})


// ТЕСТ ВЫВОДА КАРТОЧЕК НА ГЛАВНОЙ СТРАНИЦЕ
//выбрали элементы для отображения карточки

// testDataArray.items.forEach(item => {
//     const card = new Card('card', cloneTemplate(cardTemplate), actions);
//     const category: string = item.category
//     card.categoryColor(colorSetting[item.category as keyof typeof colorSetting]);
//     const catalog = card.render({
//         title: item.title,
//         image: item.image,
//         price: item.price,
//         text: item.description,
//         category: item.category,
//     });
//     gallery.appendChild(catalog);
// })

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//ТЕСТИРОВАНИЕ МОДЕЛЕЙ ДАННЫХ
// appData.saveProductList(testData);//подготовка данных
// console.log(appData.productList)//сам тест

// console.log(appData.showOneItem("854cef69-976d-4c2a-a18c-2aa45046c390"));

// appData.addItemtoBasket(testData.items[2])
// console.log(appData.basketList);

// appData.addItemtoBasket(testData.items[4])
// appData.addItemtoBasket(testData.items[3])
// appData.addItemtoBasket(testData.items[0])
// appData.addItemtoBasket(testData.items[1])
// console.log(appData.basketList)

// appData.removeItemFromBasket("1c521d84-c48d-48fa-8cfb-9d911fa515fd")
// console.log(appData.basketList)

// appData.resetBasket()
// console.log(appData.basketList)

// appData.getTotalSum();
// console.log(appData.getTotalSum())

// appData.getCountBasketItems();
// console.log(appData.getCountBasketItems());

// appData.formErrors = {email: 'Необходимо указать email'}
// console.log(appData.validationOrderInfoIsChecked());

// appData.validationOrderInfoIsChecked()
// console.log(appData.formErrors)
// appData.setOrderField('address', 'uuu' );
// appData.setOrderField('email', 'ffff');
// appData.setOrderFields({
//     email: "example@example.com",
//     phone: "123456789",
//     address: "123 Main St",
//     payment: "credit card"
// })
// appData.setOrder()
// console.log(appData.order)

// const baseApi: IApi = new Api(API_URL);
// const api = new AppApi(baseApi)
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

//блокировка скролла страницы при открытом модальном окне 
events.on('modal:open', () => {
    page.locked = true;
});

//снятие блокировки скролла страницы при открытом модальном окне 
events.on('modal:close', () => {
    page.locked = false;
});