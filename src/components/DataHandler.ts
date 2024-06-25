import { Model } from "./base/model";
import { IEvents, EventEmitter } from './base/events'
import { IItem, IDataHandler, IOrder, IFormErrors, TOrderForm } from "../types/index"


export class DataHandler extends Model<IDataHandler> {
    productList: IItem[] = [];
    basketList: IItem[] = [];
    preview: IItem; 
    total: number | null;
    order: IOrder = {
        email: '',
        phone: '',
        address: '',
        payment: '',
        items: [],
        total: 0
    };
    formErrors: IFormErrors = {};

    setProductList(items: IItem[]) {
        this.productList = items
        this.emitChanges('Info: loaded', { productList: this.productList}); 
    }

    showOneItem(id: string) {
    //возвращает объект открытой карточки для просмотра по id
        return this.productList.find(item => item.id === id);
    }

    //добавление товара в корзину
    addItemtoBasket(item: IItem) {
        this.basketList.push(item)
        this.emitChanges('basketData:changed', {basketList: this.basketList} );
    }
        
    //удаление товара из корзины
    removeItemFromBasket(id: string) {
        this.basketList = this.basketList.filter(item => item.id !== id);
        this.emitChanges('basketData:changed', {basketList: this.basketList} );
    }  


    resetBasket() { //очищает корзину
        this.basketList = [];
        this.emitChanges('basketData:changed', this.basketList);
    }

    resetOrder() { //очищает данные заказа после его успешного завершения
        this.order.payment = 'card';
        this.order.address = '';
        this.order.email = '';
        this.order.phone = '';
    }

    getTotalSum(): number { //рассчитывает общую сумму всех товаров 
        let sum = 0;
        this.basketList.forEach((item) => {
            sum += item.price;
        })
        return sum;
    }

    set _total(value : number) {
        this.total = value;
    }

    getCountBasketItems(): number {
        //возвращает количество товаров в корзине для дальнейшего отображения счетчика на главной
        return this.basketList.length;
    }
    

    //проверка на заполненность полей данными о способе оплаты и адресе
    validationOrderInfoIsChecked(): boolean {
		const errors: typeof this.formErrors = {}; //создает пустой объект errors, который имеет такой же тип, как и this.formErrors
        if (!this.order.payment) { //проверяет есть ли сво-во payment в объекте this.order
			errors.payment = 'Необходимо выбрать способ оплаты'; //Если payment не указано, добавляется сообщение об ошибке в объект errors под ключом payment
		}
		if (!this.order.address) { 
			errors.address = 'Необходимо указать адрес'; 
		}
		
		this.formErrors = errors; //Ошибки валидации сохраняются в свойство this.formErrors. Теперь this.formErrors содержит все ошибки, найденные в процессе проверки
		this.events.emit('formErrors:change', this.formErrors); //Событие form-payment:validation отправляется с объектом this.formErrors в качестве аргумента. Это событие обрабатывается в другой части приложения для отображения ошибок пользователю

		return Object.keys(errors).length === 0; //возвращает количество ключей в объекте errors, и если это значение равно нулю, то ошибок нет
	}

    
    //проверка на заполенность полей данными о емейле и телефоне
    validationUserInfoIsChecked(): boolean {
        const errors: typeof this.formErrors = {}; 
        if (!this.order.email) { 
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }

        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);

        return Object.keys(errors).length === 0;
    }
    
    setOrderFields(field: keyof TOrderForm , value: string) {
        this.order[field] = value;

        // Проверка наличия всех необходимых данных и отправка события, если они есть
        if (this.validationOrderInfoIsChecked() && this.validationUserInfoIsChecked()) {
            this.events.emit('order:ready', this.order);
        }
    }

    //добавление id продукта в поле заказа
    setOrder() {
            if(this.basketList.length !== 0) {
                this.order.items = this.basketList.map(item => item.id);
                this.emitChanges('datapaymentform:opened');
            } 
        }

    setPreview(id: string){
            const cardItem = this.showOneItem(id)
            this.preview = cardItem;
            this.emitChanges('preview:changed');
        }  
        
    getPreview() {
        return this.preview;
    }
    
    getBasketList(): IItem[] {
        return this.basketList;
    }

    setPaymentType (value: string) {
        this.order.payment = value;
        this.emitChanges('paymentType:buttonSelected', {payment: this.payment})
    }
    
    get payment() {
        return this.order.payment
    }

    
}













