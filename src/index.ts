import './scss/styles.scss';
import { DataHandler } from './components/DataHandler';
import { EventEmitter } from './components/base/events'
import { AppApi} from './components/AppApi';
import { API_URL, CDN_URL, options, colorSetting} from './utils/constants';
import { Page } from './components/Page'
import { Card, ICard } from './components/Card';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { Modal } from './components/Modal';
import { Basket } from './components/Basket';
import { PaymentAddressForm } from './components/PaymentAdressForm';
import type { IItem, TOrderForm } from './types/index';
import { ContactsForm } from './components/EmailPhoneForm';
import { SuccessOrder } from './components/SuccessOrder';


const events = new EventEmitter();

const api = new AppApi(CDN_URL, API_URL, options);

const gallery = document.querySelector('.gallery');

const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const adressPaymentTemplate = ensureElement<HTMLTemplateElement>("#order");
const contactsFormTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successOrderTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const modalContainer = ensureElement<HTMLElement>('.modal');
const basket = ensureElement<HTMLTemplateElement>("#basket");
const cardInBasket = ensureElement<HTMLTemplateElement>("#card-basket");

const paymentAddressForm = new PaymentAddressForm(cloneTemplate(adressPaymentTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsFormTemplate), events);
const successOrder = new SuccessOrder(cloneTemplate(successOrderTemplate), events);

const page = new Page(document.body, events);
const modal = new Modal(modalContainer, events);
const dataHandler = new DataHandler({}, events);
const basketComponent = new Basket(cloneTemplate(basket), events);


//ПОЛУЧЕНИЕ МАССИВА КАРТОЧЕК С СЕРВЕРА
api.getItems()
  .then((res) => {
    dataHandler.setProductList(res)
    events.emit('Info: loaded')
  })
  .catch(err => {
    console.log(err)
    modal.render({
    content: createElement<HTMLParagraphElement>('p', {
      textContent: 'Ошибка сервера. Повторите попытку позже.'
        })
      })
    }
  );

//ВЫВОД КАРТОЧЕК НА ГЛАВНОЙ СТРАНИЦЕ
events.on('Info: loaded', () => {
    dataHandler.productList.forEach(item => {
        const card = new Card('card', cloneTemplate(cardTemplate), events)
      
        const catalog = card.render({
            title: item.title,
            image: item.image,
            price: item.price,
            description: item.description,
            category: item.category,
            id: item.id,
        });
        gallery.appendChild(catalog);
    })
})

//ПРЕВЬЮ КАРТОЧКИ ПО КЛИКУ 
events.on('card:selected', (data: {id: string}) => {
    dataHandler.setPreview(data.id) 
})

events.on('preview:changed', () => {
    const card = new Card ('card', cloneTemplate(cardPreviewTemplate), events);
    const preview = dataHandler.getPreview();
    const basketItem = dataHandler.getBasketList(); 
    
    if (!basketItem.find(item => {return item.id === preview.id})) {
        card.textButton = 'В корзину'
    } else {
        card.textButton = 'Удалить'
    }
    
    const cardElement = card.render({
        description: preview.description,
        image: preview.image,
        title: preview.title,
        category: preview.category,
        price: preview.price,
        id: preview.id
    })

    modal.render({content: cardElement});
})

//ОТКРЫТИЕ МОДАЛЬНОГО ОКНА СО СПИСКОМ ТОВАРОВ ПРИ КЛИКЕ НА ИКОНКУ КОРЗИНЫ НА ГЛАВНОЙ
events.on('basketIs:opened', (itemList: {basketList: IItem[]}) => {
    const basketArrayItems: HTMLElement[] = dataHandler.basketList.map((item, index) => {
        const basketCard = new Card('card', cloneTemplate(cardInBasket), events);
          return basketCard.render({
            title: item.title,
            price: item.price,
            itemNumber: index +1
        })
    })

    const total = dataHandler.getTotalSum()
    modal.render({
            content: basketComponent.render({
            items: basketArrayItems,
            total: total 
        })
    })
})

//ДОБАВЛЕНИЕ/УДАЛЕНИЕ ТОВАРА В СПИСОК/ИЗ СПИСКА ТОВАРОВ ПРИ КЛИКЕ НА КНОПКУ  
events.on('item:updateBasket',  () => {
    const preview = dataHandler.getPreview();
    const basketItem = dataHandler.getBasketList();

    if (!basketItem.find(item => {return item.id === preview.id})) {
        dataHandler.addItemtoBasket(preview);
    } else {
        dataHandler.removeItemFromBasket(preview.id);
    }
    dataHandler.setPreview(preview.id);
}) 

