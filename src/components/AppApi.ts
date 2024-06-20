import { Api, ApiListResponse } from '../components/base/api';
import { IItem, IOrder, IOrderResult } from '../types/index';

export interface IApi {
    getItems: () => Promise<IItem[]>;
    createOrder: (order: IOrder) => Promise<IOrderResult>;
}

export class AppApi extends Api implements IApi {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getItems(): Promise<IItem[]> {
        return this.get('/product/').then((data: ApiListResponse<IItem>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }

    createOrder(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order).then(
            (data: IOrderResult) => data
        );
    }
}