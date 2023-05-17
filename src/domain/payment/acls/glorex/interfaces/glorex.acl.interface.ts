import { Pruchase } from '../model/purchase.model';
import { PruchaseResponse } from '../model/purchase.response';
import { Seller } from '../model/seller.model';

export interface IGlorexAcl {
  getPruchase(id: number): Promise<Pruchase>;
  processingPruchase(id: number): Promise<PruchaseResponse>;
  errorPruchase(id: number): Promise<PruchaseResponse>;
  confirmPruchase(id: number): Promise<PruchaseResponse>;
  getSeller(id: string): Promise<Seller>;
}