events.on('item:addToBasket',  () => {
    const preview = dataHandler.getPreview();
    const basketItems = dataHandler.getBasketList();

    if (!basketItems.find(item => {return item.id === preview.id})) {
        dataHandler.addItemtoBasket(preview);
        dataHandler.setPreview(preview.id)
    }
})

events.on('item:rmFromBasket',  (data: {id: string}) => {
    dataHandler.removeItemFromBasket(data.id)
}) 



//ИЗМЕНЕНИЕ СЧЕТЧИКА НА ГЛАВНОЙ
events.on('basketData:changed', (newList: {basketList: IItem[]})  => {
    const counterData = dataHandler.getCountBasketItems();
    page.render({
        counter: counterData
    })
    const basketArrayItems: HTMLElement[] = dataHandler.basketList.map((item, index) => {
        const basketCard = new Card('card', cloneTemplate(cardInBasket), events);
          return basketCard.render({
            title: item.title,
            price: item.price,
            itemNumber: index +1
        })
    })

    const total = dataHandler.getTotalSum()
    modal.render({
            content: basketComponent.render({
            items: basketArrayItems,
            total: total 
        })
    })
})

//ДОБАВЛЕНИЕ id ВЫБРАННЫХ ТОВАРОВ В ЗАКАЗ
events.on('orderItems:added', () => {
    dataHandler.setOrder()
    const totalSum = dataHandler.getTotalSum();
    dataHandler.order.total = totalSum;
})

//ОТКРЫТИЕ МОДАЛЬНОГО ОКНА С ФОРМОЙ ОПЛАТЫ
events.on('datapaymentform:opened', () => {
    modal.render({
    content: paymentAddressForm.render({
        address: '',
        payment: '',
        valid: false,
        errors: []
        })
    })
})

events.on('paymentOnLine:selected', () => {
    dataHandler.setPaymentType('online');
 })
 
events.on('paymentCash:selected', () => {
     dataHandler.setPaymentType('cash')
 })

//ОТКРЫТИЕ МОДАЛЬНОГО ОКНА ЗАКАЗА
events.on(`order:submit`, () => {
    modal.render({
    content: contactsForm.render({
        valid: false,
        errors: []
        })
    })
})

//ОТПРАВКА ЗАКАЗА
events.on(`contacts:submit`, () => {
    api.createOrder(dataHandler.order)
    .then(res => {
        dataHandler.resetBasket;
        dataHandler.resetOrder();
        events.emit('orderCreate:success')
        modal.render({
          content: successOrder.render({total:res.total})
        })
      })
      .catch(err => {
        console.log(err)
        modal.render({
        content: createElement<HTMLParagraphElement>('p', {
          textContent: 'Ошибка сервера. Повторите попытку позже.'
            })
          })
        }
      );
})

//ОЧИСТКА ЗАКАЗА И ЗАКРЫТИЕ МОДАЛЬНОГО ОКНА УСПЕШНОГО ЗАКАЗА
events.on('order:created', () => {
    dataHandler.resetBasket();
    paymentAddressForm.clearAddressField();
    contactsForm.clearContactsFormFields()
    modal.closeModalWindow();
})

//ВАЛИДАЦИЯ ДАННЫХ
 events.on('formErrors:change', (errors: Partial<TOrderForm >) => {
    const {email, phone, address, payment} = errors;
    paymentAddressForm.valid = !address && !payment;
    paymentAddressForm.errors = Object.values({address, payment}).filter(i => !!i).join('; ');
    contactsForm.valid = !email && !phone;
    contactsForm.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
  });

  events.on('formErrors:change', (errors: Partial<TOrderForm>) => {
    const {email, phone, address, payment} = errors;
    paymentAddressForm.valid = !address && !payment;
    paymentAddressForm.errors = Object.values({address, payment}).filter(i => !!i).join('; ');
    contactsForm.valid = !email && !phone;
    contactsForm.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
  });
  
  // ИЗМЕНИЛИСЬ ДАННЫЕ В ПОЛЕ
  events.on(/^order\..*:change/, (data: { field: keyof TOrderForm, value: string }) => {
    dataHandler.setOrderFields(data.field, data.value);
  });
  
  events.on(/^contacts\..*:change/, (data: { field: keyof TOrderForm, value: string }) => {
    dataHandler.setOrderFields(data.field, data.value);
  });


//БЛОКИРУЕМ СКРОЛЛ СТРАНИЦЫ ПРИ ОТКРЫТОМ МОДАЛЬНОМ ОКНЕ
events.on('modal:open', () => {
    page.locked = true;
});

//СНИММАЕМ БЛОК СКРОЛЛА СТРАНИЦЫ ПРИ ЗАКРЫТОМ МОДАЛЬНОМ ОКНЕ
events.on('modal:close', () => {
    page.locked = false;
});



