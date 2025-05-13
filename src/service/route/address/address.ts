import { CityAttributes } from "../city/city"

export interface AddressAttributes{
    id: Number
    street: String
    number: Number
    neighborhood: string
    cep: Number
    city: CityAttributes
}